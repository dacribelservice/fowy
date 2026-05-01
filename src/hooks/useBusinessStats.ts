import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface BusinessStats {
  total: number;
  activos: number;
  vencimientos: number;
  diff: number;
}

export function useBusinessStats() {
  const [globalStats, setGlobalStats] = useState<BusinessStats>({
    total: 0,
    activos: 0,
    vencimientos: 0,
    diff: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const supabase = createClient();

  const fetchGlobalStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const { data: businesses } = await supabase
        .from('businesses')
        .select('created_at, status, payment_date');

      if (businesses) {
        const total = businesses.length;
        const activos = businesses.filter((b: any) => b.status === true || b.status === 'true' || b.status === 'active' || b.status === 'activo').length;
        const hoy = new Date();
        const en7Dias = new Date();
        en7Dias.setDate(hoy.getDate() + 7);
        
        const vencimientos = businesses.filter((b: any) => {
          if (!b.payment_date) return false;
          const fechaPago = new Date(b.payment_date);
          return fechaPago >= hoy && fechaPago <= en7Dias;
        }).length;

        const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const inicioMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const nuevosEsteMes = businesses.filter((b: any) => new Date(b.created_at) >= inicioMesActual).length;
        const nuevosMesPasado = businesses.filter((b: any) => {
          const d = new Date(b.created_at);
          return d >= inicioMesPasado && d < inicioMesActual;
        }).length;

        let diff = 0;
        if (nuevosMesPasado > 0) diff = ((nuevosEsteMes - nuevosMesPasado) / nuevosMesPasado) * 100;
        else if (nuevosEsteMes > 0) diff = 100;

        setGlobalStats({ total, activos, vencimientos, diff: Math.round(diff) });
      }
    } catch (e) {
      console.error("Error stats:", e);
    } finally {
      setLoadingStats(false);
    }
  }, []); // El cliente de supabase es estable

  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  return { globalStats, loadingStats, refreshStats: fetchGlobalStats };
}
