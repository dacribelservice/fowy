"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  TrafficDataPoint,
  TimeFilter,
} from "@/components/admin/businesses/useBusinessTrafficData";

export interface UseReelsTrafficDataParams {
  businessId?: string;
  filter: TimeFilter;
}

export interface UseReelsTrafficDataReturn {
  loading: boolean;
  points: TrafficDataPoint[];
  maxViews: number;
  maxClicks: number;
  totalViewsPeriod: number;
  totalClicksPeriod: number;
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const FULL_DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const FULL_MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

interface ReelTrafficRow {
  created_at: string | null;
  views_count: number | null;
  clicks_to_menu_count: number | null;
}

export function useReelsTrafficData({
  businessId,
  filter,
}: UseReelsTrafficDataParams): UseReelsTrafficDataReturn {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [points, setPoints] = useState<TrafficDataPoint[]>([]);

  useEffect(() => {
    async function fetchTrafficData() {
      try {
        setLoading(true);
        let query = supabase.from("business_reels").select("created_at, views_count, clicks_to_menu_count");
        if (businessId) query = query.eq("business_id", businessId);

        const { data, error } = await query;
        if (error) throw error;

        const safe: ReelTrafficRow[] = (data || []) as ReelTrafficRow[];
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const result: TrafficDataPoint[] = [];

        if (filter === "D") {
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            const matching = safe.filter((r) => r.created_at?.startsWith(dateStr));
            result.push({
              label: DAY_NAMES[d.getDay()],
              fullLabel: `${FULL_DAYS[d.getDay()]} ${d.getDate()}`,
              visits: matching.reduce((acc: number, r) => acc + (r.views_count || 0), 0),
              clicks: matching.reduce((acc: number, r) => acc + (r.clicks_to_menu_count || 0), 0),
            });
          }
        } else if (filter === "S") {
          for (let i = 5; i >= 0; i--) {
            const start = new Date(now);
            start.setDate(now.getDate() - (i + 1) * 7);
            const end = new Date(now);
            end.setDate(now.getDate() - i * 7);
            const matching = safe.filter((r) => {
              if (!r.created_at) return false;
              const rd = new Date(r.created_at);
              return rd >= start && rd < end;
            });
            result.push({
              label: i === 0 ? "Act" : `S-${i}`,
              fullLabel: `Semana del ${start.getDate()}/${start.getMonth() + 1} al ${end.getDate()}/${end.getMonth() + 1}`,
              visits: matching.reduce((acc: number, r) => acc + (r.views_count || 0), 0),
              clicks: matching.reduce((acc: number, r) => acc + (r.clicks_to_menu_count || 0), 0),
            });
          }
        } else if (filter === "M") {
          for (let i = 5; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(1);
            d.setMonth(now.getMonth() - i);
            const y = d.getFullYear();
            const m = d.getMonth();
            const matching = safe.filter((r) => {
              if (!r.created_at) return false;
              const rd = new Date(r.created_at);
              return rd.getFullYear() === y && rd.getMonth() === m;
            });
            result.push({
              label: MONTHS[m],
              fullLabel: `${FULL_MONTHS[m]} ${y}`,
              visits: matching.reduce((acc: number, r) => acc + (r.views_count || 0), 0),
              clicks: matching.reduce((acc: number, r) => acc + (r.clicks_to_menu_count || 0), 0),
            });
          }
        }
        setPoints(result);
      } catch (err) {
        console.error("Error processing reels traffic data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrafficData();
  }, [businessId, filter, supabase]);

  const { maxViews, maxClicks, totalViewsPeriod, totalClicksPeriod } = useMemo(() => {
    let maxV = 0, maxC = 0, totalV = 0, totalC = 0;
    points.forEach((p) => {
      const v = Math.max(0, p.visits || 0);
      const c = Math.max(0, p.clicks || 0);
      if (v > maxV) maxV = v;
      if (c > maxC) maxC = c;
      totalV += v;
      totalC += c;
    });

    return {
      maxViews: maxV === 0 ? 5 : Math.round(maxV * 1.25),
      maxClicks: maxC === 0 ? 5 : Math.round(maxC * 1.25),
      totalViewsPeriod: totalV,
      totalClicksPeriod: totalC,
    };
  }, [points]);

  return { loading, points, maxViews, maxClicks, totalViewsPeriod, totalClicksPeriod };
}
