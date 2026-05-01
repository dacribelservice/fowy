import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import { calculateBusinessStats, BusinessStats } from "@/utils/businessStats";

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
        setGlobalStats(calculateBusinessStats(businesses));
      }
    } catch (e) {
      console.error("Error stats:", e);
    } finally {
      setLoadingStats(false);
    }
  }, []); 
// El cliente de supabase es estable

  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  return { globalStats, loadingStats, refreshStats: fetchGlobalStats };
}
