"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Utensils } from "lucide-react";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import GlobalProductCard from "./GlobalProductCard";
import { GlobalCategory } from "@/types/catalogo";
import { type Product } from "@/hooks/useProductManager";
import { type MenuCategory } from "@/hooks/useCategoryManager";

export interface FowyCatalogViewProps {
  selectedGlobalCat: GlobalCategory;
  globalSearchTerm: string;
  setGlobalSearchTerm: (term: string) => void;
  onBack: () => void;
  loadingGlobalProds: boolean;
  filteredGlobalProducts: any[];
  activeGlobalProductIds: Set<string>;
  products: Product[];
  localCategories: MenuCategory[];
  addLocalCategory: (name: string) => Promise<any>;
  addProduct: (product: any) => Promise<any>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateProduct: (id: string, updates: any) => Promise<any>;
}

export default function FowyCatalogView({
  selectedGlobalCat,
  globalSearchTerm,
  setGlobalSearchTerm,
  onBack,
  loadingGlobalProds,
  filteredGlobalProducts,
  activeGlobalProductIds,
  products,
  localCategories,
  addLocalCategory,
  addProduct,
  deleteProduct,
  updateProduct
}: FowyCatalogViewProps) {
  return (
    <motion.div
      key="global-catalog-subview"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="space-y-6"
    >
      {/* Header of the Catalog subview */}
      <div className="glass-morphism rounded-fowy p-6 shadow-sm border border-white/50 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7B61FF]/5 to-fowy-secondary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={onBack}
            className="p-3 bg-white/80 hover:bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-slate-800 transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-fowy-secondary/30 shadow-md relative bg-slate-50 flex items-center justify-center">
              <PremiumImage
                src={selectedGlobalCat.image_url || ""}
                alt={selectedGlobalCat.name}
                className="w-full h-full object-cover"
                fallbackType="generic"
              />
            </div>
            <div>
              <span className="text-[10px] text-fowy-secondary font-black uppercase tracking-widest bg-fowy-secondary/10 px-2.5 py-1 rounded-full">
                Catálogo Fowy
              </span>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                {selectedGlobalCat.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Buscador dentro de la categoría */}
        <div className="relative w-full md:max-w-xs z-10">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder={`Buscar en ${selectedGlobalCat.name}...`}
            value={globalSearchTerm}
            onChange={(e) => setGlobalSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/90 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 focus:bg-white transition-all text-slate-700 font-medium placeholder-slate-400 shadow-sm"
          />
        </div>
      </div>

      {/* Listado de Productos Globales */}
      {loadingGlobalProds ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-3xl p-4 space-y-4 animate-pulse shadow-sm">
              <div className="aspect-square w-full bg-slate-100 rounded-2xl" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredGlobalProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGlobalProducts.map((gp) => {
            const isActive = activeGlobalProductIds.has(gp.id);
            const activeProduct = products.find(p => p.global_product_id === gp.id);
            return (
              <GlobalProductCard
                key={gp.id}
                gp={gp}
                isActive={isActive}
                activeProduct={activeProduct}
                selectedGlobalCat={selectedGlobalCat}
                localCategories={localCategories}
                addLocalCategory={addLocalCategory}
                addProduct={addProduct}
                deleteProduct={deleteProduct}
                updateProduct={updateProduct}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
            <Utensils size={28} />
          </div>
          <h4 className="text-lg font-bold text-slate-800">No hay productos en esta categoría</h4>
          <p className="text-sm text-slate-400 max-w-sm mt-2">
            Pronto se agregarán más productos predefinidos a esta sección del catálogo global de Fowy.
          </p>
        </div>
      )}
    </motion.div>
  );
}
