"use client";

import { useCallback, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { createClient } from "@/utils/supabase/client";
import { ReelFeedItem } from "@/types/reels";

interface UseReelsFeedParams {
  userLat?: number | null;
  userLng?: number | null;
  filterCategoryId?: string | null;
}

const PAGE_SIZE = 18;
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
}: UseReelsFeedParams = {}) {
  // Generador de claves para cada página consecutiva
  const getKey = (
    pageIndex: number,
    previousPageData: ReelFeedItem[] | null
  ) => {
    // FRENO INTELIGENTE: Si la página anterior vino vacía o menor a PAGE_SIZE,
    // se llegó al final del catálogo y NO se hacen más consultas a la DB.
    if (previousPageData && previousPageData.length < PAGE_SIZE) return null;

    return [
      "reels-feed",
      userLat ?? null,
      userLng ?? null,
      filterCategoryId ?? null,
      PAGE_SIZE,
      pageIndex * PAGE_SIZE, // page_offset dinámico
    ];
  };

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    fetchReelsFeed,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  // Deduplicación estricta por reelId para prevenir warnings de claves duplicadas en React
  const reels: ReelFeedItem[] = useMemo(() => {
    if (!data) return [];
    const flat = data.flat();
    const map = new Map<string, ReelFeedItem>();
    flat.forEach((item) => {
      if (item && !map.has(item.reelId)) {
        map.set(item.reelId, item);
      }
    });
    return Array.from(map.values());
  }, [data]);

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    Boolean(size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    Boolean(isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE));

  // Memoización estricta con useCallback para no romper el IntersectionObserver
  const loadMore = useCallback(() => {
    if (!isReachingEnd && !isLoadingMore && !isValidating) {
      setSize((prev) => prev + 1);
    }
  }, [isReachingEnd, isLoadingMore, isValidating, setSize]);

  return {
    reels,
    loading: isLoadingInitialData,
    loadingMore: isLoadingMore,
    isReachingEnd,
    isValidating,
    loadMore,
    error,
    refreshFeed: mutate,
  };
}
