"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, User, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Banner {
  id: string;
  image_url: string;
}

interface MenuHeroSliderProps {
  banners: Banner[];
  fallbackImage?: string;
  businessName: string;
  user?: any;
}

export function MenuHeroSlider({ banners, fallbackImage, businessName, user }: MenuHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const images = banners.length > 0 
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
    <div className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden rounded-b-[3rem] bg-slate-200 shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt={`${businessName} Banner ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Top Bar Overlay (15.1.5) */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-2xl hover:bg-black/40 transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>

        <Link href={user ? "/perfil" : "/login"}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 p-1.5 pr-5 rounded-full shadow-2xl"
          >
            <div className="w-10 h-10 rounded-full border-2 border-white/40 overflow-hidden bg-slate-800 flex items-center justify-center">
              {user?.user_metadata?.avatar_url || user?.avatar_url ? (
                <img 
                  src={user.user_metadata?.avatar_url || user.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-white" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none">Mi Cuenta</span>
              <span className="text-xs font-black text-white truncate max-w-[100px]">
                {user ? (user.user_metadata?.full_name || "Usuario") : "Ingresar"}
              </span>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Center Branding (Subtle) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Digital Menu Experience</p>
          <h1 className="text-5xl font-black text-white tracking-tighter opacity-10">{businessName}</h1>
        </motion.div>
      </div>

      {/* Pagination dots */}
      {images.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-700 ${
                idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Controls (Desktop only) */}
      {images.length > 1 && (
        <div className="hidden md:block">
          <button 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
