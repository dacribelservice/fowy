"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  image_url: string;
}

interface ExplorerCategoryBarProps {
  categories: Category[];
  selectedCategoryId?: string | null;
  onSelectCategory: (id: string | null) => void;
}

export default function ExplorerCategoryBar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: ExplorerCategoryBarProps) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto py-6 px-4 no-scrollbar">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectCategory(null)}
        className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all ${
          !selectedCategoryId ? "opacity-100" : "opacity-60 hover:opacity-100"
        }`}
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-sm ${
          !selectedCategoryId 
            ? "bg-fowy-energy text-white shadow-fowy-red/20" 
            : "bg-white text-slate-400 group-hover:bg-slate-50 border border-slate-100"
        }`}>
          <span className="text-[10px] font-black uppercase">Todos</span>
        </div>
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Inicio</span>
      </motion.button>

      {categories.map((cat, index) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all ${
              isSelected ? "opacity-100" : "opacity-60 hover:opacity-100"
            }`}
          >
            <div className={`w-16 h-16 rounded-full p-[2px] transition-all overflow-hidden relative border-2 ${
              isSelected 
                ? "border-fowy-red shadow-sm shadow-fowy-red/10" 
                : "border-transparent bg-white group-hover:border-slate-100"
            }`}>
              <img
                src={cat.image_url || "/placeholder-category.png"}
                alt={cat.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest max-w-[80px] truncate text-center">
              {cat.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
