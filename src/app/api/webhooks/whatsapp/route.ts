import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { evolutionService } from "@/services/evolutionService";
import { geminiCopilotService, type CopilotMessageInput } from "@/services/geminiCopilotService";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

function formatProposal(name: string, args: Record<string, any>): string {
  if (name.includes("payment")) {
    const rest = args.is_partial ? `• Abono parcial (Resta: $${Number(args.remaining_amount || 0).toLocaleString("es-CO")})\n` : "";
    return `📋 *PROPUESTA DE PAGO*\n• Negocio: *${args.business_id}*\n• Monto: *$${Number(args.amount).toLocaleString("es-CO")}*\n• Método: *${args.payment_method || "Nequi"}*\n${rest}👉 Responde *CONFIRMADO* para aplicar o *CANCELAR* para anular.`;
  }
  if (name.includes("expense")) {
    return `📋 *PROPUESTA DE GASTO OPEX*\n• Categoría: *${args.category}*\n• Monto: *$${Number(args.amount).toLocaleString("es-CO")}*\n• Cuenta: *${args.account_code || "Caja"}*\n• Detalle: ${args.description}\n👉 Responde *CONFIRMADO* para aplicar o *CANCELAR* para anular.`;
  }
  if (name.includes("task")) {
    return `📋 *PROPUESTA DE AGENDA*\n• Título: *${args.title}*\n• Tipo: *${args.task_type}*\n• Fecha: *${args.due_date}* ${args.due_time || ""}\n👉 Responde *CONFIRMADO* para agendar o *CANCELAR* para anular.`;
  }
  return `📋 *PROPUESTA DE ACCIÓN*\n• Detalles: ${JSON.stringify(args)}\n👉 Responde *CONFIRMADO* para aplicar o *CANCELAR* para anular.`;
}

