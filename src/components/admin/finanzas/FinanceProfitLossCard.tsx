"use client";

import React from "react";
import {
  AlertTriangle,
  HeartHandshake,
  PlusCircle,
  Server,
  Coffee,
  Fuel,
  Printer,
  UserCheck,
} from "lucide-react";
import type { AdminFinanceSummaryDTO } from "@/types/finance";
import { formatCOP } from "@/utils/financeReceipt";

interface FinanceProfitLossCardProps {
  summary?: AdminFinanceSummaryDTO | null;
  onOpenExpenseModal?: () => void;
  isLoading?: boolean;
}

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType }> = {
  tecnologia_fija: { label: "Tecnología fija", icon: Server },
  viaticos_calle: { label: "Viáticos calle", icon: Coffee },
  transporte_movilidad: { label: "Transporte", icon: Fuel },
  material_negocios: { label: "Material negocios", icon: Printer },
  salario_ceo: { label: "Honorarios CEO", icon: UserCheck },
};

export const FinanceProfitLossCard: React.FC<FinanceProfitLossCardProps> = ({
  summary,
  onOpenExpenseModal,
  isLoading = false,
}) => {
  const metrics = summary?.metrics;
  const income = metrics?.month_income ?? 0;
  const expenses = metrics?.month_expenses ?? 0;
  const netProfit = metrics?.net_profit ?? 0;
  const tithing = metrics?.tithing ?? 0;
  const margin = metrics?.operating_margin_pct ?? 0;
  const expensesByCategory = metrics?.expenses_by_category ?? {};

  const viaticos = expensesByCategory["viaticos_calle"] ?? 0;
  const isViaticosAlert = income > 0 && viaticos / income > 0.25;
  const viaticosPct = income > 0 ? ((viaticos / income) * 100).toFixed(1) : "0";

  return (
    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Estado de Resultados P&L</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Ingresos, costos operativos y diezmo</p>
          </div>
          {onOpenExpenseModal && (
            <button
              type="button"
              onClick={onOpenExpenseModal}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Gasto OPEX</span>
            </button>
          )}
        </div>

        {/* Cifras Maestras: Ingreso y Gasto */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]">
            <span className="text-[10px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 block">Cobrado (MTD)</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">{isLoading ? "..." : formatCOP(income)}</span>
          </div>
          <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.04]">
            <span className="text-[10px] uppercase font-semibold text-rose-600 dark:text-rose-400 block">Gastos OPEX</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">{isLoading ? "..." : formatCOP(expenses)}</span>
          </div>
        </div>

        {/* Micro-desglose por Categorías */}
        <div className="space-y-1.5 mb-3">
          {Object.entries(CATEGORY_META).map(([catKey, meta]) => {
            const amount = expensesByCategory[catKey] ?? 0;
            const Icon = meta.icon;
            if (amount === 0 && !isLoading) return null;

            return (
              <div key={catKey} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3 text-slate-400" strokeWidth={1.75} />
                  <span>{meta.label}</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCOP(amount)}</span>
              </div>
            );
          })}
        </div>

        {/* Alerta Ámbar Fuga de Caja Viáticos */}
        {isViaticosAlert && (
          <div className="mb-3 p-2 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            <span>Alerta: Viáticos representan el {viaticosPct}% del recaudo (&gt; 25% umbral).</span>
          </div>
        )}
      </div>

      {/* Renglón de Utilidad Real & Diezmo */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Utilidad Neta Real</span>
            <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              {isLoading ? "..." : `${netProfit >= 0 ? "+" : ""}${formatCOP(netProfit)}`}
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${netProfit >= 0 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"}`}>
            {margin.toFixed(1)}% Margen
          </span>
        </div>

        <div className="p-2 rounded-xl bg-purple-500/[0.07] border border-purple-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-semibold">
            <HeartHandshake className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Diezmo (10% tras OPEX)</span>
          </div>
          <span className="font-extrabold text-purple-800 dark:text-purple-200">{isLoading ? "..." : formatCOP(tithing)}</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceProfitLossCard;
