"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { 
  X, 
  Tag, 
  DollarSign, 
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Package
} from "lucide-react";
import { toast } from "sonner";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import { useCategoryManager } from "@/hooks/useCategoryManager";
import { useProductManager } from "@/hooks/useProductManager";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { GlobalProduct } from "./GlobalProductSelector";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlobalProductSaveModalProps {
  isOpen: boolean;
  businessId: string;
  globalProduct: GlobalProduct | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GlobalProductSaveModal({ 
  isOpen, 
  businessId, 
  globalProduct, 
  onClose, 
  onSuccess 
}: GlobalProductSaveModalProps) {
  const { categories } = useCategoryManager(businessId);
  const { addProduct } = useProductManager(businessId);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [price, setPrice] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [inStock, setInStock] = useState(true);
  const [isOffer, setIsOffer] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);

  if (!isOpen || !globalProduct) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || parseFloat(price) <= 0) {
      setError("Por favor, ingresa un precio válido.");
      return;
    }
    if (!categoryName) {
      setError("Por favor, selecciona una categoría.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const productData = {
        global_product_id: globalProduct.id,
        name: null as any, // Null trigger fallback to global_products
        description: null as any, // Null trigger fallback to global_products
        price: parseFloat(price),
        category_name: categoryName,
        image_url: null as any, // Null trigger fallback to global_products
        in_stock: inStock,
        is_active: true,
        is_new: false,
        is_offer: isOffer,
        is_recommended: isRecommended
      };

      const result = await addProduct(productData);
      
      if (result) {
        toast.success(`"${globalProduct.name}" agregado con éxito a tu menú.`);
        onSuccess();
        onClose();
      } else {
        throw new Error("No se pudo agregar el producto.");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Ocurrió un error al guardar el producto";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 220 } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10,
      transition: { ease: "easeInOut", duration: 0.2 } 
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
        {/* Semi-transparent dark blur background */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/50 backdrop-blur-md"
        />

        {/* Modal Panel */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-premium border border-slate-100 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-fowy-secondary/10 rounded-xl flex items-center justify-center text-fowy-secondary">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Definir Precio Local</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Catálogo Fowy</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Product card overview */}
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex gap-4 items-center">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-slate-100 flex-shrink-0 shadow-sm relative">
              <PremiumImage 
                src={globalProduct.image_url || ""} 
                alt={globalProduct.name} 
                className="w-full h-full object-cover"
                fallbackType="generic"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-fowy-secondary uppercase tracking-widest bg-fowy-secondary/10 px-2 py-0.5 rounded-full">
                {globalProduct.category_default || "Bebidas"}
              </span>
              <h4 className="font-extrabold text-slate-800 text-base mt-1 line-clamp-1">
                {globalProduct.name}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                {globalProduct.description || "Heredará descripción del catálogo global."}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Price Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <DollarSign size={16} className="text-fowy-secondary" />
                Precio Local
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-10 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 focus:bg-white transition-all text-slate-700 font-bold"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-slate-400">Ingresa el precio de venta al público para tu negocio.</p>
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Layers size={16} className="text-fowy-secondary" />
                Categoría Local
              </label>
              <select 
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 focus:bg-white transition-all text-slate-700 font-medium appearance-none"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              >
                <option value="">Seleccionar de tu menú...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">¿Bajo cuál categoría de tu menú aparecerá este producto?</p>
            </div>

            {/* In Stock & Promo Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInStock(!inStock)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                  inStock 
                    ? "bg-green-50 border-green-500 text-green-600 shadow-sm" 
                    : "bg-red-50 border-red-500 text-red-600 shadow-sm"
                )}
              >
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", inStock ? "bg-green-500 text-white" : "bg-red-500 text-white")}>
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold">{inStock ? "Disponible" : "Agotado"}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsOffer(!isOffer)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                  isOffer 
                    ? "bg-orange-50 border-orange-500 text-orange-600 shadow-sm" 
                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                )}
              >
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", isOffer ? "bg-orange-500 text-white" : "bg-slate-50 text-slate-400")}>
                  <Tag size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold">{isOffer ? "En Oferta" : "Precio Normal"}</p>
                </div>
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
                <AlertCircle size={18} />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all text-sm"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] py-3 bg-fowy-secondary text-white rounded-2xl font-bold shadow-premium hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Agregar al Menú
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
