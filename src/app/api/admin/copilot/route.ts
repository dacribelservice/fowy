import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { geminiCopilotService, type CopilotMessageInput } from "@/services/geminiCopilotService";
import type { PendingActionDTO } from "@/types/finance";

export const dynamic = "force-dynamic";

/**
 * Endpoint orquestador del Copilot IA de Finanzas y Agenda FOWY (CFO & Secretaria).
 * Soporta inferencia multimodal en RAM, snapshot contable en <20ms y Two-Step Confirmation.
 */
export async function POST(req: NextRequest) {
  // 1. Evaluación del Kill Switch
  if (process.env.COPILOT_ENABLED === "false") {
    return NextResponse.json({
      text: "⚠️ El Copilot IA se encuentra temporalmente en pausa por mantenimiento preventivo. El CRM manual continúa 100% operativo.",
    });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Acceso denegado: sesión no iniciada" }, { status: 401 });
  }

  // Verificación de rol admin o super_admin (metadata o tabla profiles)
  const metaRole = user.app_metadata?.role || user.user_metadata?.role;
  let isAdmin = metaRole === "admin" || metaRole === "super_admin";

  if (!isAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
  }

  if (!isAdmin && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Acceso denegado: requiere rol admin" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { message, media, updatedPayload } = body;
  const confirmActionId = body.confirmActionId || (body.action === "confirm" ? body.actionId : undefined);
  const cancelActionId = body.cancelActionId || (body.action === "cancel" ? body.actionId : undefined);

  // 2. Ruta Rápida: Cancelación de Acción (<20 ms)
  if (cancelActionId) {
    await supabase.from("pending_actions").update({ status: "cancelled" }).eq("id", cancelActionId);
    return NextResponse.json({ text: "❌ Acción cancelada. No se modificaron fondos." });
  }

  // 3. Ruta Rápida: Confirmación en Dos Pasos (<50 ms, 0 tokens)
  if (confirmActionId) {
    const { data: action } = await supabase
      .from("pending_actions")
      .select("*")
      .eq("id", confirmActionId)
      .eq("status", "pending")
      .single();

    if (!action) {
      return NextResponse.json({ error: "La acción ya fue procesada o no existe" }, { status: 400 });
    }
    if (new Date(action.expires_at).getTime() < Date.now()) {
      await supabase.from("pending_actions").update({ status: "expired" }).eq("id", confirmActionId);
      return NextResponse.json({ error: "La propuesta expiró (TTL 10 min). Solicítala nuevamente." }, { status: 400 });
    }

    const payload = { ...action.payload, ...updatedPayload };
    let receipt: any = null;
    let successText = "✅ Acción ejecutada con éxito.";

    if (action.action_type === "register_payment") {
      let accountId = payload.account_id;
      if (!accountId && payload.payment_method) {
        const { data: acc } = await supabase.from("financial_accounts").select("id").eq("code", payload.payment_method).maybeSingle();
        accountId = acc?.id;
      }

      let businessId = payload.business_id;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (businessId && !uuidRegex.test(businessId)) {
        const { data: b } = await supabase.from("businesses").select("id").or(`slug.eq.${businessId},name.ilike.%${businessId}%`).limit(1).maybeSingle();
        if (b) businessId = b.id;
      }

      const { data: rpcRes, error: rpcErr } = await supabase.rpc("apply_confirmed_membership_payment", {
        p_business_id: businessId,
        p_account_id: accountId,
        p_amount: Number(payload.amount),
        p_payment_method: payload.payment_method || "nequi",
        p_extension_days: Number(payload.extension_days || 30),
        p_notes: payload.notes || null,
        p_is_partial: Boolean(payload.is_partial),
        p_commitment_id: payload.commitment_id || null,
        p_remaining_amount: Number(payload.remaining_amount || 0),
        p_remaining_due_date: payload.remaining_due_date || null,
      });

      if (rpcErr) return NextResponse.json({ error: rpcErr.message }, { status: 500 });
      receipt = rpcRes;
      successText = `✅ ¡Pago registrado con éxito! Recibo oficial ${rpcRes?.receipt_code || "generado"}.`;
    } else if (action.action_type === "register_expense") {
      let accountId = payload.account_id;
      if (!accountId && payload.account_code) {
        const { data: acc } = await supabase.from("financial_accounts").select("id").eq("code", payload.account_code).maybeSingle();
        accountId = acc?.id;
      }
      const { data: rpcRes, error: rpcErr } = await supabase.rpc("apply_confirmed_expense", {
        p_account_id: accountId,
        p_category: payload.category,
        p_amount: Number(payload.amount),
        p_description: payload.description,
        p_related_business_id: payload.related_business_id || null,
      });
      if (rpcErr) return NextResponse.json({ error: rpcErr.message }, { status: 500 });
      successText = `✅ Gasto registrado. Se descontaron $${Number(payload.amount).toLocaleString("es-CO")} de ${rpcRes?.account_name || "caja"}.`;
    } else if (action.action_type === "register_transfer") {
      const { error: rpcErr } = await supabase.rpc("apply_account_transfer", {
        p_source_account_id: payload.source_account_id,
        p_destination_account_id: payload.destination_account_id,
        p_amount: Number(payload.amount),
        p_fee: Number(payload.fee || 0),
        p_notes: payload.notes || null,
      });
      if (rpcErr) return NextResponse.json({ error: rpcErr.message }, { status: 500 });
      successText = "✅ Traspaso de fondos ejecutado correctamente.";
    }

    await supabase.from("pending_actions").update({ status: "executed", executed_at: new Date().toISOString() }).eq("id", confirmActionId);
    return NextResponse.json({ text: successText, receipt });
  }

  // 4. Inyección de Snapshot Operativo en Vivo (<20 ms)
  const [summaryRes, growthRes] = await Promise.all([
    supabase.rpc("get_admin_finance_summary"),
    supabase.rpc("get_network_growth_summary"),
  ]);

  const liveContext = {
    current_time_colombia: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
    summary: summaryRes.data,
    network_growth: growthRes.data,
  };

  // 5. Inferencia Multimodal con Gemini 1.5 Flash
  const inputMessages: CopilotMessageInput[] = [
    {
      role: "user",
      text: message || (media ? "Analiza esta imagen y extrae los datos para preparar la transacción contable correspondiente." : "¿Cómo van las finanzas hoy?"),
      media: media ? { mimeType: media.mimeType, data: media.data } : undefined,
    },
  ];

  const result = await geminiCopilotService.generateResponse(inputMessages, liveContext);
  if (result.error) {
    return NextResponse.json({ text: `⚠️ ${result.error}` }, { status: 200 });
  }

  // 6. Manejo de Herramientas de Function Calling
  if (result.functionCall) {
    const { name, args } = result.functionCall;

    if (name === "get_cfo_financial_summary" || name === "get_network_growth_summary") {
      const toolData = name === "get_cfo_financial_summary" ? summaryRes.data : growthRes.data;
      const followUp = await geminiCopilotService.generateResponse([
        ...inputMessages,
        { role: "model", functionCall: result.functionCall },
        { role: "user", functionResponse: { name, response: toolData } },
      ], liveContext);
      return NextResponse.json({ text: followUp.text || result.text });
    }

    if (name === "query_business_dossier") {
      const { data: dossier } = await supabase.rpc("get_business_dossier", { p_business_identifier: args.business_identifier });
      const followUp = await geminiCopilotService.generateResponse([
        ...inputMessages,
        { role: "model", functionCall: result.functionCall },
        { role: "user", functionResponse: { name, response: dossier || {} } },
      ], liveContext);
      return NextResponse.json({ text: followUp.text || result.text });
    }

    if (name === "schedule_secretary_task") {
      await supabase.from("ceo_tasks").insert({
        title: args.title,
        task_type: args.task_type,
        due_date: args.due_date,
        due_time: args.due_time || null,
        business_id: args.business_id || null,
        priority: args.priority || "media",
        status: "pending",
      });
      return NextResponse.json({ text: `📅 Tarea agendada para el ${args.due_date}: "${args.title}".` });
    }

    const actionTypeMap: Record<string, "register_payment" | "register_expense" | "register_transfer"> = {
      prepare_payment_action: "register_payment",
      prepare_expense_action: "register_expense",
      prepare_account_transfer_action: "register_transfer",
    };

    const actionType = actionTypeMap[name];
    if (actionType) {
      await supabase.from("pending_actions").update({ status: "superseded" }).eq("channel", "web").eq("status", "pending");

      const { data: pendingAction } = await supabase
        .from("pending_actions")
        .insert({
          channel: "web",
          action_type: actionType,
          payload: args,
          status: "pending",
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          user_id: user?.id,
        })
        .select()
        .single();

      return NextResponse.json({
        text: result.text || "He preparado la transacción. Por favor verifica y confirma los datos:",
        pendingAction: pendingAction as PendingActionDTO,
      });
    }
  }

  return NextResponse.json({ text: result.text || "Instrucción recibida." });
}
