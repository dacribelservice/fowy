"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { BusinessReelsSummary, AdminReelsGlobalStats } from "@/types/reels";

const initialStats: AdminReelsGlobalStats = {
  totalActiveReels: 0,
  totalViews: 0,
  totalClicksToMenu: 0,
  globalConversionRate: 0,
  topBusinesses: [],
};

interface RawBusinessRow {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  city: string | null;
  status: boolean;
}

interface RawReelRow {
  id: string;
  business_id: string;
  is_active: boolean | null;
  views_count: number | null;
  clicks_to_menu_count: number | null;
}

export function useAdminReelsSummary() {
  const supabase = createClient();
  const [summaries, setSummaries] = useState<BusinessReelsSummary[]>([]);
  const [globalStats, setGlobalStats] =
    useState<AdminReelsGlobalStats>(initialStats);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [bizRes, reelsRes] = await Promise.all([
        supabase
          .from("businesses")
          .select("id, name, slug, logo_url, city, status")
          .order("name", { ascending: true }),
        supabase
          .from("business_reels")
          .select("id, business_id, is_active, views_count, clicks_to_menu_count"),
      ]);

      if (bizRes.error) throw bizRes.error;
      if (reelsRes.error) throw reelsRes.error;

      const businesses: RawBusinessRow[] = (bizRes.data || []) as RawBusinessRow[];
      const reels: RawReelRow[] = (reelsRes.data || []) as RawReelRow[];

      // Agrupación de reels por negocio
      const reelsByBusiness = new Map<string, RawReelRow[]>();
      reels.forEach((r: RawReelRow) => {
        const list = reelsByBusiness.get(r.business_id) || [];
        list.push(r);
        reelsByBusiness.set(r.business_id, list);
      });

      let totalActive = 0;
      let totalV = 0;
      let totalC = 0;

      const businessSummaries: BusinessReelsSummary[] = businesses.map((b: RawBusinessRow) => {
        const bReels = reelsByBusiness.get(b.id) || [];
        const activeCount = bReels.filter((r) => r.is_active).length;
        const bViews = bReels.reduce((acc: number, r) => acc + (r.views_count || 0), 0);
        const bClicks = bReels.reduce(
          (acc: number, r) => acc + (r.clicks_to_menu_count || 0),
          0
        );

        totalActive += activeCount;
        totalV += bViews;
        totalC += bClicks;

        return {
          businessId: b.id,
          businessName: b.name,
          businessSlug: b.slug,
          businessLogoUrl: b.logo_url,
          businessCity: b.city,
          status: b.status,
          totalReels: activeCount,
          totalViews: bViews,
          totalClicksToMenu: bClicks,
        };
      });

      const conversion =
        totalV > 0 ? Number(((totalC / totalV) * 100).toFixed(1)) : 0;
      const topBiz = [...businessSummaries]
        .filter((b) => b.totalViews > 0)
        .sort((a, b) => b.totalViews - a.totalViews)
        .slice(0, 5)
        .map((b) => ({
          businessId: b.businessId,
          businessName: b.businessName,
          totalViews: b.totalViews,
        }));

      setSummaries(businessSummaries);
      setGlobalStats({
        totalActiveReels: totalActive,
        totalViews: totalV,
        totalClicksToMenu: totalC,
        globalConversionRate: conversion,
        topBusinesses: topBiz,
      });
    } catch (err: any) {
      console.error("Error fetching admin reels summary:", err);
      setError(err.message || "Error al cargar el resumen analítico");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summaries,
    globalStats,
    loading,
    error,
    refreshSummary: fetchSummary,
  };
}
