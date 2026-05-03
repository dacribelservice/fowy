"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  X, 
  GripVertical, 
  Trash2, 
  Tag, 
  Layers,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useCategoryManager, type MenuCategory } from "@/hooks/useCategoryManager";

interface MenuCategoryManagerProps {
  businessId: string;
  onClose: () => void;
}

export default function MenuCategoryManager({ businessId, onClose }: MenuCategoryManagerProps) {
  const { 
    categories, 
    loading, 
    addCategory, 
    deleteCategory, 
    reorderCategories 
  } = useCategoryManager(businessId);
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setIsAdding(true);
    await addCategory(newCategoryName.trim());
    setNewCategoryName("");
    setIsAdding(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="glass-morphism rounded-fowy p-8 shadow-glass relative overflow-hidden max-w-2xl w-full"
    >
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-fowy-secondary/10 to-fowy-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-fowy-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm border border-white/50 text-fowy-secondary">
            <Layers size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Categorías Locales</h3>
            <p className="text-slate-500 text-sm">Organiza tu menú por secciones propias.</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/50 rounded-full transition-all text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
      </div>

      {/* Input Section */}
      <form onSubmit={handleAdd} className="flex gap-3 mb-8 relative z-10">
        <div className="relative flex-1">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Ej: Hamburguesas, Bebidas, Postres..."
            className="w-full pl-12 pr-4 py-4 glass-morphism rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 transition-all border border-white/50 shadow-inner-sm text-slate-700 font-medium"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={isAdding}
          />
        </div>
        <button 
          type="submit"
          disabled={!newCategoryName.trim() || isAdding}
          className="px-8 py-4 bg-fowy-secondary text-white rounded-2xl font-bold shadow-premium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus size={20} />
          )}
          Añadir
        </button>
      </form>

      {/* Categories List (Animated Chips) */}
      <div className="space-y-4 relative z-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {loading && categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 italic">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-fowy-secondary rounded-full animate-spin mb-4" />
            Cargando categorías...
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center glass-morphism rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <Tag size={32} />
            </div>
            <p className="text-slate-500 font-medium">Aún no has creado categorías.</p>
            <p className="text-slate-400 text-xs mt-1">Empieza añadiendo una arriba.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <AnimatePresence mode="popLayout">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  variants={itemVariants}
                  layout
                  className="group relative"
                >
                  <div className="flex items-center gap-3 px-5 py-3 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm hover:shadow-premium hover:bg-white transition-all duration-300">
                    <span className="font-bold text-slate-700">{cat.name}</span>
                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-8 pt-6 border-t border-white/20 flex items-center gap-3 text-slate-400 italic text-[11px] relative z-10">
        <AlertCircle size={14} />
        Estas categorías son exclusivas para organizar tus productos dentro de FOWY.
      </div>
    </motion.div>
  );
}
