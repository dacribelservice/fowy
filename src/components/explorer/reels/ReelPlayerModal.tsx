"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pointer } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ReelFeedItem } from "@/types/reels";
import { getInstagramEmbedUrl } from "@/utils/instagram";
import { ReelActionCard } from "./ReelActionCard";

interface ReelPlayerModalProps {
  reels: ReelFeedItem[];
  initialIndex?: number;
  onClose: () => void;
  onViewOnMap?: (businessId: string) => void;
  onLoadMore?: () => void;
}

const supabase = createClient();

export function ReelPlayerModal({
  reels,
  initialIndex = 0,
  onClose,
  onViewOnMap,
  onLoadMore,
}: ReelPlayerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  const viewedReelIdsRef = useRef<Set<string>>(new Set());

  const currentReel = reels[currentIndex];
  const currentReelId = currentReel?.reelId;

  // Sincronizar índice inicial si cambia desde fuera
  useEffect(() => {
    if (initialIndex !== undefined && initialIndex >= 0 && initialIndex < reels.length) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, reels.length]);

  // Resetear estado de carga de iframe SOLO al cambiar de ID de video
  useEffect(() => {
    setIframeLoaded(false);
  }, [currentReelId]);

  // Registro atómico de vistas (1 sola vez por video por sesión)
  useEffect(() => {
    if (currentReelId && !viewedReelIdsRef.current.has(currentReelId)) {
      viewedReelIdsRef.current.add(currentReelId);
      void supabase.rpc("increment_reel_view", {
        target_reel_id: currentReelId,
      });
    }
  }, [currentReelId]);

  // Swipe Up Hint guiado con persistencia en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenHint = localStorage.getItem("fowy_reel_swipe_hint");
      if (!hasSeenHint) {
        setShowSwipeHint(true);
        localStorage.setItem("fowy_reel_swipe_hint", "true");
        const timer = setTimeout(() => setShowSwipeHint(false), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  if (!currentReel) return null;

  const embedUrl = getInstagramEmbedUrl(currentReel.instagramUrl);

  return (
    <div className="absolute inset-0 z-[1050] bg-black flex items-center justify-center overflow-hidden animate-in fade-in duration-200 rounded-[40px]">
      {/* Capa Gestual Transparente Superior con aceleración (Flick) y touch-none */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          const threshold = 50;
          const velocityThreshold = 500;
          setShowSwipeHint(false);

          const isSwipeUp = info.offset.y < -threshold || info.velocity.y < -velocityThreshold;
          const isSwipeDown = info.offset.y > threshold || info.velocity.y > velocityThreshold;

          if (isSwipeUp) {
            if (currentIndex >= reels.length - 2) {
              onLoadMore?.();
            }
            if (currentIndex < reels.length - 1) {
              setCurrentIndex((prev) => prev + 1);
            }
          } else if (isSwipeDown && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
          }
        }}
        className="absolute inset-0 z-20 touch-none cursor-grab active:cursor-grabbing"
      />

      {/* Botón Flotante Superior para Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-10 right-4 z-30 p-2.5 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 active:scale-95 transition-all shadow-lg border border-white/10 pointer-events-auto"
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
              src={currentReel.thumbnailUrl || "/placeholder-reel.jpg"}
              alt={currentReel.title}
              className="w-full h-full object-cover filter blur-md opacity-60 scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}

        {/* Iframe Embebido de Instagram con key única por video */}
        {embedUrl && (
          <iframe
            key={currentReel.reelId}
            src={embedUrl}
            className={`w-full h-full border-0 transition-opacity duration-300 ${
              iframeLoaded ? "opacity-100" : "opacity-0"
            }`}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setIframeLoaded(true)}
          />
        )}

        {/* Micro-Animación de Inducción Táctil (Swipe Up Hint) */}
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: -16 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
              transition={{
                y: { repeat: Infinity, repeatType: "reverse", duration: 0.7, ease: "easeInOut" },
                opacity: { duration: 0.3 },
              }}
              className="absolute z-40 pointer-events-none flex flex-col items-center gap-1.5 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-2xl"
            >
              <Pointer size={22} className="text-white drop-shadow-md -rotate-12" />
              <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">
                Desliza hacia arriba
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tarjeta Flotante Inferior de Conversión */}
        <div className="absolute bottom-4 left-3 right-3 z-30 pointer-events-auto">
          <ReelActionCard
            reel={currentReel}
            onViewOnMap={onViewOnMap}
            onClosePlayer={onClose}
          />
        </div>
      </div>
    </div>
  );
}
