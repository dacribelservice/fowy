"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Check } from "lucide-react";

export interface BusinessTagsManagerProps {
  dbCategories: string[];
  selectedCategories: string[];
  toggleCategory: (id: string) => void;
  onSave: () => Promise<void>;
  savingCats: boolean;
  loadingCategories: boolean;
  hasChanges?: boolean;
}

export default function BusinessTagsManager({
  dbCategories,
  selectedCategories,
  toggleCategory,
  onSave,
  savingCats,
  loadingCategories,
  hasChanges = false
}: BusinessTagsManagerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-morphism rounded-fowy p-6 shadow-sm border border-white/50 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Etiquetas de tu Negocio</h3>
          <p className="text-xs text-slate-500">Selecciona las etiquetas que mejor representan los productos que vendes.</p>
        </div>
        <AnimatePresence>
          {hasChanges && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              onClick={onSave}
              disabled={savingCats}
              className="px-6 py-3 bg-fowy-secondary text-white font-extrabold text-xs rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-fowy-secondary/20"
            >
              {savingCats ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={14} />
                  Guardar Etiquetas
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {loadingCategories ? (
        <div className="flex flex-wrap gap-2 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-2xl w-24" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {dbCategories.map((catName) => {
            const isSelected = selectedCategories.includes(catName);
            return (
              <motion.button
                key={catName}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => toggleCategory(catName)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-r from-[#7B61FF] to-[#4D8BFF] text-white border-white/20 shadow-md shadow-indigo-500/15"
                    : "bg-white/45 border-slate-200/70 text-slate-600 hover:border-[#4D8BFF]/40 hover:bg-white hover:text-[#4D8BFF]"
                }`}
              >
                {isSelected && <Check size={14} className="stroke-[3px]" />}
                {catName}
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
