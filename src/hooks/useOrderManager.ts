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

const supabase = createClient();

export function useOrderManager(businessId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ordersRef = useRef<Order[]>([]);

  // Sincronizar ref con estado para evitar stale closures en el callback
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  // Inicializar sonido
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
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
  }, [businessId]);

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

  // Suscripción Realtime Estable
  useEffect(() => {
    if (!businessId) return;

    console.log(`Setting up Realtime for business: ${businessId}`);

    const channelId = `business-orders-${businessId}-${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'orders',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          console.log("New order received via Realtime:", payload.new);
          const newOrder = payload.new as Order;
          
          // Usar actualización funcional para evitar dependencias
          setOrders((prev) => {
            // Evitar duplicados por si acaso
            if (prev.some(o => o.id === newOrder.id)) return prev;
            return [newOrder, ...prev];
          });
          
          // Reproducir sonido de notificación
          if (audioRef.current) {
            audioRef.current.play().catch(err => console.log("Audio play failed:", err));
          }
        }
      )
      .subscribe((status) => {
        console.log(`Realtime status for ${businessId}:`, status);
      });

    return () => {
      console.log(`Cleaning up Realtime for business: ${businessId}`);
      supabase.removeChannel(channel);
    };
  }, [businessId]);

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
