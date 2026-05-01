import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { FALLBACK_EXPERTOS } from "@/modules/expertos/constants";
import { useServiceOrderManager } from "@/hooks/useServiceOrderManager";

export function useExperts() {
  const [expertos, setExpertos] = useState<any[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [view, setView] = useState<'marketplace' | 'orders'>('marketplace');
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  const fetchExpertos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name:full_name,
          specialty,
          description:bio,
          rating,
          image:avatar_url,
          total_jobs,
          years_experience,
          plans:professional_plans(name, price, details),
          portfolio:professional_portfolio(image_url)
        `)
        .eq('role', 'professional');

      if (error) throw error;

      if (data && data.length > 0) {
        setExpertos(data.map(e => ({
          ...e,
          verified: true,
          category: e.specialty?.includes('CM') ? 'Marketing' : 
                    e.specialty?.includes('Fotografía') ? 'Fotografía' : 'Anuncios',
          stats: { completions: e.total_jobs || 0, years: e.years_experience || 0 }
        })));
      } else {
        setExpertos(FALLBACK_EXPERTOS);
      }
    } catch (error) {
      console.error("Error fetching expertos:", error);
      setExpertos(FALLBACK_EXPERTOS);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (view === 'marketplace') fetchExpertos();
  }, [view, fetchExpertos]);

  const filteredExpertos = useMemo(() => {
    return activeCategory === "Todos" 
      ? expertos 
      : expertos.filter(e => e.category === activeCategory);
  }, [expertos, activeCategory]);

  const { 
    orders: myOrders, 
    loading: ordersLoading, 
    handleHire: hireExpert, 
    handleReleaseFunds: releaseFunds,
    refresh: fetchMyOrders
  } = useServiceOrderManager('business');

  const handleHire = async (expert: any, plan: any) => {
    const result = await hireExpert(expert.id, plan);
    if (result.success) {
      setSelectedExpert(null);
      setView('orders');
    }
  };

  const handleReleaseFunds = async (orderId: string) => {
    await releaseFunds(orderId);
  };

  return {
    expertos,
    selectedExpert,
    setSelectedExpert,
    activeCategory,
    setActiveCategory,
    view,
    setView,
    myOrders,
    loading,
    filteredExpertos,
    handleReleaseFunds,
    handleHire,
    fetchExpertos,
    fetchMyOrders
  };
}
