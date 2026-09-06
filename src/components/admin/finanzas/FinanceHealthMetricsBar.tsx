"use client";

import React from "react";
import { Target, Timer, ShieldCheck, TrendingUp } from "lucide-react";
import type { FinancialHealthKpisDTO } from "@/types/finance";

interface FinanceHealthMetricsBarProps {
  healthKpis?: FinancialHealthKpisDTO | null;
  isLoading?: boolean;
}

export const FinanceHealthMetricsBar: React.FC<FinanceHealthMetricsBarProps> = ({
  healthKpis,
  isLoading = false,
}) => {
  const cpi = healthKpis?.cpi_onboarding ?? 1.0;
  const dso = healthKpis?.dso_days ?? 0;
  const runway = healthKpis?.runway_months ?? 0;
  const margin = healthKpis?.operating_margin_pct ?? 0;

  const metrics = [
    {
      label: "CPI Onboarding",
      value: `${cpi.toFixed(2)}x`,
      badge: cpi >= 1.0 ? "Eficiente" : "Sobrecosto",
      badgeColor: cpi >= 1.0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      icon: Target,
      iconColor: cpi >= 1.0 ? "text-emerald-500" : "text-rose-500",
      desc: "Base $35k vs costo real",
    },
    {
      label: "DSO Cartera",
      value: `${dso.toFixed(1)}d`,
      badge: dso <= 4 ? "Cobro ágil" : dso <= 7 ? "Cartera lenta" : "Dinero en calle",
      badgeColor: dso <= 4 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : dso <= 7 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      icon: Timer,
      iconColor: dso <= 4 ? "text-emerald-500" : dso <= 7 ? "text-amber-500" : "text-rose-500",
      desc: "Días promedio de cobro",
    },
    {
      label: "Runway de Caja",
      value: `${runway.toFixed(1)}m`,
      badge: runway >= 3 ? "Holgura sólida" : "Atención caja",
      badgeColor: runway >= 3 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      icon: ShieldCheck,
      iconColor: runway >= 3 ? "text-emerald-500" : "text-amber-500",
      desc: "Supervivencia OPEX fijo",
    },
    {
      label: "Margen Operativo",
      value: `${margin.toFixed(1)}%`,
      badge: margin >= 50 ? "Saludable" : margin >= 20 ? "Moderado" : "Bajo",
      badgeColor: margin >= 50 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : margin >= 20 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      icon: TrendingUp,
      iconColor: margin >= 50 ? "text-emerald-500" : margin >= 20 ? "text-amber-500" : "text-rose-500",
      desc: "Utilidad tras OPEX calle",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className="p-3.5 md:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{m.label}</span>
              <Icon className={`w-4 h-4 ${m.iconColor}`} strokeWidth={1.75} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isLoading ? <span className="inline-block w-12 h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" /> : m.value}
              </span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${m.badgeColor}`}>
                {m.badge}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 truncate">{m.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

export default FinanceHealthMetricsBar;
