"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import { GlobalProduct } from "@/components/partners/business/menu/GlobalProductSelector";
import { GlobalCategory } from "@/types/catalogo";
import { type Product } from "@/hooks/useProductManager";
import { type MenuCategory } from "@/hooks/useCategoryManager";

export interface GlobalProductCardProps {
  gp: GlobalProduct;
  isActive: boolean;
  activeProduct: Product | undefined;
  selectedGlobalCat: GlobalCategory;
  localCategories: MenuCategory[];
  addLocalCategory: (name: string) => Promise<any>;
  addProduct: (product: any) => Promise<any>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateProduct: (id: string, updates: any) => Promise<any>;
}

export default function GlobalProductCard({
  gp,
  isActive,
  activeProduct,
  selectedGlobalCat,
  localCategories,
  addLocalCategory,
  addProduct,
  deleteProduct,
  updateProduct
}: GlobalProductCardProps) {
  const [priceInput, setPriceInput] = useState(activeProduct ? activeProduct.price.toString() : "");
  const [descInput, setDescInput] = useState(activeProduct ? activeProduct.description : "");
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const priceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeProduct) {
      setPriceInput(activeProduct.price.toString());
      setDescInput(activeProduct.description || "");
    } else {
      setPriceInput("");
      setDescInput("");
    }
  }, [activeProduct]);

  useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        priceInputRef.current?.focus();
        priceInputRef.current?.select();
      }, 150);
    }
  }, [isActive]);

  const handleSaveInline = async () => {
    if (!activeProduct) return;
    const priceValue = parseFloat(priceInput);
    const finalPrice = isNaN(priceValue) ? 0 : priceValue;
    const finalDesc = descInput.trim();

    if (finalPrice === activeProduct.price && finalDesc === (activeProduct.description || "")) {
      return;
    }

    setIsSaving(true);
    setJustSaved(false);

    const updated = await updateProduct(activeProduct.id, {
      price: finalPrice,
      description: finalDesc
    });

    setIsSaving(false);
    if (updated) {
      setJustSaved(true);
      toast.success(`"${gp.name}" actualizado.`);
      setTimeout(() => setJustSaved(false), 2000);
    } else {
      toast.error("Error al guardar los cambios.");
    }
  };

  const handleToggleSwitch = async () => {
    if (isActive && activeProduct) {
      setIsConfirmOpen(true);
    } else {
      setIsSaving(true);
      try {
        let localCat = localCategories.find(
          c => c.name.trim().toLowerCase() === selectedGlobalCat.name.trim().toLowerCase()
        );

        if (!localCat) {
          localCat = await addLocalCategory(selectedGlobalCat.name);
          if (!localCat) {
            toast.error("Error al crear la categoría automáticamente.");
            return;
          }
          toast.success(`Categoría "${selectedGlobalCat.name}" creada automáticamente.`);
        }

        const newProduct = await addProduct({
          global_product_id: gp.id,
          name: gp.name,
          description: gp.description || "",
          price: 0,
          image_url: gp.image_url || "",
          category_name: localCat.name,
          category_id: localCat.id,
          in_stock: true,
          is_active: true,
          is_new: false,
          is_offer: false,
          is_recommended: false
        });

        if (newProduct) {
          toast.success(`"${gp.name}" agregado a tu menú.`);
        } else {
          toast.error("Error al agregar el producto.");
        }
      } catch (err) {
        console.error("Error toggling global product:", err);
        toast.error("Ocurrió un error.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!activeProduct) return;
    setIsConfirmOpen(false);
    setIsSaving(true);
    const ok = await deleteProduct(activeProduct.id);
    setIsSaving(false);
    if (ok) {
      toast.success(`"${gp.name}" eliminado de tu menú.`);
    } else {
      toast.error(`Error al eliminar "${gp.name}".`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col justify-between hover:shadow-premium hover:border-fowy-secondary/20 transition-all shadow-sm"
    >
      <div>
        {/* Imagen de Producto Global */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 mb-4 border border-slate-100">
          <PremiumImage
            src={gp.image_url || ""}
            alt={gp.name}
            className="w-full h-full object-cover"
            fallbackType="generic"
          />
          {gp.category_default && (
            <span className="absolute top-3 left-3 bg-slate-900/65 backdrop-blur-md text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {gp.category_default}
            </span>
          )}
        </div>

        {/* Detalles */}
        <h4 className="font-extrabold text-slate-800 text-base line-clamp-1">
          {gp.name}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[32px] leading-relaxed">
          {gp.description || "Sin descripción predeterminada."}
        </p>
      </div>

      <div>
        {/* Interactive Switch Container */}
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Estado Menú
            </span>
            <span className={`text-xs font-extrabold ${isActive ? "text-fowy-secondary" : "text-slate-400"}`}>
              {isActive ? "Activo" : "Inactivo"}
            </span>
          </div>
          
          {/* Switch component with Framer Motion */}
          <button
            onClick={handleToggleSwitch}
            disabled={isSaving}
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center cursor-pointer ${
              isActive ? "bg-[#7B61FF]" : "bg-slate-200"
            } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <motion.div
              layout
              className="w-5 h-5 bg-white rounded-full shadow-md"
              animate={{ x: isActive ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Expandable pricing form */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-slate-100 space-y-3"
            >
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Precio Local ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                  <input
                    ref={priceInputRef}
                    type="number"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    onBlur={handleSaveInline}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Descripción Local (Opcional)
                </label>
                <textarea
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  onBlur={handleSaveInline}
                  placeholder="Ej: Servido bien frío..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 focus:bg-white transition-all text-slate-700 resize-none"
                />
              </div>

              {/* Save Button & Feedback Status */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 font-medium">
                  {isSaving ? "Guardando..." : justSaved ? "¡Guardado!" : "Cambios se guardan al salir"}
                </span>
                <button
                  onClick={handleSaveInline}
                  disabled={isSaving}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                    justSaved 
                      ? "bg-green-500/10 text-green-600" 
                      : "bg-fowy-secondary text-white hover:opacity-90"
                  }`}
                >
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : justSaved ? (
                    <>
                      <CheckCircle2 size={12} />
                      Listo
                    </>
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de confirmación Premium para eliminación del Menú */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: { type: "spring", damping: 25, stiffness: 300 } 
              }}
              exit={{ 
                scale: 0.9, 
                opacity: 0, 
                y: 20,
                transition: { duration: 0.2 } 
              }}
              className="relative w-full max-w-sm bg-white rounded-fowy shadow-premium overflow-hidden border border-white/50 z-10"
            >
              <div className="p-6 pb-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4 relative">
                  <div className="absolute inset-0 bg-red-500/10 rounded-2xl animate-ping" />
                  <AlertTriangle size={24} className="relative z-10" />
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  ¿Quitar de tu menú?
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed px-2">
                  ¿Estás seguro de que deseas eliminar &ldquo;{gp.name}&rdquo; de tu menú digital?
                </p>
              </div>

              <div className="p-4 pt-2 flex gap-3">
                <button 
                  onClick={() => setIsConfirmOpen(false)}
                  className="flex-1 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-100 active:scale-95 cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
