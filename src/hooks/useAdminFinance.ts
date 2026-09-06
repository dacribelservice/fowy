"use client";

import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import type {
  AdminFinanceSummaryDTO,
  BillingPageDTO,
  FinancialHealthKpisDTO,
  SubscriptionStatus,
} from "@/types/finance";

const supabase = createClient();

/**
 * Fetcher para resumen general financiero (RPC get_admin_finance_summary)
 */
async function fetchAdminSummary(): Promise<AdminFinanceSummaryDTO> {
  const { data, error } = await supabase.rpc("get_admin_finance_summary");
  if (error) {
    console.error("[useAdminFinance] Error obteniendo resumen financiero:", error);
    throw new Error(error.message);
  }
  return data as unknown as AdminFinanceSummaryDTO;
}

/**
 * Fetcher para paginación server-side de facturación (RPC get_admin_businesses_billing_page)
 */
async function fetchBillingPage([_, status, search, page, limit]: readonly [
  string,
  string,
  string,
  number,
  number
]): Promise<BillingPageDTO> {
  const offset = (page - 1) * limit;
  const { data, error } = await supabase.rpc("get_admin_businesses_billing_page", {
    p_status: status,
    p_search: search,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    console.error("[useAdminFinance] Error obteniendo página de facturación:", error);
    throw new Error(error.message);
  }
  return data as unknown as BillingPageDTO;
}

export interface UseAdminFinanceOptions {
  initialPageSize?: number;
}

/**
 * Hook administrativo para el Tablero de Finanzas FOWY y Gestión de Facturación.
 * Implementa caché SWR, paginación server-side, búsqueda Trigram GIN y filtros por estado.
 */
export function useAdminFinance(options: UseAdminFinanceOptions = {}) {
  const { initialPageSize = 30 } = options;

  // Estados locales de filtrado y navegación
  const [searchTerm, setSearchTermState] = useState<string>("");
  const [statusFilter, setStatusFilterState] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(initialPageSize);

  // SWR para resumen general financiero
  const {
    data: summary,
    error: summaryError,
    isLoading: isSummaryLoading,
    mutate: mutateSummary,
  } = useSWR<AdminFinanceSummaryDTO>("admin_finance_summary", fetchAdminSummary, {
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });

  // SWR para tabla de negocios con paginación server-side
  const billingKey = useMemo(
    () => ["admin_billing_page", statusFilter, searchTerm, page, pageSize] as const,
    [statusFilter, searchTerm, page, pageSize]
  );

  const {
    data: billingData,
    error: billingError,
    isLoading: isBillingLoading,
    mutate: mutateBilling,
  } = useSWR<BillingPageDTO, Error, typeof billingKey>(
    billingKey,
    fetchBillingPage,
    {
      keepPreviousData: true,
      dedupingInterval: 3000,
    }
  );

  // Handlers para actualizar filtros reiniciando a la página 1
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
    setPage(1);
  }, []);

  const setStatusFilter = useCallback((status: SubscriptionStatus | "all" | string) => {
    setStatusFilterState(status);
    setPage(1);
  }, []);

  // Mutadores explícitos
  const revalidateSummary = useCallback(() => mutateSummary(), [mutateSummary]);
  const revalidateBilling = useCallback(() => mutateBilling(), [mutateBilling]);
  const revalidateAll = useCallback(
    () => Promise.all([mutateSummary(), mutateBilling()]),
    [mutateSummary, mutateBilling]
  );

  // Métricas de salud derivadas
  const healthKpis: FinancialHealthKpisDTO | undefined = summary?.health_kpis;
  const isLoading = isSummaryLoading || isBillingLoading;
  const error = summaryError || billingError;

  return {
    // Datos principales
    summary,
    healthKpis,
    billingData,
    isLoading,
    isSummaryLoading,
    isBillingLoading,
    error,

    // Filtros y Paginación
    searchTerm,
    statusFilter,
    page,
    pageSize,
    setSearchTerm,
    setStatusFilter,
    setPage,

    // Revalidación
    revalidateSummary,
    revalidateBilling,
    revalidateAll,
  };
}

export default useAdminFinance;
