"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ReelFeedItem } from "@/types/reels";
import { getInstagramEmbedUrl } from "@/utils/instagram";
import { ReelActionCard } from "./ReelActionCard";
import { SwipeUpGestureHint } from "./SwipeUpGestureHint";

interface ReelPlayerModalProps {
  reels: ReelFeedItem[];
  initialIndex?: number;
  onClose: () => void;
  onViewOnMap?: (businessId: string) => void;
  onLoadMore?: () => void;
  onIncrementView?: (reelId: string) => void;
}

const supabase = createClient();

export function ReelPlayerModal({
  reels,
  initialIndex = 0,
  onClose,
  onViewOnMap,
  onLoadMore,
  onIncrementView,
}: ReelPlayerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<1 | -1>(1);
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
      onIncrementView?.(currentReelId);
      void (async () => {
        try {
          const { error } = await supabase.rpc("increment_reel_view", {
            target_reel_id: currentReelId,
          });
          if (error) {
            console.error("Error incrementing reel view:", error);
          }
        } catch (err) {
          console.error("Error in increment_reel_view:", err);
        }
      })();
    }
  }, [currentReelId, onIncrementView]);

  // Swipe Up Hint guiado con persistencia en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenHint = localStorage.getItem("fowy_reel_swipe_hint");
      if (!hasSeenHint) {
        setShowSwipeHint(true);
        localStorage.setItem("fowy_reel_swipe_hint", "true");
        const timer = setTimeout(() => setShowSwipeHint(false), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDragEnd = (_: any, info: any) => {
    setShowSwipeHint(false);
    const isUp = info.offset.y < -40 || info.velocity.y < -400;
    const isDown = info.offset.y > 40 || info.velocity.y > 400;
    if (isUp) {
      if (currentIndex >= reels.length - 2) onLoadMore?.();
      if (currentIndex < reels.length - 1) {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
      }
    } else if (isDown && currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentReel) return null;
  const embedUrl = getInstagramEmbedUrl(currentReel.instagramUrl);

  const slideVariants = {
    enter: (d: number) => ({ y: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (d: number) => ({ y: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="absolute inset-0 z-[1050] bg-black flex items-center justify-center overflow-hidden animate-in fade-in duration-200 rounded-[40px]">
      {/* Capas Gestuales de Deslizamiento sin bloquear el botón Play central */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd} className="absolute top-0 left-0 right-0 h-[35%] pointer-events-auto touch-none cursor-grab active:cursor-grabbing" />
        <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd} className="absolute bottom-24 left-0 right-0 h-[28%] pointer-events-auto touch-none cursor-grab active:cursor-grabbing" />
        <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd} className="absolute top-[35%] bottom-[28%] left-0 w-12 pointer-events-auto touch-none cursor-grab active:cursor-grabbing" />
        <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd} className="absolute top-[35%] bottom-[28%] right-0 w-12 pointer-events-auto touch-none cursor-grab active:cursor-grabbing" />
      </div>

      {/* Botón Flotante Superior para Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-10 right-4 z-30 p-2.5 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 active:scale-95 transition-all shadow-lg border border-white/10 pointer-events-auto"
        title="Cerrar video"
      >
        <X size={20} />
      </button>

      {/* Contenedor Principal del Video 9:16 con Desplazamiento Físico */}
      <div className="relative w-full h-full max-w-md overflow-hidden flex flex-col items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentReel.reelId}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ y: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.15 } }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* Skeleton Blur WebP con Cargador Frosted Glass de 4 Puntos Ondulantes */}
            {!iframeLoaded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                <img src={currentReel.thumbnailUrl || "/placeholder-reel.jpg"} alt={currentReel.title} className="w-full h-full object-cover filter blur-md opacity-60 scale-105" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.span key={i} className="w-2.5 h-2.5 rounded-full bg-white shadow-sm shadow-white/50" animate={{ y: [0, -6, 0], scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Iframe Embebido de Instagram */}
            {embedUrl && (
              <iframe src={embedUrl} className={`w-full h-full border-0 transition-opacity duration-300 ${iframeLoaded ? "opacity-100" : "opacity-0"}`} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen onLoad={() => setIframeLoaded(true)} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Micro-Animación de Inducción Táctil (Flecha con degradado y mano con Motion Trail) */}
        <AnimatePresence>
          {showSwipeHint && <SwipeUpGestureHint onFinish={() => setShowSwipeHint(false)} />}
        </AnimatePresence>

        {/* Tarjeta Flotante Inferior de Conversión */}
        <div className="absolute bottom-4 left-3 right-3 z-30 pointer-events-auto">
          <ReelActionCard reel={currentReel} onViewOnMap={onViewOnMap} onClosePlayer={onClose} />
        </div>
      </div>
    </div>
  );
}
