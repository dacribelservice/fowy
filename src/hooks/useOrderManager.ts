"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

export interface Order {
  id: string;
  business_id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  items: any[];
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export function useOrderManager(businessId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();

  // Inicializar sonido
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/cash-register.mp3");
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [businessId, supabase]);

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;
      
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Suscripción Realtime
  useEffect(() => {
    if (!businessId) return;

    const channel = supabase
      .channel(`business-orders-${businessId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'orders',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          const newOrder = payload.new as Order;
          setOrders((prev) => [newOrder, ...prev]);
          
          // Reproducir sonido de notificación
          if (audioRef.current) {
            audioRef.current.play().catch(err => console.log("Audio play failed:", err));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, supabase]);

  // Carga inicial
  useEffect(() => {
    if (businessId) {
      fetchOrders();
    }
  }, [businessId, fetchOrders]);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refreshOrders: fetchOrders
  };
}
