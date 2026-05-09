"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";

interface MarketingBannerHeaderProps {
  onAddClick: () => void;
}

export default function MarketingBannerHeader({ onAddClick }: MarketingBannerHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-tr from-fowy-primary to-rose-500 text-white rounded-xl shadow-md">
            <Sparkles size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-fowy-primary bg-fowy-primary/10 px-3 py-1 rounded-full border border-fowy-primary/10">
            Super Admin
          </span>
        </div>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-850 tracking-tight"
        >
          Campañas y Marketing
        </motion.h2>
        <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">
          Administra los banners publicitarios horizontales de pie de página para los menús digitales.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddClick}
        className="flex items-center gap-2 px-6 py-4 bg-fowy-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-fowy-red/20 hover:shadow-fowy-red/30 transition-all"
      >
        <Plus size={18} />
        <span>Agregar Banner</span>
      </motion.button>
    </div>
  );
}
