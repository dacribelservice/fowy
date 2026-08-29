"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Compass } from "lucide-react";
import { useReelsFeed } from "@/hooks/useReelsFeed";
import { ReelsGrid } from "./ReelsGrid";
import { ReelPlayerModal } from "./ReelPlayerModal";
import { ReelFeedItem } from "@/types/reels";

interface ReelsFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  userLocation: [number, number] | { lat: number; lng: number } | null;
  cityName?: string;
  onViewOnMap?: (businessId: string) => void;
  initialReelId?: string | null;
}

export function ReelsFeedModal({
  isOpen,
  onClose,
  categories,
  userLocation,
  cityName = "Cali",
  onViewOnMap,
  initialReelId,
}: ReelsFeedModalProps) {
  const [activeReel, setActiveReel] = useState<ReelFeedItem | null>(null);

  const userLat = Array.isArray(userLocation)
    ? userLocation[0]
    : userLocation?.lat ?? null;
  const userLng = Array.isArray(userLocation)
    ? userLocation[1]
    : userLocation?.lng ?? null;

  const { reels, loading } = useReelsFeed({
    userLat,
    userLng,
  });

  // Deep-linking: abrir video si viene especificado por query param
  useEffect(() => {
    if (initialReelId && reels.length > 0 && !activeReel) {
      const match = reels.find((r) => r.reelId === initialReelId);
      if (match) setActiveReel(match);
    }
  }, [initialReelId, reels, activeReel]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="absolute inset-0 z-[70] bg-white flex flex-col overflow-hidden rounded-[40px]"
      >
        {/* Cabecera del Feed con espacio superior para el notch */}
        <div className="flex items-center justify-between px-4 pt-10 pb-2.5 bg-white/95 backdrop-blur-md border-b border-slate-100 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5A5F] to-[#FF9A3D] flex items-center justify-center text-white shadow-sm">
              <Compass size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                Descubre en {cityName}
              </h2>
              <p className="text-[10px] font-semibold text-slate-500">
                Videos y antojos en tiempo real
              </p>
            </div>
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
              onOpenReel={setActiveReel}
            />
          )}
        </div>

        {/* Reproductor Inmersivo Full-Screen */}
        {activeReel && (
          <ReelPlayerModal
            reel={activeReel}
            onClose={() => setActiveReel(null)}
            onViewOnMap={onViewOnMap}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
