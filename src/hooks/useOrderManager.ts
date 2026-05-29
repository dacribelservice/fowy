"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { safeLocalStorage } from "@/utils/storage";

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
  const [isSoundActive, setIsSoundActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ordersRef = useRef<Order[]>([]);
  const isSoundActiveRef = useRef(false);

  // Sincronizar refs con estado para evitar stale closures en el callback
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  useEffect(() => {
    isSoundActiveRef.current = isSoundActive;
  }, [isSoundActive]);

  // Cargar estado guardado de audio al montar
  useEffect(() => {
    const saved = safeLocalStorage.getItem("business_audio_unlocked");
    if (saved === "true") {
      setIsSoundActive(true);
    }
  }, []);

  // Inicializar sonido
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio("/sounds/cash-register.mp3");
    }
  }, []);

  // Método interactivo para alternar el sonido y desbloquear Safari/iOS
  const toggleSound = async () => {
    if (!audioRef.current) return;
    if (!isSoundActive) {
      try {
        // Reproducción silenciosa e instantánea para inicializar el contexto de WebKit
        audioRef.current.muted = true;
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
        
        setIsSoundActive(true);
        safeLocalStorage.setItem("business_audio_unlocked", "true");
      } catch (err) {
        console.error("Failed to unlock audio context in Safari:", err);
      }
    } else {
      setIsSoundActive(false);
      safeLocalStorage.setItem("business_audio_unlocked", "false");
    }
  };

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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
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
          
          // El sonido de notificación de órdenes ahora es manejado globalmente por NotificationProvider.tsx
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
    isSoundActive,
    toggleSound,
    updateOrderStatus,
    refreshOrders: fetchOrders
  };
}
