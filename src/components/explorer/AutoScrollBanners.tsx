"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveBanners } from "@/hooks/useActiveBanners";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import { useRouter } from "next/navigation";
import { Map } from "lucide-react";

export function AutoScrollBanners() {
  const { banners, loading, error } = useActiveBanners();
  const [isPaused, setIsPaused] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  // If loading or error, we render a beautiful skeleton loading state or gracefully return null
  if (loading) {
    return (
      <div className="w-full py-8 px-4 bg-slate-50/50 backdrop-blur-md border-t border-slate-200/50">
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-4 bg-slate-200/60 rounded-full w-2/3 mx-auto animate-pulse" />
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-72 h-36 bg-slate-200/40 rounded-3xl animate-pulse border border-slate-200/30"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !banners || banners.length === 0) {
    return null;
  }

  const handleBannerClick = (url: string) => {
    if (!url) return;
    
    // If external URL, open in new tab. Otherwise push to router with loader state.
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      setIsRedirecting(true);
      router.push(url);
    }
  };

  // 1. Prepare base items to fill at least the screen width (min 4 items)
  let baseBanners = [...banners];
  while (baseBanners.length < 4) {
    baseBanners = [...baseBanners, ...banners];
  }

  // 2. Duplicate the sequence exactly once for the mathematically perfect infinite marquee loop
  const duplicatedBanners = [...baseBanners, ...baseBanners];

  // 3. Calculate animation duration to guarantee a constant scrolling speed (e.g., 50px/sec)
  // Banner width = 288px (w-72) + 16px (pr-4 padding) = 304px total width per item
  const itemWidth = 304;
  const scrollDistance = baseBanners.length * itemWidth; // Distance to translate (50% of the total container width)
  const speedPixelsPerSecond = 40; // Sleek, smooth, easily readable scrolling pace
  const duration = scrollDistance / speedPixelsPerSecond;

  return (
    <div className="w-full py-8 bg-slate-50/60 backdrop-blur-md border-t border-slate-200/50 overflow-hidden select-none relative">
      {/* 19.4.3 Redirection Transition Overlay Loader */}
      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[9999] flex flex-col items-center justify-center"
          >
            <div className="relative flex flex-col items-center">
              {/* Outer Pulsing Glow */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute w-20 h-20 bg-fowy-red/20 rounded-full blur-xl"
              />
              
              {/* Spinning Logo Ring */}
              <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-fowy-red border-r-fowy-red"
                />
                
                {/* Center Compass Icon pulsing */}
                <motion.div
                  animate={{ scale: [0.9, 1.1, 0.9] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <Map className="text-fowy-red w-6 h-6" />
                </motion.div>
              </div>

              {/* Status Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 flex flex-col items-center gap-1 text-center"
              >
                <span className="text-white text-xs font-black uppercase tracking-[0.2em] animate-pulse">
                  FOWY EXPLORADOR
                </span>
                <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                  Buscando experiencias...
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Self-contained high-performance CSS animation to prevent layout thrashing */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-track {
          display: flex;
          width: max-content;
          animation: marquee var(--marquee-duration, 30s) linear infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-150%) skewX(-25deg);
          }
          30% {
            transform: translateX(150%) skewX(-25deg);
          }
          100% {
            transform: translateX(150%) skewX(-25deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto overflow-hidden">
        {/* 19.3.5 Unified Call to Action (CTA) Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-6 px-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fowy-red/10 text-fowy-red text-[10px] font-black uppercase tracking-widest mb-2.5">
            <Map size={12} className="animate-bounce" />
            Descubre Más Experiencias
          </div>
          <h4 className="text-sm font-black text-slate-800 tracking-tight leading-tight max-w-sm mx-auto">
            ¿Te quedaste con hambre de más? <br />
            <span 
              className="text-fowy-red hover:underline cursor-pointer transition-all active:scale-98" 
              onClick={() => {
                setIsRedirecting(true);
                router.push("/explorar");
              }}
            >
              Explora otros locales en el mapa 🗺️
            </span>
          </h4>
        </motion.div>

        {/* Horizontal Scroll Track Wrapper */}
        <div 
          className="animate-marquee-track"
          style={{ 
            "--marquee-duration": `${duration}s`,
            animationPlayState: isPaused ? "paused" : "running"
          } as React.CSSProperties}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {duplicatedBanners.map((banner, index) => (
            <div key={`${banner.id}-${index}`} className="flex-shrink-0 pr-4">
              <motion.div
                onClick={() => handleBannerClick(banner.link_url)}
                whileHover={{ 
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)"
                }}
                whileTap={{ 
                  scale: 0.97,
                  y: -1,
                  boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)"
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 17 
                }}
                className="w-72 aspect-[16/9] bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 cursor-pointer"
              >
                <div className="relative w-full h-full">
                  <PremiumImage
                    src={banner.image_url}
                    alt={banner.title || "Banner publicitario"}
                    className="w-full h-full object-cover"
                    fallbackType="generic"
                  />
                  
                  {/* Premium Diagonal Shimmer Effect (Fase 19.4.1) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                  
                  {/* Overlay gradient for premium readability */}
                  {banner.title && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                      <span className="text-white text-sm font-black tracking-tight leading-tight uppercase drop-shadow">
                        {banner.title}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
