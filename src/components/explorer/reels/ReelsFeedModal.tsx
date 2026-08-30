"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Poppins } from "next/font/google";
import { createClient } from "@/utils/supabase/client";
import { useReelsFeed } from "@/hooks/useReelsFeed";
import { ReelsGrid } from "./ReelsGrid";
import { ReelPlayerModal } from "./ReelPlayerModal";
import { ReelFeedItem } from "@/types/reels";

const poppins = Poppins({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface ReelsFeedModalProps {
  isOpen?: boolean;
  onClose: () => void;
  categories: any[];
  userLocation: [number, number] | { lat: number; lng: number } | null;
  cityName?: string;
  onViewOnMap?: (businessId: string) => void;
  initialReelId?: string | null;
}

export function ReelsFeedModal({
  onClose,
  categories,
  userLocation,
  cityName = "Cali",
  onViewOnMap,
  initialReelId,
}: ReelsFeedModalProps) {
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [deepLinkedReel, setDeepLinkedReel] = useState<ReelFeedItem | null>(null);
  const hasHandledDeepLinkRef = useRef<string | null>(null);

  const userLat = Array.isArray(userLocation)
    ? userLocation[0]
    : userLocation?.lat ?? null;
  const userLng = Array.isArray(userLocation)
    ? userLocation[1]
    : userLocation?.lng ?? null;

  const { reels, loading, loadingMore, isReachingEnd, isValidating, loadMore } = useReelsFeed({
    userLat,
    userLng,
  });

  // Deep-linking resiliente: busca en memoria o consulta el reel individual
  useEffect(() => {
    if (!initialReelId || hasHandledDeepLinkRef.current === initialReelId) return;

    const match = reels.find((r) => r.reelId === initialReelId);
    if (match) {
      hasHandledDeepLinkRef.current = initialReelId;
      setActiveReelId(match.reelId);
      return;
    }

    const fetchSingleReel = async () => {
      hasHandledDeepLinkRef.current = initialReelId;
      const supabase = createClient();
      const { data } = await supabase
        .from("business_reels")
        .select("id, title, instagram_url, thumbnail_url, views_count, clicks_to_menu_count, created_at, business_id, businesses(id, name, slug, logo_url, category_id, tags)")
        .eq("id", initialReelId)
        .eq("is_active", true)
        .single();

      if (data && data.businesses) {
        const biz: any = Array.isArray(data.businesses) ? data.businesses[0] : data.businesses;
        const singleItem: ReelFeedItem = {
          reelId: data.id,
          title: data.title,
          instagramUrl: data.instagram_url,
          thumbnailUrl: data.thumbnail_url,
          viewsCount: data.views_count || 0,
          clicksToMenuCount: data.clicks_to_menu_count || 0,
          createdAt: data.created_at,
          businessId: biz.id,
          businessName: biz.name,
          businessSlug: biz.slug,
          businessLogoUrl: biz.logo_url,
          businessCategoryId: biz.category_id,
          businessTags: biz.tags || [],
          distanceMeters: null,
        };
        setDeepLinkedReel(singleItem);
        setActiveReelId(singleItem.reelId);
      }
    };

    void fetchSingleReel();
  }, [initialReelId, reels]);

  // Lista viva reactiva combinada para navegación gestual infinita
  const activePlayerList = useMemo(() => {
    if (deepLinkedReel) {
      return [deepLinkedReel, ...reels.filter((r) => r.reelId !== deepLinkedReel.reelId)];
    }
    return reels;
  }, [deepLinkedReel, reels]);

  const activeIndex = useMemo(() => {
    if (!activeReelId) return 0;
    const idx = activePlayerList.findIndex((r) => r.reelId === activeReelId);
    return idx !== -1 ? idx : 0;
  }, [activeReelId, activePlayerList]);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      className="absolute inset-0 z-[1001] bg-white flex flex-col overflow-hidden rounded-[40px]"
    >
      {/* Cabecera del Feed con espacio superior para el notch */}
      <div className="flex items-center justify-between px-5 pt-10 pb-3 bg-white/95 backdrop-blur-md border-b border-slate-100 z-10">
        <div className="flex items-center">
          <span className={`${poppins.className} text-2xl font-bold text-[#ff0000] tracking-tight lowercase select-none`}>
            fowy reels
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
          title="Cerrar videos"
        >
          <X size={18} />
        </button>
      </div>

      {/* Contenido Deslizable */}
      <div className="flex-1 overflow-y-auto scroll-smooth pt-3">
        {loading && reels.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-400">
            <Loader2 size={28} className="animate-spin text-orange-500" />
            <span className="text-xs font-semibold">
              Cargando videos gastronómicos...
            </span>
          </div>
        ) : (
          <ReelsGrid
            reels={reels}
            categories={categories}
            onOpenReel={(reel) => setActiveReelId(reel.reelId)}
            onLoadMore={loadMore}
            loadingMore={loadingMore}
            isReachingEnd={isReachingEnd}
            isValidating={isValidating}
          />
        )}
      </div>

      {/* Reproductor Inmersivo Full-Screen */}
      {activeReelId && (
        <ReelPlayerModal
          reels={activePlayerList}
          initialIndex={activeIndex}
          onClose={() => setActiveReelId(null)}
          onViewOnMap={onViewOnMap}
          onLoadMore={loadMore}
        />
      )}
    </motion.div>
  );
}
