"use client";
import React from "react";
import { motion } from "framer-motion";

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
    <div className="pt-3 pb-4 w-full flex flex-col items-center">
      {/* Drag handle superior estilo iOS */}
      <div className="w-10 h-1 bg-slate-200/80 rounded-full mb-4" />

      {/* Carrusel */}
      <div className="w-full relative px-2">
        <div 
          className="flex items-center gap-5 overflow-x-auto scroll-smooth px-4 pb-4"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            // Si hay una categoría seleccionada y no es esta, la atenuamos
            const isDimmed = selectedCategoryId && !isSelected;

            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 outline-none transition-opacity duration-300 ${isDimmed ? 'opacity-50' : 'opacity-100'}`}
              >
                {/* Contenedor Circular más pequeño ajustado a la imagen */}
                <div className="w-[56px] h-[56px] rounded-full border-[3px] border-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] bg-[#FFF0F0] flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={cat.image_url || "/placeholder-category.png"} 
                    alt={cat.name}
                    className="w-[52px] h-[52px] object-contain"
                  />
                  
                  {/* Borde sutil de selección (opcional, como admin) */}
                  {isSelected && (
                    <div className="absolute -inset-[5px] border-[1.5px] border-fowy-red/50 rounded-full" />
                  )}
                </div>

                {/* Texto */}
                <span className="text-[11px] font-black uppercase tracking-wide text-slate-600">
                  {cat.name.length > 10 ? cat.name.substring(0, 8) + "..." : cat.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

