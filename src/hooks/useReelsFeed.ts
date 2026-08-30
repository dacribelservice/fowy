"use client";

import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { ReelFeedItem } from "@/types/reels";

interface UseReelsFeedParams {
  userLat?: number | null;
  userLng?: number | null;
  filterCategoryId?: string | null;
  pageLimit?: number;
  pageOffset?: number;
}

const supabase = createClient();

async function fetchReelsFeed(
  key: [string, number | null, number | null, string | null, number, number]
): Promise<ReelFeedItem[]> {
  const [, userLat, userLng, filterCategoryId, pageLimit, pageOffset] = key;

  const { data, error } = await supabase.rpc("get_reels_feed", {
    user_lat: userLat ?? null,
    user_lng: userLng ?? null,
    filter_category_id: filterCategoryId ?? null,
    page_limit: pageLimit,
    page_offset: pageOffset,
  });

  if (error) {
    console.error("Error fetching reels feed:", error);
    throw error;
  }

  return (data || []).map((raw: any) => ({
    reelId: raw.reel_id,
    title: raw.title,
    instagramUrl: raw.instagram_url,
    thumbnailUrl: raw.thumbnail_url,
    viewsCount: raw.views_count || 0,
    clicksToMenuCount: raw.clicks_to_menu_count || 0,
    createdAt: raw.created_at,
    businessId: raw.business_id,
    businessName: raw.business_name,
    businessSlug: raw.business_slug,
    businessLogoUrl: raw.business_logo_url || null,
    businessCategoryId: raw.business_category_id || null,
    businessTags: raw.business_tags || [],
    distanceMeters:
      raw.distance_meters !== null && raw.distance_meters !== undefined
        ? Number(raw.distance_meters)
        : null,
  }));
}

export function useReelsFeed({
  userLat = null,
  userLng = null,
  filterCategoryId = null,
  pageLimit = 18,
  pageOffset = 0,
}: UseReelsFeedParams = {}) {
  const swrKey: [string, number | null, number | null, string | null, number, number] = [
    "reels-feed",
    userLat ?? null,
    userLng ?? null,
    filterCategoryId ?? null,
    pageLimit,
    pageOffset,
  ];

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetchReelsFeed, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    reels: data || [],
    loading: isLoading,
    error,
    refreshFeed: mutate,
  };
}
