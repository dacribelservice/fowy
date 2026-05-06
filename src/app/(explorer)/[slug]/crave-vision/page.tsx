"use client";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MOCK_BUSINESS } from "@/data/mock-crave";
import { MapPin, Star } from "lucide-react";

/**
 * CraveVisionSandbox: El "Lienzo en Blanco" para el Re-Diseño Premium.
 * Esta página vive dentro del MobileFrame del layout, por lo que hereda el marco del celular.
 */
export default function CraveVisionSandbox() {
  const { slug } = useParams();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto-slide para el banner
  useEffect(() => {
    if (!MOCK_BUSINESS.banners || MOCK_BUSINESS.banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % MOCK_BUSINESS.banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white relative pb-20">
      {/* BLOQUE 2: HEADER Y BRANDING V3 */}
      
      {/* 2.3 SLIDER DE BANNERS */}
      <div className="relative w-full h-[280px] bg-slate-900 rounded-b-[40px] overflow-hidden shadow-sm">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentBannerIndex}
            src={MOCK_BUSINESS.banners[currentBannerIndex]?.image_url || MOCK_BUSINESS.banner_url}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Gradiente sutil inferior para legibilidad de los puntos */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>


        {/* Indicadores (Dots) animados */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {MOCK_BUSINESS.banners.map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-2.5 rounded-full bg-white transition-all duration-500 ease-in-out ${
                idx === currentBannerIndex ? "w-8 opacity-100" : "w-2.5 opacity-50"
              }`}
              layout
            />
          ))}
        </div>
      </div>

      {/* 2.1 & 2.2 IDENTITY BAR (Logo-Left / Text-Right) */}
      <div className="relative px-6 -mt-14 z-20 flex items-start gap-5">
        {/* Logo Circular */}
        <div className="w-28 h-28 rounded-full border-[5px] border-white overflow-hidden shadow-sm bg-white shrink-0">
          <img 
            src={MOCK_BUSINESS.logo_url} 
            alt={MOCK_BUSINESS.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detalles del Negocio */}
        <div className="pt-14 flex-1 min-w-0">
          <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight leading-none truncate">
            {MOCK_BUSINESS.name}
          </h1>
          
          {/* 2.2 Meta-datos Premium */}
          <div className="mt-2 flex items-center gap-3">
            {/* Estado: Abierto / Cerrado */}
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${MOCK_BUSINESS.is_open ? 'bg-[#34C759]' : 'bg-red-500'}`}></span>
              <span className={`text-[14px] font-bold tracking-wide ${MOCK_BUSINESS.is_open ? 'text-[#34C759]' : 'text-red-600'}`}>
                {MOCK_BUSINESS.is_open ? 'ABIERTO' : 'CERRADO'}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-[18px] h-[18px] fill-[#FFCC00] text-[#FFCC00]" />
              <span className="text-[14px] font-bold text-slate-900">{MOCK_BUSINESS.rating}</span>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              DISTANCIA {MOCK_BUSINESS.distance}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
