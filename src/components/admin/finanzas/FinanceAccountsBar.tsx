"use client";

import React, { useMemo } from "react";
import { ArrowLeftRight, Smartphone, Building2, Banknote, Wallet } from "lucide-react";
import type { AdminFinanceSummaryDTO } from "@/types/finance";
import { formatCOP } from "@/utils/financeReceipt";

interface FinanceAccountsBarProps {
  summary?: AdminFinanceSummaryDTO | null;
  onOpenTransferModal?: () => void;
  isLoading?: boolean;
}

interface AccountConfig {
  code: string;
  name: string;
  icon: React.ElementType;
  dotColor: string;
  badgeBg: string;
}

const ACCOUNT_CONFIGS: Record<string, AccountConfig> = {
  nequi: {
    code: "nequi",
    name: "Nequi",
    icon: Smartphone,
    dotColor: "bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.4)]",
    badgeBg: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  daviplata: {
    code: "daviplata",
    name: "Daviplata",
    icon: Smartphone,
    dotColor: "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.4)]",
    badgeBg: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  bancolombia: {
    code: "bancolombia",
    name: "Bancolombia",
    icon: Building2,
    dotColor: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
    badgeBg: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  cash: {
    code: "cash",
    name: "Efectivo",
    icon: Banknote,
    dotColor: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
    badgeBg: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
};

export const FinanceAccountsBar: React.FC<FinanceAccountsBarProps> = ({
  summary,
  onOpenTransferModal,
  isLoading = false,
}) => {
  const accounts = summary?.accounts ?? [];

  const totalBalance = useMemo(
    () => accounts.reduce((acc, a) => acc + (Number(a.current_balance) || 0), 0),
    [accounts]
  );

  return (
    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Wallet className="w-4 h-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Arqueo de Liquidez</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Fondos disponibles en cajas y bancos</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block">Total Caja</span>
            <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">
              {isLoading ? "Cargando..." : formatCOP(totalBalance)}
            </span>
          </div>

          {onOpenTransferModal && (
            <button
              type="button"
              onClick={onOpenTransferModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Traspaso</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
        {["nequi", "daviplata", "bancolombia", "cash"].map((code) => {
          const cfg = ACCOUNT_CONFIGS[code];
          const acc = accounts.find((a) => a.code === code);
          const balance = Number(acc?.current_balance) || 0;
          const Icon = cfg.icon;

          return (
            <div
              key={code}
              className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${cfg.dotColor}`} />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{cfg.name}</span>
                </div>
                <div className={`p-1 rounded-md border ${cfg.badgeBg}`}>
                  <Icon className="w-3 h-3" strokeWidth={1.75} />
                </div>
              </div>
              <div className="text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {isLoading ? <span className="inline-block w-16 h-5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" /> : formatCOP(balance)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinanceAccountsBar;
