import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { FALLBACK_EXPERTOS } from "@/modules/expertos/constants";

export function useExperts() {
  const [expertos, setExpertos] = useState<any[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [view, setView] = useState<'marketplace' | 'orders'>('marketplace');
  const [myOrders, setMyOrders] = useState<any[]>([]);
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

  const fetchMyOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          professional:profiles!professional_id (
            full_name,
            avatar_url,
            specialty
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyOrders(data || []);
    } catch (error) {
      console.error("Error fetching my orders:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (view === 'marketplace') fetchExpertos();
    else fetchMyOrders();
  }, [view, fetchExpertos, fetchMyOrders]);

  const filteredExpertos = useMemo(() => {
    return activeCategory === "Todos" 
      ? expertos 
      : expertos.filter(e => e.category === activeCategory);
  }, [expertos, activeCategory]);

  const handleReleaseFunds = useCallback(async (orderId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('service_orders')
        .update({ status: 'funds_released' })
        .eq('id', orderId);

      if (error) throw error;
      toast.success("¡Pago liberado!", { description: "Gracias por confiar en FOWY Experts." });
      fetchMyOrders();
    } catch (error) {
      toast.error("Error al liberar fondos");
    } finally {
      setLoading(false);
    }
  }, [supabase, fetchMyOrders]);

  const handleHire = useCallback(async (expert: any, plan: any) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Debes iniciar sesión para contratar");
        return;
      }

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!business) {
        toast.error("No tienes un negocio registrado para realizar esta operación");
        return;
      }

      // Calculate amounts
      const totalAmount = typeof plan.price === 'string' 
        ? parseFloat(plan.price.replace('$', '')) 
        : plan.price;
      const commission = totalAmount * 0.20;
      const professionalNet = totalAmount - commission;

      const professionalId = expert.id;

      const { error } = await supabase.from('service_orders').insert({
        business_id: business.id,
        professional_id: professionalId,
        plan_name: plan.name,
        amount: totalAmount,
        fowy_commission: commission,
        professional_net: professionalNet,
        status: 'pending_payment',
        notes: `Contratación de ${plan.name} para ${expert.name}`
      });

      if (error) throw error;

      toast.success("¡Orden de contratación creada!", {
        description: "FOWY se pondrá en contacto para procesar el pago en custodia."
      });
      setSelectedExpert(null);
      setView('orders');

    } catch (error: any) {
      console.error("Error hiring:", error);
      toast.error("Error al procesar la contratación");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

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
