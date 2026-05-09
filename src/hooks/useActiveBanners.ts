"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface ActiveMarketingBanner {
  id: string;
  image_url: string;
  title: string | null;
  link_url: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export function useActiveBanners() {
  const [banners, setBanners] = useState<ActiveMarketingBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchActiveBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
          .from("marketing_banners")
          .select("id, image_url, title, link_url, is_active, sort_order, created_at")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

      if (fetchError) throw fetchError;
      setBanners(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido al obtener banners activos";
      setError(errorMsg);
      console.error("Error fetching active marketing banners:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchActiveBanners();
  }, [fetchActiveBanners]);

  return {
    banners,
    loading,
    error,
    refreshBanners: fetchActiveBanners
  };
}
