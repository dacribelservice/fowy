"use client";

import React from "react";
import { CheckCircle2, Clock3, AlertTriangle, AlertOctagon } from "lucide-react";
import type { AdminFinanceSummaryDTO, SubscriptionStatus } from "@/types/finance";
import { formatCOP } from "@/utils/financeReceipt";

interface FinanceKpiCardsProps {
  summary?: AdminFinanceSummaryDTO | null;
  selectedStatus?: string;
  onSelectStatus?: (status: SubscriptionStatus | "all") => void;
  isLoading?: boolean;
}

interface CardConfig {
  key: SubscriptionStatus;
  title: string;
  count: number;
  subtext: string;
  icon: React.ElementType;
  colorClass: string;
  dotClass: string;
  borderActive: string;
}

export const FinanceKpiCards: React.FC<FinanceKpiCardsProps> = ({
  summary,
  selectedStatus = "all",
  onSelectStatus,
  isLoading = false,
}) => {
  const counts = summary?.counts ?? { active: 0, trial: 0, grace_period: 0, suspended: 0, total: 0 };
  const monthIncome = summary?.metrics?.month_income ?? 0;
  const pending = summary?.metrics?.pending_receivables ?? 0;

  const cards: CardConfig[] = [
    {
      key: "active",
      title: "Al Día",
      count: counts.active,
      subtext: monthIncome > 0 ? `Recaudo: ${formatCOP(monthIncome)}` : "Pagos al día",
      icon: CheckCircle2,
      colorClass: "text-emerald-500",
      dotClass: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
      borderActive: "border-emerald-500 ring-1 ring-emerald-500/30",
    },
    {
      key: "trial",
      title: "En Prueba",
      count: counts.trial,
      subtext: "15 días de activación",
      icon: Clock3,
      colorClass: "text-blue-500",
      dotClass: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
      borderActive: "border-blue-500 ring-1 ring-blue-500/30",
    },
    {
      key: "grace_period",
      title: "Tolerancia",
      count: counts.grace_period,
      subtext: pending > 0 ? `Cartera: ${formatCOP(pending)}` : "3 a 5 días de tolerancia",
      icon: AlertTriangle,
      colorClass: "text-amber-500",
      dotClass: "bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]",
      borderActive: "border-amber-500 ring-1 ring-amber-500/30",
    },
    {
      key: "suspended",
      title: "En Mora",
      count: counts.suspended,
      subtext: "Cobro o visita presencial",
      icon: AlertOctagon,
      colorClass: "text-rose-500",
      dotClass: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]",
      borderActive: "border-rose-500 ring-1 ring-rose-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = selectedStatus === c.key;

        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onSelectStatus?.(isSelected ? "all" : c.key)}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm hover:translate-y-[-1px] ${
              isSelected ? c.borderActive : "border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${c.dotClass}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{c.title}</span>
              </div>
              <Icon className={`w-4 h-4 ${c.colorClass}`} strokeWidth={1.75} />
            </div>
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isLoading ? <span className="inline-block w-8 h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" /> : c.count}
            </div>
            <p className="mt-1 text-[11px] md:text-xs text-slate-500 dark:text-slate-400 truncate">{c.subtext}</p>
          </button>
        );
      })}
    </div>
  );
};

export default FinanceKpiCards;
