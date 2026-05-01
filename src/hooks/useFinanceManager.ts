import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { ServiceOrder } from "./useServiceOrderManager";
import { calculateFinanceStats, groupFinanceByDate, FinanceStats } from "@/utils/financeUtils";
import { toast } from "sonner";

export function useFinanceManager(role: 'admin' | 'professional' = 'admin') {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
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

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const fetchedOrders = data || [];
      setOrders(fetchedOrders);
      
      // Calculate Stats using utility
      const calculatedStats = calculateFinanceStats(fetchedOrders, role);
      setStats(calculatedStats);

      // Prepare Chart Data (last 7 days)
      const groupData = groupFinanceByDate(fetchedOrders);
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
    stats,
    chartData,
    loading,
    refresh: fetchData
  };
}
