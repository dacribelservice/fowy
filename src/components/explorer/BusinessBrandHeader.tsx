"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import PremiumImage from "@/components/admin/shared/PremiumImage";

interface BusinessBrandHeaderProps {
  business: {
    id: string;
    name: string;
    logo_url: string;
    color_identity?: string;
  };
  rating?: number;
  reviewsCount?: number;
  distance?: string;
  isOpen?: boolean;
}

export function BusinessBrandHeader({ 
  business, 
  rating = 4.5, 
  reviewsCount = 124,
  distance = "4.6K",
  isOpen = true
}: BusinessBrandHeaderProps) {
  return (
    <div className="relative px-6 flex flex-col items-center -mt-16 z-30 mb-6">
      {/* 2.1 Logo Circular Solapado */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-32 h-32 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-white mb-4 relative z-10 flex-shrink-0"
      >
        <PremiumImage 
          src={business.logo_url} 
          alt={business.name} 
          className="w-full h-full object-cover"
          fallbackType="logo"
        />
      </motion.div>

      {/* 2.2 Tipografía Premium */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full text-center"
      >
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-3">
          {business.name}
        </h1>
      </motion.div>

      {/* 2.3 Fila de Meta-datos Compacta */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-3 text-sm font-bold"
      >
        {/* Indicador de Estado */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            {isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOpen ? "bg-green-500" : "bg-red-500"}`}></span>
          </span>
          <span className={isOpen ? "text-green-600" : "text-red-600"} style={{ letterSpacing: "-0.02em" }}>
            {isOpen ? "ABIERTO" : "CERRADO"}
          </span>
        </div>

        <span className="text-slate-300">•</span>

        {/* Rating */}
        <div className="flex items-center gap-1 text-slate-800">
          <Star size={16} className="fill-amber-400 text-amber-400" />
          <span style={{ letterSpacing: "-0.02em" }}>{rating}</span>
        </div>

        <span className="text-slate-300">•</span>

        {/* Distancia */}
        <div className="text-slate-500 tracking-tight">
          DISTANCIA {distance}
        </div>
      </motion.div>
    </div>
  );
}
