"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import { GlobalCategory } from "@/types/catalogo";

export interface GlobalCategoriesCarouselProps {
  globalCategories: GlobalCategory[];
  onSelectCategory: (cat: GlobalCategory) => void;
}

export default function GlobalCategoriesCarousel({
  globalCategories,
  onSelectCategory
}: GlobalCategoriesCarouselProps) {
  if (globalCategories.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-fowy p-6 shadow-sm border border-white/50 relative overflow-hidden w-full max-w-full"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7B61FF]/5 to-fowy-secondary/5 rounded-full blur-3xl pointer-events-none" />
      
      <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2 relative z-10">
        <Sparkles size={20} className="text-fowy-secondary animate-pulse" />
        Catálogo Fowy
      </h3>
      <p className="text-sm text-slate-500 mb-6 relative z-10">
        Selecciona una categoría para agregar productos predefinidos a tu catálogo.
      </p>

      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 pt-2 px-2 w-full snap-x snap-mandatory scroll-smooth relative z-10 no-scrollbar">
        {globalCategories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelectCategory(cat)}
            className="flex flex-col items-center flex-shrink-0 snap-start focus:outline-none group cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/40 shadow-md backdrop-blur-md relative bg-slate-100 flex items-center justify-center transition-all group-hover:border-fowy-secondary/60">
              <PremiumImage
                src={cat.image_url || ""}
                alt={cat.name}
                className="w-full h-full object-cover"
                fallbackType="generic"
              />
            </div>
            <span className="text-xs font-extrabold text-slate-600 mt-3 text-center truncate w-24 group-hover:text-fowy-secondary transition-colors">
              {cat.name}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
