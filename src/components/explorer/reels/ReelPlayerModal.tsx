"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ReelFeedItem } from "@/types/reels";
import { getInstagramEmbedUrl } from "@/utils/instagram";
import { ReelActionCard } from "./ReelActionCard";

interface ReelPlayerModalProps {
  reel: ReelFeedItem | null;
  onClose: () => void;
  onViewOnMap?: (businessId: string) => void;
}

const supabase = createClient();

export function ReelPlayerModal({
  reel,
  onClose,
  onViewOnMap,
}: ReelPlayerModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const hasIncrementedViewRef = useRef(false);

  useEffect(() => {
    if (reel && !hasIncrementedViewRef.current) {
      hasIncrementedViewRef.current = true;
      void supabase.rpc("increment_reel_view", {
        target_reel_id: reel.reelId,
      });
    }
  }, [reel]);

  if (!reel) return null;

  const embedUrl = getInstagramEmbedUrl(reel.instagramUrl);

  return (
    <div className="absolute inset-0 z-[80] bg-black flex items-center justify-center overflow-hidden animate-in fade-in duration-200 rounded-[40px]">
      {/* Botón Flotante Superior para Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-10 right-4 z-30 p-2.5 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 active:scale-95 transition-all shadow-lg border border-white/10"
        title="Cerrar video"
      >
        <X size={20} />
      </button>

      {/* Contenedor Principal del Video 9:16 */}
      <div className="relative w-full h-full max-w-md flex flex-col items-center justify-center">
        {/* Skeleton Blur WebP ("Zero Pantalla Negra") */}
        {!iframeLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            <img
              src={reel.thumbnailUrl || "/placeholder-reel.jpg"}
              alt={reel.title}
              className="w-full h-full object-cover filter blur-md opacity-60 scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}

        {/* Iframe Embebido de Instagram */}
        {embedUrl && (
          <iframe
            src={embedUrl}
            className={`w-full h-full border-0 transition-opacity duration-300 ${
              iframeLoaded ? "opacity-100" : "opacity-0"
            }`}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setIframeLoaded(true)}
          />
        )}

        {/* Tarjeta Flotante Inferior de Conversión */}
        <div className="absolute bottom-4 left-3 right-3 z-20 pointer-events-auto">
          <ReelActionCard
            reel={reel}
            onViewOnMap={onViewOnMap}
            onClosePlayer={onClose}
          />
        </div>
      </div>
    </div>
  );
}