async function executeAction(supabase: ReturnType<typeof getSupabase>, action: any) {
  const p = action.payload;
  if (action.action_type === "register_payment") {
    let accountId = p.account_id;
    if (!accountId && p.payment_method) {
      const { data: acc } = await supabase.from("financial_accounts").select("id").eq("code", p.payment_method).maybeSingle();
      accountId = acc?.id;
    }
    let businessId = p.business_id;
    if (businessId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(businessId)) {
      const { data: b } = await supabase.from("businesses").select("id").or(`slug.eq.${businessId},name.ilike.%${businessId}%`).limit(1).maybeSingle();
      if (b) businessId = b.id;
    }
    const { data: rpcRes, error } = await supabase.rpc("apply_confirmed_membership_payment", {
      p_business_id: businessId,
      p_account_id: accountId,
      p_amount: Number(p.amount),
      p_payment_method: p.payment_method || "nequi",
      p_extension_days: Number(p.extension_days || 30),
      p_notes: p.notes || null,
      p_is_partial: Boolean(p.is_partial),
      p_commitment_id: p.commitment_id || null,
      p_remaining_amount: Number(p.remaining_amount || 0),
      p_remaining_due_date: p.remaining_due_date || null,
    });
    if (error) throw error;
    return `✅ ¡Pago registrado con éxito!\n📄 Recibo: *${rpcRes?.receipt_code || "Emitido"}*\n💵 Monto: $${Number(p.amount).toLocaleString("es-CO")}\n📅 Próximo corte: ${rpcRes?.next_payment_date || "Calculado"}`;
  }
  if (action.action_type === "register_expense") {
    let accountId = p.account_id;
    if (!accountId && p.account_code) {
      const { data: acc } = await supabase.from("financial_accounts").select("id").eq("code", p.account_code).maybeSingle();
      accountId = acc?.id;
    }
    const { data: rpcRes, error } = await supabase.rpc("apply_confirmed_expense", {
      p_account_id: accountId,
      p_category: p.category,
      p_amount: Number(p.amount),
      p_description: p.description,
      p_related_business_id: p.related_business_id || null,
    });
    if (error) throw error;
    return `✅ Gasto OPEX registrado.\n📉 Descontado: $${Number(p.amount).toLocaleString("es-CO")} de ${rpcRes?.account_name || "caja"}.`;
  }
  if (action.action_type === "register_transfer") {
    const { error } = await supabase.rpc("apply_account_transfer", {
      p_source_account_id: p.source_account_id,
      p_destination_account_id: p.destination_account_id,
      p_amount: Number(p.amount),
      p_fee: Number(p.fee || 0),
      p_notes: p.notes || null,
    });
    if (error) throw error;
    return `✅ Transferencia ejecutada: $${Number(p.amount).toLocaleString("es-CO")}.`;
  }
  if (action.action_type === "schedule_task") {
    const { error } = await supabase.from("ceo_tasks").insert({
      title: p.title,
      task_type: p.task_type || "visita",
      due_date: p.due_date,
      due_time: p.due_time || null,
      business_id: p.business_id || null,
      priority: p.priority || "media",
    });
    if (error) throw error;
    return `✅ Tarea agendada en tu lista de CEO: *${p.title}* para el ${p.due_date}.`;
  }
  return "✅ Acción ejecutada con éxito.";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const key = body.data?.key || body.key || {};
  if (key.fromMe) return NextResponse.json({ ignored: true, reason: "Self message" });

  const remoteJid = key.remoteJid || body.data?.sender || "";
  const senderPhone = remoteJid.replace(/@s\.whatsapp\.net|@g\.us/g, "").replace(/\D/g, "");
  const ceoPhone = (process.env.CEO_PHONE_NUMBER || "").replace(/\D/g, "");

  // 1. Filtro estricto por remitente autorizado (Cristian)
  if (!ceoPhone || senderPhone !== ceoPhone) {
    return NextResponse.json({ ignored: true, reason: "Unauthorized sender" });
  }

  const messageId = key.id || body.data?.messageId || body.messageId;
  if (!messageId) return NextResponse.json({ ignored: true, reason: "No message ID" });

  const supabase = getSupabase();

  // 2. Control de idempotencia (<10 ms)
  const { data: alreadyProcessed } = await supabase
    .from("processed_webhook_events")
    .select("message_id")
    .eq("message_id", messageId)
    .maybeSingle();

  if (alreadyProcessed) {
    return NextResponse.json({ ignored: true, reason: "Duplicate event" });
  }

  await supabase.from("processed_webhook_events").insert({
    message_id: messageId,
    sender_phone: senderPhone,
    event_type: body.event || "messages.upsert",
  });

  // 3. Extracción de contenido (Texto, Audio, Imagen en RAM)
  const msg = body.data?.message || body.message || {};
  const text = (msg.conversation || msg.extendedTextMessage?.text || msg.imageMessage?.caption || msg.audioMessage?.caption || body.data?.text || "").trim();
  const audioObj = msg.audioMessage || (body.data?.mediaType === "audio" ? body.data : null);
  const imageObj = msg.imageMessage || (body.data?.mediaType === "image" ? body.data : null);

  let media: { mimeType: string; data: string } | undefined;
  const rawBase64 = audioObj?.base64 || imageObj?.base64 || body.data?.base64 || body.base64;
  if (rawBase64 && typeof rawBase64 === "string") {
    media = {
      mimeType: audioObj?.mimetype || imageObj?.mimetype || (audioObj ? "audio/ogg" : "image/jpeg"),
      data: rawBase64.replace(/^data:[^;]+;base64,/, ""),
    };
  }

  // 4. Ruta Rápida: Confirmación ('CONFIRMADO') (<50 ms, 0 tokens)
  const normText = text.toUpperCase();
  if (normText === "CONFIRMADO" || normText === "CONFIRMAR") {
    const { data: action } = await supabase.from("pending_actions").select("*").eq("channel", "whatsapp").eq("status", "pending").gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!action) {
      await evolutionService.sendMessage(senderPhone, "⚠️ No tienes ninguna propuesta pendiente por confirmar o ya expiró (TTL 10m).");
      return NextResponse.json({ success: true, action: "none_pending" });
    }
    try {
      const confirmationMsg = await executeAction(supabase, action);
      await supabase.from("pending_actions").update({ status: "executed", executed_at: new Date().toISOString() }).eq("id", action.id);
      await evolutionService.sendMessage(senderPhone, confirmationMsg);
      return NextResponse.json({ success: true, action: "executed" });
    } catch (err: any) {
      await evolutionService.sendMessage(senderPhone, `❌ Error al ejecutar la acción: ${err?.message || "Error transaccional"}`);
      return NextResponse.json({ error: err?.message }, { status: 500 });
    }
  }

  // 5. Ruta Rápida: Cancelación ('CANCELAR') (<20 ms, 0 tokens)
  if (normText === "CANCELAR" || normText === "ANULAR") {
    const { data: action } = await supabase.from("pending_actions").select("id").eq("channel", "whatsapp").eq("status", "pending").gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (action) await supabase.from("pending_actions").update({ status: "cancelled" }).eq("id", action.id);
    await evolutionService.sendMessage(senderPhone, "❌ Acción cancelada. No se ejecutó ningún movimiento en el sistema.");
    return NextResponse.json({ success: true, action: "cancelled" });
  }

  // 6. Kill Switch
  if (process.env.COPILOT_ENABLED === "false") {
    await evolutionService.sendMessage(senderPhone, "⚠️ El Agente FOWY está en mantenimiento preventivo temporal. El CRM manual continúa activo.");
    return NextResponse.json({ ignored: true, reason: "Copilot disabled" });
  }

  // 7. Invalidación por 'superseded' de acciones previas no confirmadas
  await supabase.from("pending_actions").update({ status: "superseded" }).eq("channel", "whatsapp").eq("status", "pending");

  // 8. Inferencia Multimodal con Gemini 1.5 Flash
  const [summaryRes, growthRes] = await Promise.all([
    supabase.rpc("get_admin_finance_summary"),
    supabase.rpc("get_network_growth_summary"),
  ]);

  const liveContext = {
    current_time_colombia: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
    summary: summaryRes.data,
    network_growth: growthRes.data,
    channel: "whatsapp",
  };

  const promptInput: CopilotMessageInput = {
    role: "user",
    text: text || "Analiza el audio o comprobante adjunto.",
    media,
  };

  const geminiRes = await geminiCopilotService.generateResponse([promptInput], liveContext);

  if (geminiRes.functionCall) {
    const { name, args } = geminiRes.functionCall;
    const actionType = name.replace("prepare_", "register_").replace("schedule_secretary_task", "schedule_task");

    await supabase.from("pending_actions").insert({
      channel: "whatsapp",
      action_type: actionType,
      payload: args,
      status: "pending",
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    const proposalMsg = formatProposal(name, args);
    await evolutionService.sendMessage(senderPhone, proposalMsg);
  } else if (geminiRes.text) {
    await evolutionService.sendMessage(senderPhone, geminiRes.text);
  }

  return NextResponse.json({ success: true });
}
