import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image_url: string;
}

interface CategoryStripProps {
  categories: Category[];
  onAddClick: () => void;
  onDeleteCategory?: (id: string) => void;
}

export default function CategoryStrip({ categories, onAddClick, onDeleteCategory }: CategoryStripProps) {
  return (
    <div className="flex items-center gap-6 mb-10 overflow-x-auto pb-4 no-scrollbar">
      {/* Botón de Agregar Categoría */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddClick}
        className="flex-shrink-0 w-16 h-16 rounded-full bg-fowy-primary text-white flex items-center justify-center shadow-lg shadow-fowy-red/20 hover:shadow-fowy-red/30 transition-all"
        title="Agregar Categoría"
      >
        <Plus size={32} />
      </motion.button>

      {/* Lista de Categorías */}
      {categories.map((cat, index) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex flex-col items-center gap-2 group cursor-pointer flex-shrink-0 relative"
        >
          {/* Botón Eliminar Minimalista */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCategory?.(cat.id);
            }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-50 text-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-500 z-10 shadow-sm"
          >
            <X size={12} />
          </button>

          <div className="w-16 h-16 rounded-full p-[2px] bg-white shadow-sm border border-slate-100 group-hover:border-fowy-orange transition-all overflow-hidden relative">
            <img
              src={cat.image_url || "/placeholder-category.png"}
              alt={cat.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-[10px] font-bold text-slate-500 group-hover:text-fowy-orange transition-colors uppercase tracking-widest text-center max-w-[80px] truncate">
            {cat.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
