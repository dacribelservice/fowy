"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

export type TimeFilter = "D" | "S" | "M";

export interface TrafficDataPoint {
  label: string;
  fullLabel: string;
  visits: number;
  clicks: number;
}

export interface UseBusinessTrafficDataParams {
  businessId?: string;
  filter: TimeFilter;
}

export interface UseBusinessTrafficDataReturn {
  loading: boolean;
  points: TrafficDataPoint[];
  maxVisits: number;
  maxClicks: number;
  totalPeriodVisits: number;
  totalPeriodClicks: number;
}

/**
 * Hook para la gestión de analíticas de tráfico (Visitas)
 * y Pedidos/Clics de WhatsApp por negocio con filtros temporales.
 */
export function useBusinessTrafficData({
  businessId,
  filter,
}: UseBusinessTrafficDataParams): UseBusinessTrafficDataReturn {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [points, setPoints] = useState<TrafficDataPoint[]>([]);

  useEffect(() => {
    async function fetchTrafficData() {
      if (!businessId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // 1. Consulta de Visitas registradas en analytics_visits
        const { data: visitsData, error: visitsError } = await supabase
          .from("analytics_visits")
          .select("created_at")
          .eq("business_id", businessId);

        if (visitsError) console.error("Error fetching visits data:", visitsError);

        // 2. Consulta de Pedidos/Clics de WhatsApp registrados en orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("created_at")
          .eq("business_id", businessId);

        if (ordersError) console.error("Error fetching orders data:", ordersError);

        const safeVisits = visitsData || [];
        const safeOrders = ordersData || [];

        // 3. Procesamiento según el filtro temporal (Día, Semana, Mes)
        if (filter === "D") {
          const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
          const fullDayNames = [
            "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
          ];
          const result: TrafficDataPoint[] = [];

          for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);

            const year = d.getFullYear();
            const month = d.getMonth();
            const date = d.getDate();

            const dayVisits = safeVisits.filter((v: any) => {
              if (!v.created_at) return false;
              const vDate = new Date(v.created_at);
              return (
                vDate.getFullYear() === year &&
                vDate.getMonth() === month &&
                vDate.getDate() === date
              );
            }).length;

            const dayClicks = safeOrders.filter((o: any) => {
              if (!o.created_at) return false;
              const oDate = new Date(o.created_at);
              return (
                oDate.getFullYear() === year &&
                oDate.getMonth() === month &&
                oDate.getDate() === date
              );
            }).length;

            result.push({
              label: dayNames[d.getDay()],
              fullLabel: `${fullDayNames[d.getDay()]} ${d.getDate()}`,
              visits: dayVisits,
              clicks: dayClicks,
            });
          }
          setPoints(result);
        } else if (filter === "S") {
          const result: TrafficDataPoint[] = [];

          for (let i = 5; i >= 0; i--) {
            const start = new Date(now);
            start.setDate(now.getDate() - (i + 1) * 7);
            const end = new Date(now);
            end.setDate(now.getDate() - i * 7);

            const weekVisits = safeVisits.filter((v: any) => {
              if (!v.created_at) return false;
              const vDate = new Date(v.created_at);
              return vDate >= start && vDate < end;
            }).length;

            const weekClicks = safeOrders.filter((o: any) => {
              if (!o.created_at) return false;
              const oDate = new Date(o.created_at);
              return oDate >= start && oDate < end;
            }).length;

            const label = i === 0 ? "Act" : `S-${i}`;
            result.push({
              label,
              fullLabel: `Semana del ${start.getDate()}/${start.getMonth() + 1} al ${end.getDate()}/${end.getMonth() + 1}`,
              visits: weekVisits,
              clicks: weekClicks,
            });
          }
          setPoints(result);
        } else if (filter === "M") {
          const monthNames = [
            "Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
          ];
          const fullMonthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ];
          const result: TrafficDataPoint[] = [];

          for (let i = 5; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(1);
            d.setMonth(now.getMonth() - i);

            const year = d.getFullYear();
            const monthIndex = d.getMonth();

            const monthVisits = safeVisits.filter((v: any) => {
              if (!v.created_at) return false;
              const vDate = new Date(v.created_at);
              return (
                vDate.getFullYear() === year &&
                vDate.getMonth() === monthIndex
              );
            }).length;

            const monthClicks = safeOrders.filter((o: any) => {
              if (!o.created_at) return false;
              const oDate = new Date(o.created_at);
              return (
                oDate.getFullYear() === year &&
                oDate.getMonth() === monthIndex
              );
            }).length;

            result.push({
              label: monthNames[monthIndex],
              fullLabel: `${fullMonthNames[monthIndex]} ${year}`,
              visits: monthVisits,
              clicks: monthClicks,
            });
          }
          setPoints(result);
        }
      } catch (error) {
        console.error("Error processing traffic data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrafficData();
  }, [businessId, filter, supabase]);

  // Métricas calculadas para escalas y resúmenes
  const { maxVisits, maxClicks, totalPeriodVisits, totalPeriodClicks } = useMemo(() => {
    let maxV = 0;
    let maxC = 0;
    let totalV = 0;
    let totalC = 0;

    points.forEach((p) => {
      const v = Math.max(0, p.visits || 0);
      const c = Math.max(0, p.clicks || 0);
      if (v > maxV) maxV = v;
      if (c > maxC) maxC = c;
      totalV += v;
      totalC += c;
    });

    return {
      maxVisits: maxV === 0 ? 5 : maxV * 1.25,
      maxClicks: maxC === 0 ? 5 : maxC * 1.25,
      totalPeriodVisits: totalV,
      totalPeriodClicks: totalC,
    };
  }, [points]);

  return {
    loading,
    points,
    maxVisits,
    maxClicks,
    totalPeriodVisits,
    totalPeriodClicks,
  };
}
