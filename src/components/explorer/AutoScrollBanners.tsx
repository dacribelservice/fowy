"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useActiveBanners } from "@/hooks/useActiveBanners";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import { useRouter } from "next/navigation";
import { Map } from "lucide-react";

export function AutoScrollBanners() {
  const { banners, loading, error } = useActiveBanners();
  const [isPaused, setIsPaused] = useState(false);
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
    
    // If external URL, open in new tab. Otherwise push to router.
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
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
            <span className="text-fowy-red hover:underline cursor-pointer transition-all active:scale-98" onClick={() => router.push("/explorar")}>
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-72 aspect-[16/9] bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 cursor-pointer transition-shadow duration-300 hover:shadow-md"
              >
                <div className="relative w-full h-full">
                  <PremiumImage
                    src={banner.image_url}
                    alt={banner.title || "Banner publicitario"}
                    className="w-full h-full object-cover"
                    fallbackType="generic"
                  />
                  
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
