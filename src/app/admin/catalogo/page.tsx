"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Sparkles } from "lucide-react";
import CategoryTab from "@/components/admin/catalogo/CategoryTab";
import ProductTab from "@/components/admin/catalogo/ProductTab";
import CategoryFormModal from "@/components/admin/catalogo/CategoryFormModal";
import { GlobalCategory } from "@/types/catalogo";

export default function CatalogoFowyPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "products">("categories");
  const [categoriesKey, setCategoriesKey] = useState(0);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GlobalCategory | null>(null);

  const handleOpenCategoryModal = (category: GlobalCategory | null = null) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="pb-32 px-4 sm:px-8 max-w-full lg:max-w-[1600px] mx-auto">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-fowy-primary/10 flex items-center justify-center text-fowy-red">
              <Layers size={22} className="animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Catálogo Fowy
            </h1>
          </div>
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            Gestiona las categorías circulares y el menú unificado de productos globales del ecosistema Fowy.
          </p>
        </div>

        {/* Tabs Manager */}
        <div className="flex p-1.5 bg-slate-100 rounded-3xl self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === "categories"
                ? "bg-white text-slate-800 shadow-premium"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers size={16} />
            Categorías Globales
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === "products"
                ? "bg-white text-slate-800 shadow-premium"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles size={16} />
            Productos Globales
          </button>
        </div>
      </div>

      {/* Tabs View */}
      <AnimatePresence mode="wait">
        {activeTab === "categories" ? (
          <motion.div
            key={`tab-categories-${categoriesKey}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <CategoryTab onOpenModal={handleOpenCategoryModal} />
          </motion.div>
        ) : (
          <motion.div
            key="tab-products"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <ProductTab />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Category Form Modal */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => {
          setIsCategoryModalOpen(false);
          setCategoriesKey((prev) => prev + 1);
        }}
      />
    </div>
  );
}
