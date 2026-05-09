"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface ActiveMarketingCTA {
  id: string;
  text: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export function useActiveCTAs() {
  const [ctas, setCtas] = useState<ActiveMarketingCTA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchActiveCTAs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("marketing_ctas")
        .select("id, text, is_active, sort_order, created_at")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (fetchError) throw fetchError;
      setCtas(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido al obtener CTAs activos";
      setError(errorMsg);
      console.error("Error fetching active marketing CTAs:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchActiveCTAs();
  }, [fetchActiveCTAs]);

  return {
    ctas,
    loading,
    error,
    refreshCTAs: fetchActiveCTAs
  };
}
