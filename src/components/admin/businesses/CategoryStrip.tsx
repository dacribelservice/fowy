"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image_url: string;
}

interface CategoryStripProps {
  categories: Category[];
  onAddClick: () => void;
}

export default function CategoryStrip({ categories, onAddClick }: CategoryStripProps) {
  return (
    <div className="flex items-center gap-6 mb-10 overflow-x-auto pb-2 no-scrollbar">
      {/* Botón de Agregar Categoría */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddClick}
        className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-fowy-orange hover:text-fowy-orange hover:bg-fowy-orange/5 transition-all shadow-sm"
        title="Agregar Categoría"
      >
        <Plus size={28} />
      </motion.button>

      {/* Lista de Categorías */}
      {categories.map((cat, index) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex flex-col items-center gap-2 group cursor-pointer flex-shrink-0"
        >
          <div className="w-16 h-16 rounded-full p-[2px] bg-white shadow-sm border border-slate-100 group-hover:border-fowy-orange transition-all overflow-hidden">
            <img
              src={cat.image_url || "/placeholder-category.png"}
              alt={cat.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 group-hover:text-fowy-orange transition-colors uppercase tracking-wider">
            {cat.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
