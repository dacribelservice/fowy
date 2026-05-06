"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PremiumImage from "@/components/admin/shared/PremiumImage";

interface Banner {
  id: string;
  image_url: string;
}

interface MenuHeroSliderV2Props {
  banners: Banner[];
  fallbackImage?: string;
  businessName: string;
  showBackButton?: boolean;
}

export function MenuHeroSliderV2({ 
  banners, 
  fallbackImage, 
  businessName,
  showBackButton = true 
}: MenuHeroSliderV2Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const images = banners && banners.length > 0 
    ? banners.map(b => b.image_url) 
    : fallbackImage ? [fallbackImage] : [];

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="group relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden rounded-b-[2.5rem] bg-slate-900 shadow-xl">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <PremiumImage
            src={images[currentIndex]}
            alt={`${businessName} Banner ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            fallbackType="generic"
          />
          {/* Soft dark gradient top to bottom for contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Back Button Overlay */}
      {showBackButton && (
        <div className="absolute top-4 left-4 z-50">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg hover:bg-black/40 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      )}

      {/* Pagination dots (Integrated minimal dots) */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex ? "w-6 bg-white opacity-100" : "w-1.5 bg-white opacity-40 hover:opacity-75"
              }`}
            />
          ))}
        </div>
      )}

      {/* Controls (Desktop only) */}
      {images.length > 1 && (
        <div className="hidden md:block pointer-events-none absolute inset-0 z-10">
          <button 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
