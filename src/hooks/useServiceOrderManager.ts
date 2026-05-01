import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export type ServiceOrderStatus = 
  | 'pending_payment' 
  | 'in_escrow' 
  | 'in_progress' 
  | 'completed' 
  | 'funds_released' 
  | 'disputed';

export interface ServiceOrder {
  id: string;
  business_id: string;
  professional_id: string;
  plan_name: string;
  amount: number;
  fowy_commission: number;
  professional_net: number;
  status: ServiceOrderStatus;
  delivery_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  businesses?: {
    name: string;
    logo_url: string;
  };
  professional?: {
    full_name: string;
    avatar_url: string;
    specialty: string;
  };
}

export function useServiceOrderManager(role: 'business' | 'professional') {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const supabase = createClient();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('service_orders')
        .select(`
          *,
          businesses (
            name,
            logo_url
          ),
          professional:profiles!professional_id (
            full_name,
            avatar_url,
            specialty
          )
        `);

      if (role === 'professional') {
        query = query.eq('professional_id', user.id);
      } else {
        // For business, we first need their business ID
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single();
        
        if (!business) {
          setOrders([]);
          setLoading(false);
          return;
        }
        query = query.eq('business_id', business.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching service orders:", error);
      toast.error("Error al cargar los servicios");
    } finally {
      setLoading(false);
    }
  }, [supabase, role]);

  // Real-time subscription
  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('service_orders_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: ServiceOrderStatus, extraData: any = {}) => {
    try {
      setActionLoading(orderId);
      const { error } = await supabase
        .from('service_orders')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          ...extraData
        })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success("Pedido actualizado correctamente");
      return { success: true };
    } catch (error: any) {
      console.error("Error updating service order:", error);
      toast.error("Error al actualizar el pedido");
      return { success: false, error };
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateDelivery = async (orderId: string, url: string) => {
    return await updateOrderStatus(orderId, 'completed', { delivery_url: url });
  };

  const handleReleaseFunds = async (orderId: string) => {
    return await updateOrderStatus(orderId, 'funds_released');
  };

  const handleHire = async (expertId: string, plan: any) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay usuario autenticado");

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!business) throw new Error("No tienes un negocio registrado");

      const totalAmount = typeof plan.price === 'string' 
        ? parseFloat(plan.price.replace('$', '')) 
        : plan.price;
      const commission = totalAmount * 0.20;
      const professionalNet = totalAmount - commission;

      const { error } = await supabase.from('service_orders').insert({
        business_id: business.id,
        professional_id: expertId,
        plan_name: plan.name,
        amount: totalAmount,
        fowy_commission: commission,
        professional_net: professionalNet,
        status: 'pending_payment',
        notes: `Contratación de ${plan.name}`
      });

      if (error) throw error;
      
      toast.success("¡Contratación solicitada!");
      return { success: true };
    } catch (error: any) {
      console.error("Error hiring expert:", error);
      toast.error(error.message || "Error al procesar la contratación");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    actionLoading,
    updateOrderStatus,
    handleUpdateDelivery,
    handleReleaseFunds,
    handleHire,
    refresh: fetchOrders
  };
}
