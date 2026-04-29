"use client";

import React, { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * Escucha pedidos en tiempo real para el negocio actual 
 * y dispara una alerta sonora (cash-register.mp3).
 */
export default function BusinessNotificationListener() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Inicializar audio
    audioRef.current = new Audio("/sounds/cash-register.mp3");
    audioRef.current.load();

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener el ID del negocio para filtrar las notificaciones
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!business) return;

      // Suscribirse a la tabla de órdenes para este negocio
      const channel = supabase
        .channel(`business-orders-${business.id}`)
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'orders',
            filter: `business_id=eq.${business.id}` 
          },
          (payload) => {
            console.log("¡Nuevo pedido recibido!", payload);
            if (audioRef.current) {
              audioRef.current.play().catch(err => {
                console.warn("No se pudo reproducir el sonido (posible bloqueo del navegador):", err);
              });
            }
          }
        )
        .subscribe();

      return channel;
    };

    let channelPromise = setupSubscription();

    return () => {
      channelPromise.then(channel => {
        if (channel) supabase.removeChannel(channel);
      });
    };
  }, []);

  return null; // Componente invisible
}
