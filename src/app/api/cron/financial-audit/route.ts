import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { evolutionService } from "@/services/evolutionService";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

function getColombiaDate(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
}

function verifyAuth(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authHeader = req.headers.get("authorization");
  const keyQuery = req.nextUrl.searchParams.get("key");
  return authHeader === `Bearer ${secret}` || keyQuery === secret;
}

async function handleNightlyClose(supabase: ReturnType<typeof getSupabase>) {
  const today = getColombiaDate();
  const todayStart = `${today}T00:00:00.000Z`;

  const [summaryRes, paymentsRes, expensesRes, tasksRes, commitmentsRes] = await Promise.all([
    supabase.rpc("get_admin_finance_summary"),
    supabase.from("membership_payments").select("amount").gte("created_at", todayStart),
    supabase.from("operational_expenses").select("amount").gte("created_at", todayStart),
    supabase.from("ceo_tasks").select("id, title, status, priority").eq("due_date", today),
    supabase.from("payment_commitments").select("id, business_id, amount, status").eq("due_date", today),
  ]);

  const summary = summaryRes.data || {};
  const counts = summary.counts || {};
  const metrics = summary.metrics || {};

  const dailyIncome = (paymentsRes.data || []).reduce((acc: number, p: any) => acc + Number(p.amount || 0), 0);
  const dailyExpenses = (expensesRes.data || []).reduce((acc: number, e: any) => acc + Number(e.amount || 0), 0);
  const dailyNet = dailyIncome - dailyExpenses;

  const executiveSummary = `Cierre contable ${today}: Recaudo $${dailyIncome.toLocaleString("es-CO")}, OPEX $${dailyExpenses.toLocaleString("es-CO")}, Neto día $${dailyNet.toLocaleString("es-CO")}. MTD Neto: $${Number(metrics.net_profit || 0).toLocaleString("es-CO")}. Activos: ${counts.active || 0}, Prueba: ${counts.trial || 0}.`;
  const morningBriefingText = `Balance preliminar para apertura de agenda. Liquidez disponible en cuentas activas.`;

  const reportPayload = {
    report_date: today,
    total_active_businesses: Number(counts.active || 0),
    businesses_in_trial: Number(counts.trial || 0),
    businesses_due_today: Number(counts.grace_period || 0),
    businesses_in_grace: Number(counts.grace_period || 0),
    businesses_suspended: Number(counts.suspended || 0),
    daily_income: dailyIncome,
    daily_expenses: dailyExpenses,
    daily_net: dailyNet,
    month_to_date_income: Number(metrics.month_income || 0),
    month_to_date_expenses: Number(metrics.month_expenses || 0),
    month_to_date_net: Number(metrics.net_profit || 0),
    pending_receivables: Number(metrics.pending_receivables || 0),
    executive_summary: executiveSummary,
    morning_briefing_text: morningBriefingText,
    tasks_scheduled_today: tasksRes.data || [],
    commitments_due: commitmentsRes.data || [],
    urgent_actions: counts.grace_period > 0 ? [{ type: "morosidad", count: counts.grace_period }] : [],
    ai_cfo_recommendations: dailyExpenses > dailyIncome ? "Alerta: Egresos del día superaron el recaudo. Auditar viáticos de calle." : "Operación saludable.",
  };

  const { error: upsertErr } = await supabase.from("daily_financial_reports").upsert(reportPayload, { onConflict: "report_date" });
  if (upsertErr) throw upsertErr;

  // Purga de eventos mayores a 7 días en processed_webhook_events
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  await supabase.from("processed_webhook_events").delete().lt("created_at", sevenDaysAgo);

  return { action: "nightly_close", report_date: today, daily_income: dailyIncome, daily_net: dailyNet };
}

async function handleMorningBriefing(supabase: ReturnType<typeof getSupabase>) {
  const today = getColombiaDate();

  const [summaryRes, tasksRes, commitmentsRes] = await Promise.all([
    supabase.rpc("get_admin_finance_summary"),
    supabase.from("ceo_tasks").select("title, task_type, due_time, priority").eq("due_date", today).eq("status", "pending"),
    supabase.from("payment_commitments").select("amount, business_id").eq("due_date", today).eq("status", "pending"),
  ]);

  const summary = summaryRes.data || {};
  const metrics = summary.metrics || {};
  const accounts = summary.accounts || [];

  const nequi = accounts.find((a: any) => a.code === "nequi")?.current_balance || 0;
  const bancolombia = accounts.find((a: any) => a.code === "bancolombia")?.current_balance || 0;
  const cash = accounts.find((a: any) => a.code === "cash")?.current_balance || 0;

  const tasks = tasksRes.data || [];
  const commitments = commitmentsRes.data || [];
  const totalDue = commitments.reduce((acc: number, c: any) => acc + Number(c.amount || 0), 0);

  const taskLines = tasks.length > 0
    ? tasks.slice(0, 4).map((t: any) => `  • [${t.priority.toUpperCase()}] ${t.title} ${t.due_time ? `(${t.due_time})` : ""}`).join("\n")
    : "  • Sin mandados específicos agendados para hoy.";

  const briefingText = `🌅 *MORNING BRIEFING FOWY — ${today}*\n\n` +
    `📊 *LIQUIDEZ EN CAJA:*\n` +
    `• Nequi: $${Number(nequi).toLocaleString("es-CO")}\n` +
    `• Bancolombia: $${Number(bancolombia).toLocaleString("es-CO")}\n` +
    `• Efectivo: $${Number(cash).toLocaleString("es-CO")}\n` +
    `• Recaudo Mes: $${Number(metrics.month_income || 0).toLocaleString("es-CO")} | Diezmo: $${Number(metrics.tithing || 0).toLocaleString("es-CO")}\n\n` +
    `📋 *AGENDA DEL DÍA (${tasks.length}):*\n${taskLines}\n\n` +
    `💵 *COBROS PROGRAMADOS HOY:*\n` +
    `• ${commitments.length} compromiso(s) por recaudar: *$${totalDue.toLocaleString("es-CO")}*\n\n` +
    `💡 *ENFOQUE DIRECTIVO:*\n` +
    `Cobranza oportuna y visitas a restaurantes para asegurar renovaciones. ¡Buen día de trabajo!`;

  await evolutionService.notifyCeo(briefingText);

  return { action: "morning_briefing", date: today, tasks_count: tasks.length, commitments_count: commitments.length };
}

async function runCron(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "No autorizado: CRON_SECRET inválido o ausente" }, { status: 401 });
  }

  const action = req.nextUrl.searchParams.get("action");
  const supabase = getSupabase();

  try {
    if (action === "nightly_close") {
      const result = await handleNightlyClose(supabase);
      return NextResponse.json({ success: true, ...result });
    }

    if (action === "morning_briefing") {
      const result = await handleMorningBriefing(supabase);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: "Acción no válida. Usar ?action=nightly_close o ?action=morning_briefing" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error ejecutando cron" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return runCron(req);
}

export async function POST(req: NextRequest) {
  return runCron(req);
}
