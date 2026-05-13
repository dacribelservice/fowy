"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Upload, Check, AlertCircle, RefreshCw, Layers, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { storageService } from "@/services/storageService";
import { GlobalCategory, GlobalProduct } from "@/types/catalogo";

interface ProductFormModalProps {
  isOpen: boolean;
  product: GlobalProduct | null;
  categories: GlobalCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductFormModal({
  isOpen,
  product,
  categories,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryDefault, setCategoryDefault] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setName(product?.name || "");
      setDescription(product?.description || "");
      
      const initialCatId = product?.global_category_id || categories[0]?.id || "";
      setCategoryId(initialCatId);
      
      const selectedCat = categories.find((c) => c.id === initialCatId);
      setCategoryDefault(product?.category_default || selectedCat?.name || "");
      
      setImagePreview(product?.image_url || null);
      setImageFile(null);
      setIsActive(product ? product.is_active : true);
    }
  }, [isOpen, product, categories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId);
    const selectedCat = categories.find((c) => c.id === catId);
    if (selectedCat) {
      setCategoryDefault(selectedCat.name);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre del producto es obligatorio.");
      return;
    }
    if (!categoryId) {
      setError("Debes seleccionar una categoría global.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      let uploadedUrl = product?.image_url || null;

      if (imageFile) {
        uploadedUrl = await storageService.uploadFile(imageFile, "products", {
          shouldCompress: true,
          maxWidth: 600,
          quality: 0.8,
        });
      }

      let finalCategoryDefault = categoryDefault.trim();
      if (!finalCategoryDefault) {
        const selectedCat = categories.find((c) => c.id === categoryId);
        if (selectedCat) {
          finalCategoryDefault = selectedCat.name;
        }
      }

      const productData = {
        name: name.trim(),
        description: description.trim() || null,
        image_url: uploadedUrl,
        global_category_id: categoryId,
        category_default: finalCategoryDefault || null,
        is_active: isActive,
      };

      if (product) {
        const { error: updateError } = await supabase
          .from("global_products")
          .update(productData)
          .eq("id", product.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("global_products")
          .insert([productData]);

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error saving global product:", err);
      setError(err.message || "Error al guardar el producto global.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !saving && onClose()}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-lg rounded-fowy overflow-hidden shadow-2xl relative z-10 border border-white/20 flex flex-col"
          >
            <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  {product ? "Editar Producto Global" : "Nuevo Producto Global"}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Diseña bebidas de alta fidelidad que se distribuirán en los comercios.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !saving && onClose()}
                disabled={saving}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 flex-1 space-y-5 overflow-y-auto max-h-[75vh]">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Nombre de la Gaseosa / Licor
                </label>
                <input
                  type="text"
                  required
                  disabled={saving}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Coca-Cola Sabor Original 350ml, Cerveza Corona Extra..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fowy-red/10 focus:border-fowy-red transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Descripción (Opcional)
                </label>
                <textarea
                  disabled={saving}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el producto o agrega información sobre su presentación..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fowy-red/10 focus:border-fowy-red transition-all resize-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Categoría Circular Global
                </label>
                <div className="relative">
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    disabled={saving}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-fowy-red/10 focus:border-fowy-red appearance-none font-bold cursor-pointer transition-all"
                  >
                    <option value="" disabled>Selecciona una categoría circular</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Layers size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                    Categoría por Defecto en Comercio Local
                  </label>
                  <span className="text-[10px] bg-slate-100 text-slate-400 px-2.5 py-1 rounded-lg font-bold border border-slate-200 flex items-center gap-1 uppercase tracking-wider">
                    <Lock size={10} /> Sincronizado
                  </span>
                </div>
                <input
                  type="text"
                  disabled={true}
                  value={categoryDefault}
                  onChange={(e) => setCategoryDefault(e.target.value)}
                  placeholder="Se autocompleta con la categoría circular global"
                  className="w-full px-4 py-3 bg-slate-100/60 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed font-medium focus:outline-none transition-all"
                />
                <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                  💡 Se creará automáticamente esta categoría en el menú de los negocios con el mismo nombre de la Categoría Circular Global.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Imagen del Producto (Fondo Transparente Recomendado)
                </label>

                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl border-2 border-slate-200 bg-slate-50 shadow-inner flex items-center justify-center overflow-hidden shrink-0 relative group p-2">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Previsualización de producto"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="text-slate-300" size={32} />
                    )}
                    
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white cursor-pointer rounded-2xl">
                      <Upload size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={saving}
                      />
                    </label>
                  </div>

                  <div className="space-y-2 flex-1">
                    <p className="text-xs font-medium text-slate-500">
                      Preferiblemente sube imágenes recortadas en PNG con fondo transparente. Formatos admitidos: PNG, JPG, WebP.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 select-none">
                      <Upload size={14} />
                      Seleccionar Imagen
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={saving}
                      />
                    </label>
                    {imageFile && (
                      <p className="text-[10px] font-bold text-green-600 flex items-center gap-1 mt-1">
                        <Check size={12} />
                        {imageFile.name} (Compresión activa)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Disponibilidad en Catálogo Global
                  </label>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    Los productos deshabilitados no se podrán clonar ni ver por los negocios socios.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isActive ? "bg-fowy-primary" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => onClose()}
                  disabled={saving}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-fowy-primary text-white rounded-xl text-sm font-bold shadow-[0_4px_12px_rgba(255,90,95,0.25)] flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Producto"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
