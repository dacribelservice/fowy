"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { 
  ShieldCheck, Calendar, Receipt, Share2, 
  Layers, PackageCheck, AlertCircle, ArrowUpRight, Loader2 
} from "lucide-react";

interface Props {
  businessId: string;
}

export function BusinessSubscriptionReadOnlyView({ businessId }: Props) {
  const [data, setData] = useState<any>(null);
  const [lastPayment, setLastPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const supabase = createClient();
        const [dossierRes, paymentRes] = await Promise.all([
          supabase.rpc("get_business_dossier", { p_business_identifier: businessId }),
          supabase.from("membership_payments")
            .select("receipt_code, amount, payment_method, created_at")
            .eq("business_id", businessId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);
        setData(dossierRes.data);
        setLastPayment(paymentRes.data);
      } catch (err) {
        console.error("Error loading finance dossier:", err);
      } finally {
        setLoading(false);
      }
    }
    if (businessId) loadData();
  }, [businessId]);

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-fowy-primary" />
        <span className="text-xs font-semibold">Sincronizando con Finanzas FOWY...</span>
      </div>
    );
  }

  const biz = data?.business || {};
  const status = biz.subscription_status || "trial";
  const modules = typeof biz.modules === "object" && biz.modules ? biz.modules : { standard: true };
  const deliverables = typeof biz.deliverables === "object" && biz.deliverables ? biz.deliverables : {};

  const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: "Activo / Operativo", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    trial: { label: "Periodo de Prueba", color: "bg-blue-50 text-blue-700 border-blue-200" },
    grace_period: { label: "En Gracia / Moroso", color: "bg-amber-50 text-amber-700 border-amber-200" },
    suspended: { label: "Suspendido", color: "bg-rose-50 text-rose-700 border-rose-200" },
  };
  const currentStatus = statusConfig[status] || statusConfig.trial;

  const handleShareReceipt = () => {
    if (!lastPayment) return;
    const text = `🧾 *RECIBO OFICIAL FOWY — ${lastPayment.receipt_code}*\n• Negocio: *${biz.name || "Restaurante"}*\n• Monto: *$${Number(lastPayment.amount || 0).toLocaleString("es-CO")} COP*\n• Método: *${lastPayment.payment_method?.toUpperCase()}*\n• Estado: *PAGADO / ACTIVO*\n¡Gracias por ser parte de la red FOWY! 🚀`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-2 text-slate-600">
          <ShieldCheck className="w-4 h-4 text-fowy-primary" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Modo Lectura — Sincronizado desde Finanzas</span>
        </div>
        <Link href="/admin/finanzas-fowy" className="inline-flex items-center gap-1 text-[11px] font-bold text-fowy-primary hover:underline">
          Ir a Finanzas <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Estatus del Negocio</span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${currentStatus.color}`}>● {currentStatus.label}</span>
          <p className="text-[10px] text-slate-400 mt-2">Controlado por las tablas satélite de cobranza</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Plan Registrado</span>
          <p className="text-base font-black text-slate-800">Standard — ${Number(biz.monthly_fee || 50000).toLocaleString("es-CO")} <span className="text-xs text-slate-400 font-medium">/mes</span></p>
          <p className="text-[10px] text-slate-400 mt-1">Corte mensual automático</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Próximo Corte</span>
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{biz.next_billing_date ? new Date(biz.next_billing_date).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "Sin corte programado"}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Calculado por el cron financiero</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Último Recibo Oficial</span>
          {lastPayment ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lastPayment.receipt_code} (${Number(lastPayment.amount).toLocaleString("es-CO")})</span>
              </div>
              <button type="button" onClick={handleShareReceipt} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                <Share2 className="w-3.5 h-3.5" /> Compartir en WhatsApp
              </button>
            </div>
          ) : <p className="text-xs text-slate-400">Sin recibos emitidos aún</p>}
        </div>
      </div>

      {/* Libreta Flexible: Módulos Activos (modules JSONB) */}
      <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-fowy-primary" />
          <span>Módulos de Software (Libreta Flexible JSONB)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(modules).map(([modKey, active]) => (
            <span 
              key={modKey}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                active 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-slate-50 text-slate-400 border-slate-200/60"
              }`}
            >
              {active ? "🟢" : "⚪"} {modKey.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Mochila Flexible: Entregables de Calle (deliverables JSONB) */}
      <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
          <PackageCheck className="w-4 h-4 text-fowy-primary" />
          <span>Entregables Comerciales (Mochila Flexible JSONB)</span>
        </div>
        {Object.keys(deliverables).length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(deliverables).map(([itemKey, val]) => (
              <div key={itemKey} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{itemKey}</span>
                <span className="font-semibold text-slate-700">{String(val)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No hay entregables registrados aún para este restaurante.</p>
        )}
      </div>

      {/* Aviso Directivo */}
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-amber-800 text-xs">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <span>Para registrar nuevos cobros, prórrogas o abonos parciales, usa el panel de <strong>Finanzas FOWY</strong> o díctaselo al <strong>Agente FOWY</strong>.</span>
      </div>
    </div>
  );
}
