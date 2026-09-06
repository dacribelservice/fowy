"use client";

import React from "react";
import {
  Camera,
  Printer,
  Flag,
  QrCode,
  Clapperboard,
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

const DELIVERABLE_ICONS: Record<string, { label: string; icon: React.ElementType }> = {
  photos: { label: "Fotos", icon: Camera },
  flyers: { label: "Volantes", icon: Printer },
  banner: { label: "Pendón", icon: Flag },
  qr: { label: "QR", icon: QrCode },
  video: { label: "Video", icon: Clapperboard },
};

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

      {/* 4. Mochila de Entregables */}
      <td className="py-3 px-3 text-left">
        <div className="flex flex-wrap gap-1 max-w-[170px]">
          {Object.entries(row.deliverables || {}).map(([key, st]) => {
            const meta = DELIVERABLE_ICONS[key] || { label: key, icon: Flag };
            const Icon = meta.icon;
            const isDone = st === "delivered";
            const isInProg = st === "in_progress";
            const color = isDone
              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : isInProg
              ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
              : "text-slate-400 dark:text-slate-500 bg-slate-500/10 border-slate-500/20";

            return (
              <span key={key} title={`${meta.label}: ${st}`} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium border ${color}`}>
                <Icon className="w-2.5 h-2.5" strokeWidth={1.75} />
                <span>{meta.label}</span>
              </span>
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

export default BusinessBillingRow;
