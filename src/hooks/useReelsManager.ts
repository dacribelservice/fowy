"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { storageService } from "@/services/storageService";
import { BusinessReel } from "@/types/reels";

const mapRowToReel = (row: any): BusinessReel => ({
  id: row.id,
  businessId: row.business_id,
  title: row.title,
  instagramUrl: row.instagram_url,
  thumbnailUrl: row.thumbnail_url,
  isActive: row.is_active ?? true,
  viewsCount: row.views_count || 0,
  clicksToMenuCount: row.clicks_to_menu_count || 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export function useReelsManager(initialBusinessId?: string) {
  const supabase = createClient();
  const [reels, setReels] = useState<BusinessReel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReels = useCallback(
    async (businessId?: string) => {
      try {
        setLoading(true);
        setError(null);
        let query = supabase
          .from("business_reels")
          .select("*")
          .order("created_at", { ascending: false });

        const targetId = businessId || initialBusinessId;
        if (targetId) {
          query = query.eq("business_id", targetId);
        }

        const { data, error: fetchErr } = await query;
        if (fetchErr) throw fetchErr;

        setReels((data || []).map(mapRowToReel));
      } catch (err: any) {
        console.error("Error fetching admin reels:", err);
        setError(err.message || "Error al cargar los videos");
      } finally {
        setLoading(false);
      }
    },
    [initialBusinessId, supabase]
  );

  useEffect(() => {
    fetchReels(initialBusinessId);
  }, [fetchReels, initialBusinessId]);

  const createReel = async (payload: {
    businessId: string;
    title: string;
    instagramUrl: string;
    thumbnailUrl: string;
  }) => {
    const { data, error: insertErr } = await supabase
      .from("business_reels")
      .insert({
        business_id: payload.businessId,
        title: payload.title,
        instagram_url: payload.instagramUrl,
        thumbnail_url: payload.thumbnailUrl,
        is_active: true,
      })
      .select()
      .single();

    if (insertErr) throw insertErr;
    const newReel = mapRowToReel(data);
    setReels((prev) => [newReel, ...prev]);
    return newReel;
  };

  const updateReel = async (
    reelId: string,
    payload: {
      title?: string;
      instagramUrl?: string;
      thumbnailUrl?: string;
      isActive?: boolean;
    }
  ) => {
    const updateData: any = { updated_at: new Date().toISOString() };
    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.instagramUrl !== undefined)
      updateData.instagram_url = payload.instagramUrl;
    if (payload.thumbnailUrl !== undefined)
      updateData.thumbnail_url = payload.thumbnailUrl;
    if (payload.isActive !== undefined) updateData.is_active = payload.isActive;

    const { data, error: updateErr } = await supabase
      .from("business_reels")
      .update(updateData)
      .eq("id", reelId)
      .select()
      .single();

    if (updateErr) throw updateErr;
    const updated = mapRowToReel(data);
    setReels((prev) => prev.map((r) => (r.id === reelId ? updated : r)));
    return updated;
  };

  const toggleReelStatus = async (reelId: string, currentStatus: boolean) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId ? { ...r, isActive: !currentStatus } : r
      )
    );

    const { error: toggleErr } = await supabase
      .from("business_reels")
      .update({
        is_active: !currentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reelId);

    if (toggleErr) {
      setReels((prev) =>
        prev.map((r) =>
          r.id === reelId ? { ...r, isActive: currentStatus } : r
        )
      );
      throw toggleErr;
    }
  };

  const deleteReel = async (reelId: string, thumbnailUrl?: string) => {
    const previous = reels;
    setReels((prev) => prev.filter((r) => r.id !== reelId));

    const { error: deleteErr } = await supabase
      .from("business_reels")
      .delete()
      .eq("id", reelId);

    if (deleteErr) {
      setReels(previous);
      throw deleteErr;
    }

    if (thumbnailUrl) {
      await storageService.deleteFileByUrl(thumbnailUrl, "reels-thumbnails");
    }
  };

  return {
    reels,
    loading,
    error,
    fetchReels,
    createReel,
    updateReel,
    toggleReelStatus,
    deleteReel,
  };
}
