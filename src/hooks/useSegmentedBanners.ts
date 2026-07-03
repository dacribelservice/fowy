"use client";

import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { MarketingBanner } from "@/hooks/useMarketingManager";

export interface SegmentedBanner extends MarketingBanner {
  destination_business?: {
    slug: string;
    status: boolean;
  } | null;
}

const supabase = createClient();

// Fetcher function for SWR
const fetcher = async ([_, businessId, city]: [string, string, string | null]) => {
  const orConditions = ["and(target_business_id.is.null,target_city.is.null)"];
  
  if (businessId) {
    orConditions.push(`target_business_id.eq.${businessId}`);
  }
  
  if (city) {
    orConditions.push(`target_city.eq."${city}"`);
  }

  const { data, error } = await supabase
    .from("marketing_banners")
    .select(`
      id,
      image_url,
      title,
      link_url,
      is_active,
      sort_order,
      created_at,
      target_city,
      target_business_id,
      destination_business_id,
      destination_business:businesses!marketing_banners_destination_business_id_fkey(slug, status)
    `)
    .eq("is_active", true)
    .or(orConditions.join(","))
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  // Filter out banners with inactive destination businesses in JS (Left Join style)
  // This ensures banners with free web links (destination_business_id = null) are not hidden.
  return (data || []).filter((banner: any) => {
    if (banner.destination_business_id) {
      return banner.destination_business?.status === true;
    }
    return true;
  }) as SegmentedBanner[];
};

export function useSegmentedBanners(businessId: string, city: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    businessId ? ["segmented-banners", businessId, city] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // Cache de-duplication window of 30 seconds
    }
  );

  return {
    banners: data || [],
    isLoading,
    error,
    mutate
  };
}
