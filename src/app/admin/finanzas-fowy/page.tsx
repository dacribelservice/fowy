"use client";

import React, { useState } from "react";
import { Wallet, RefreshCw } from "lucide-react";
import { useAdminFinance } from "@/hooks/useAdminFinance";
import { FinanceKpiCards } from "@/components/admin/finanzas/FinanceKpiCards";
import { FinanceHealthMetricsBar } from "@/components/admin/finanzas/FinanceHealthMetricsBar";
import { FinanceAccountsBar } from "@/components/admin/finanzas/FinanceAccountsBar";
import { FinanceProfitLossCard } from "@/components/admin/finanzas/FinanceProfitLossCard";
import { CeoAgendaChecklist } from "@/components/admin/finanzas/CeoAgendaChecklist";
import { BusinessBillingTable } from "@/components/admin/finanzas/BusinessBillingTable";
import {
  QuickPaymentModal,
  QuickExpenseModal,
  AccountTransferModal,
  NewTaskModal,
} from "@/components/admin/finanzas/modals";
import type { BusinessBillingRowDTO } from "@/types/finance";

export default function AdminFinanzasFowyPage() {
  const {
    summary,
    healthKpis,
    billingData,
    isLoading,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    revalidateAll,
  } = useAdminFinance();

  const [selectedBusiness, setSelectedBusiness] = useState<BusinessBillingRowDTO | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState<boolean>(false);
  const [isTransferOpen, setIsTransferOpen] = useState<boolean>(false);
  const [isTaskOpen, setIsTaskOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleOpenPayment = (business: BusinessBillingRowDTO) => {
    setSelectedBusiness(business);
    setIsPaymentOpen(true);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await revalidateAll();
    setIsRefreshing(false);
  };

  const accounts = summary?.accounts || [];
  const businessesList = billingData?.data?.map((b) => ({ id: b.id, name: b.name })) || [];

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Encabezado Directivo */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
              <Wallet className="w-5 h-5" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Finanzas FOWY
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Contabilidad Directiva, Liquidez Multibolsillo & Cartera de Calle
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isLoading || isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} strokeWidth={1.75} />
            <span>Actualizar</span>
          </button>
        </div>
      </header>

      {/* Bloque 1: Semáforos KPI */}
      <FinanceKpiCards
        summary={summary}
        selectedStatus={statusFilter}
        onSelectStatus={(st) => setStatusFilter(st)}
        isLoading={isLoading}
      />

      {/* Bloque 2: Barra de Salud Financiera & KPIs */}
      <FinanceHealthMetricsBar healthKpis={healthKpis} isLoading={isLoading} />

      {/* Bloque 3: Barra de Liquidez Multibolsillo */}
      <FinanceAccountsBar
        summary={summary}
        isLoading={isLoading}
        onOpenTransferModal={() => setIsTransferOpen(true)}
      />

      {/* Bloque 4: P&L en Vivo + Agenda del CEO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinanceProfitLossCard
          summary={summary}
          isLoading={isLoading}
          onOpenExpenseModal={() => setIsExpenseOpen(true)}
        />
        <CeoAgendaChecklist
          tasks={summary?.today_tasks}
          isLoading={isLoading}
          onRevalidate={revalidateAll}
          onOpenNewTaskModal={() => setIsTaskOpen(true)}
        />
      </div>

      {/* Bloque 5: Tabla Virtualizada 60 FPS */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Directorio de Cobro & Suscripciones</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Total: {billingData?.total || 0}</span>
        </div>
        <BusinessBillingTable
          rows={billingData?.data}
          totalCount={billingData?.total}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          isLoading={isLoading}
          onOpenPaymentModal={handleOpenPayment}
        />
      </section>

      {/* Modales Transaccionales */}
      <QuickPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => { setIsPaymentOpen(false); setSelectedBusiness(null); }}
        onSuccess={revalidateAll}
        business={selectedBusiness}
        accounts={accounts}
      />
      <QuickExpenseModal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        onSuccess={revalidateAll}
        accounts={accounts}
      />
      <AccountTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onSuccess={revalidateAll}
        accounts={accounts}
      />
      <NewTaskModal
        isOpen={isTaskOpen}
        onClose={() => setIsTaskOpen(false)}
        onSuccess={revalidateAll}
        businesses={businessesList}
      />
    </div>
  );
}
