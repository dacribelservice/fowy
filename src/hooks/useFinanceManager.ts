import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { ServiceOrder } from "./useServiceOrderManager";
import { calculateFinanceStats, groupFinanceByDate, FinanceStats } from "@/utils/financeUtils";
import { toast } from "sonner";

export interface FinanceTransaction {
  id: string;
  type: 'service_order' | 'membership';
  businessName: string;
  businessLogoUrl?: string | null;
  amount: number;
  fowyCommission: number;
  status: string;
  created_at: string;
  serviceOrderPlanName?: string;
  paymentProofUrl?: string | null;
}

export function useFinanceManager(role: 'admin' | 'professional' = 'admin') {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [approvedProofs, setApprovedProofs] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [chartData, setChartData] = useState<{ labels: string[], data: number[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('service_orders')
        .select(`
          *,
          businesses (name, logo_url),
          professional:profiles!professional_id (full_name, avatar_url)
        `);

      if (role === 'professional') {
        query = query.eq('professional_id', user.id);
      }

      // Fetch service orders and approved payment proofs in parallel
      const [ordersResult, proofsResult] = await Promise.all([
        query.order('created_at', { ascending: false }),
        role === 'admin'
          ? supabase
              .from('payment_proofs')
              .select(`
                *,
                businesses (name, logo_url)
              `)
              .eq('status', 'approved')
              .order('created_at', { ascending: false })
          : Promise.resolve({ data: [], error: null })
      ]);

      if (ordersResult.error) throw ordersResult.error;
      if (proofsResult.error) throw proofsResult.error;

      const fetchedOrders = ordersResult.data || [];
      const fetchedProofs = proofsResult.data || [];

      setOrders(fetchedOrders);
      setApprovedProofs(fetchedProofs);

      // Map and combine service_orders and payment_proofs into a single transaction stream
      const mappedOrders: FinanceTransaction[] = fetchedOrders.map(order => ({
        id: order.id,
        type: 'service_order',
        businessName: order.businesses?.name || 'Negocio desconocido',
        businessLogoUrl: order.businesses?.logo_url,
        amount: order.amount,
        fowyCommission: order.fowy_commission,
        status: order.status,
        created_at: order.created_at,
        serviceOrderPlanName: order.plan_name
      }));

      const mappedProofs: FinanceTransaction[] = fetchedProofs.map(proof => ({
        id: proof.id,
        type: 'membership',
        businessName: proof.businesses?.name || 'Negocio desconocido',
        businessLogoUrl: proof.businesses?.logo_url,
        amount: proof.amount,
        fowyCommission: proof.amount, // Membership goes 100% to FOWY
        status: proof.status,
        created_at: proof.created_at,
        paymentProofUrl: proof.proof_url
      }));

      const combinedTransactions = [...mappedOrders, ...mappedProofs].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setTransactions(combinedTransactions);
      
      // Calculate Stats using utility
      const calculatedStats = calculateFinanceStats(fetchedOrders, role, fetchedProofs);
      setStats(calculatedStats);

      // Prepare Chart Data (last 7 days)
      const groupData = groupFinanceByDate(fetchedOrders, 7, fetchedProofs);
      setChartData(groupData);

    } catch (error: any) {
      console.error("Error fetching finance data:", error);
      toast.error("Error al cargar datos financieros");
    } finally {
      setLoading(false);
    }
  }, [supabase, role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    orders,
    approvedProofs,
    transactions,
    stats,
    chartData,
    loading,
    refresh: fetchData
  };
}
