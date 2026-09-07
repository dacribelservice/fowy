"use client";

import React from "react";
import {
  Camera,
  Printer,
  QrCode,
  Clapperboard,
  UtensilsCrossed,
  MessageSquare,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import type { BusinessBillingRowDTO } from "@/types/finance";
import { formatCOP, getRelativeDaysText, buildWhatsAppLink } from "@/utils/financeReceipt";

interface BusinessBillingRowProps {
  row: BusinessBillingRowDTO & { phone?: string };
  onOpenPaymentModal?: (row: BusinessBillingRowDTO) => void;
  style?: React.CSSProperties;
}

const STATUS_META = {
  active: { label: "Al Día", color: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  trial: { label: "En Prueba", color: "text-sky-700 dark:text-sky-400 bg-sky-500/10 border-sky-500/20" },
  grace_period: { label: "Tolerancia", color: "text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20" },
  suspended: { label: "En Mora", color: "text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20" },
};

const DELIVERABLES_CONFIG = [
  { key: "fotos", altKey: "photos", label: "Fotos", icon: Camera },
  { key: "videos", altKey: "video", label: "Videos", icon: Clapperboard },
  { key: "volantes", altKey: "flyers", label: "Volantes", icon: Printer },
  { key: "menu_ready", altKey: "menu", label: "Menú Digital", icon: UtensilsCrossed },
  { key: "stickers_qr", altKey: "qr", label: "Stickers QR", icon: QrCode },
];

export const BusinessBillingRow: React.FC<BusinessBillingRowProps> = ({ row, onOpenPaymentModal, style }) => {
  const planName = row.modules?.premium ? "Plan Premium" : row.modules?.pro ? "Plan Pro" : "Plan Standard";
  const statusInfo = STATUS_META[row.subscription_status] || STATUS_META.trial;
  const targetDate = row.subscription_status === "trial" ? row.trial_ends_at : row.next_billing_date;
  const relativeDays = getRelativeDaysText(targetDate, row.subscription_status);
  const formattedDate = targetDate ? targetDate.split("T")[0] : "—";

  const waMsg = row.subscription_status === "trial"
    ? `Hola ${row.name}, te escribe Cristian de FOWY. Tu periodo de prueba gratis está concluyendo. Tu menú digital está listo. ¿Deseas que activemos el mes regular?`
    : `Hola ${row.name}, te comparto el recordatorio de renovación de FOWY del mes en curso (${formatCOP(row.monthly_fee)}). Puedes transferir a Nequi o Daviplata.`;

  return (
    <tr style={style} className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
      {/* 1. Negocio y Plan */}
      <td className="py-3 px-3 text-left">
        <div className="font-semibold text-xs text-slate-900 dark:text-white truncate max-w-[160px]">{row.name}</div>
        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">↳ [ {planName} ]</div>
      </td>

      {/* 2. Estado y Micro-badge de Tendencia */}
      <td className="py-3 px-3 text-left">
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${statusInfo.color}`}>{statusInfo.label}</span>
        <div className="mt-1 flex items-center gap-1">
          <span className="text-[10px] text-slate-400">↳</span>
          {(!row.growth_pct || row.growth_pct === 0) && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-medium bg-slate-500/10 text-slate-500 border border-slate-500/20">
              <Minus className="w-2.5 h-2.5" strokeWidth={2} /> 0.0%
            </span>
          )}
          {row.growth_pct && row.growth_pct > 0 && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-2.5 h-2.5" strokeWidth={2} /> +{row.growth_pct.toFixed(1)}%
            </span>
          )}
          {row.growth_pct && row.growth_pct < 0 && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <TrendingDown className="w-2.5 h-2.5" strokeWidth={2} /> {row.growth_pct.toFixed(1)}%
            </span>
          )}
        </div>
      </td>

      {/* 3. Tarifa & Fecha de Cobro */}
      <td className="py-3 px-3 text-left">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatCOP(row.monthly_fee)}</div>
        <div className="text-[10px] text-slate-400">{formattedDate}</div>
        <div className={`text-[10px] font-medium ${relativeDays.colorClass}`}>↳ ({relativeDays.text})</div>
      </td>

      {/* 4. Mochila de Entregables (5 Iconos Minimalistas) */}
      <td className="py-3 px-3 text-left">
        <div className="flex items-center gap-1.5">
          {DELIVERABLES_CONFIG.map((item) => {
            const Icon = item.icon;
            const val = row.deliverables?.[item.key] ?? row.deliverables?.[item.altKey];
            const isDone = val === "delivered" || val === "done" || String(val) === "true";

            return (
              <div
                key={item.key}
                title={`${item.label}: ${isDone ? "Entregado" : "Pendiente"}`}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  isDone
                    ? "bg-orange-50 dark:bg-orange-950/40 border border-orange-500/80 dark:border-orange-500 text-orange-500 dark:text-orange-400 shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
              </div>
            );
          })}
        </div>
      </td>

      {/* 5. Acciones */}
      <td className="py-3 px-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={buildWhatsAppLink(row.phone || "", waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition cursor-pointer"
          >
            <MessageSquare className="w-3 h-3" strokeWidth={1.75} />
            <span>Msg</span>
          </a>
          {onOpenPaymentModal && (
            <button
              type="button"
              onClick={() => onOpenPaymentModal(row)}
              className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 transition cursor-pointer"
            >
              <DollarSign className="w-3 h-3" strokeWidth={1.75} />
              <span>Cobrar</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export const BusinessBillingCard: React.FC<BusinessBillingRowProps> = ({ row, onOpenPaymentModal }) => {
  const planName = row.modules?.premium ? "Plan Premium" : row.modules?.pro ? "Plan Pro" : "Plan Standard";
  const statusInfo = STATUS_META[row.subscription_status] || STATUS_META.trial;
  const targetDate = row.subscription_status === "trial" ? row.trial_ends_at : row.next_billing_date;
  const relativeDays = getRelativeDaysText(targetDate, row.subscription_status);
  const formattedDate = targetDate ? targetDate.split("T")[0] : "—";

  const waMsg = row.subscription_status === "trial"
    ? `Hola ${row.name}, te escribe Cristian de FOWY. Tu periodo de prueba gratis está concluyendo. Tu menú digital está listo. ¿Deseas que activemos el mes regular?`
    : `Hola ${row.name}, te comparto el recordatorio de renovación de FOWY del mes en curso (${formatCOP(row.monthly_fee)}). Puedes transferir a Nequi o Daviplata.`;

  return (
    <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
      {/* 1. Cabecera: Nombre y Estado */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{row.name}</h4>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">↳ [ {planName} ]</span>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <div className="flex items-center gap-1">
            {(!row.growth_pct || row.growth_pct === 0) && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-medium bg-slate-500/10 text-slate-500 border border-slate-500/20">
                <Minus className="w-2.5 h-2.5" strokeWidth={2} /> 0.0%
              </span>
            )}
            {row.growth_pct && row.growth_pct > 0 && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-2.5 h-2.5" strokeWidth={2} /> +{row.growth_pct.toFixed(1)}%
              </span>
            )}
            {row.growth_pct && row.growth_pct < 0 && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <TrendingDown className="w-2.5 h-2.5" strokeWidth={2} /> {row.growth_pct.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Cuerpo: Tarifa/Vence & Entregables */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Tarifa & Vence</div>
          <div className="text-xs font-black text-slate-800 dark:text-slate-200">{formatCOP(row.monthly_fee)}</div>
          <div className={`text-[10px] font-semibold ${relativeDays.colorClass}`}>
            {formattedDate} ↳ ({relativeDays.text})
          </div>
        </div>

        {/* 5 Iconos Minimalistas */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Entregables</span>
          <div className="flex items-center gap-1.5">
            {DELIVERABLES_CONFIG.map((item) => {
              const Icon = item.icon;
              const val = row.deliverables?.[item.key] ?? row.deliverables?.[item.altKey];
              const isDone = val === "delivered" || val === "done" || String(val) === "true";

              return (
                <div
                  key={item.key}
                  title={`${item.label}: ${isDone ? "Entregado" : "Pendiente"}`}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isDone
                      ? "bg-orange-50 dark:bg-orange-950/40 border border-orange-500/80 dark:border-orange-500 text-orange-500 dark:text-orange-400 shadow-sm"
                      : "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Acciones Táctiles Mobile */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <a
          href={buildWhatsAppLink(row.phone || "", waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
          <span>WhatsApp</span>
        </a>
        {onOpenPaymentModal && (
          <button
            type="button"
            onClick={() => onOpenPaymentModal(row)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition shadow-xs cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Cobrar</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BusinessBillingRow;
