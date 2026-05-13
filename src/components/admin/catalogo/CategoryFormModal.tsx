"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Upload, Check, AlertCircle, RefreshCw } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { storageService } from "@/services/storageService";
import { GlobalCategory } from "@/types/catalogo";

interface CategoryFormModalProps {
  isOpen: boolean;
  category: GlobalCategory | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryFormModal({
  isOpen,
  category,
  onClose,
  onSuccess,
}: CategoryFormModalProps) {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setName(category?.name || "");
      setIsActive(category ? category.is_active : true);
      setImagePreview(category?.image_url || null);
      setImageFile(null);
    }
  }, [isOpen, category]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      let uploadedUrl = category?.image_url || null;

      if (imageFile) {
        uploadedUrl = await storageService.uploadFile(imageFile, "categories", {
          shouldCompress: true,
          maxWidth: 500,
          quality: 0.8,
        });
      }

      const categoryData = {
        name: name.trim(),
        image_url: uploadedUrl,
        is_active: isActive,
      };

      if (category) {
        const { error: updateError } = await supabase
          .from("global_categories")
          .update(categoryData)
          .eq("id", category.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("global_categories")
          .insert([categoryData]);

        if (insertError) {
          throw insertError.code === "23505"
            ? new Error("Ya existe una categoría con este nombre.")
            : insertError;
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error saving category:", err);
      setError(err.message || "Error al guardar la categoría.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                  {category ? "Editar Categoría Global" : "Nueva Categoría Global"}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Las imágenes se recortarán automáticamente como círculos perfectos.
                </p>
              </div>
              <button
                onClick={() => !saving && onClose()}
                disabled={saving}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 flex-1 space-y-6">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Nombre de la Categoría
                </label>
                <input
                  type="text" required disabled={saving} value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Coca-Cola, Cervezas, Bebidas Sin Gas..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fowy-red/10 focus:border-fowy-red transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Logotipo / Imagen Oficial (Circular)
                </label>

                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full border-2 border-slate-200 bg-slate-50 shadow-inner flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Previsualización" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-slate-300" size={32} />
                    )}
                    
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white cursor-pointer">
                      <Upload size={18} />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={saving} />
                    </label>
                  </div>

                  <div className="space-y-2 flex-1">
                    <p className="text-xs font-medium text-slate-500">
                      Sube una imagen con fondo transparente o contrastado. Formatos: PNG, JPG o WebP.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 select-none">
                      <Upload size={14} />
                      Seleccionar Archivo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={saving} />
                    </label>
                    {imageFile && (
                      <p className="text-[10px] font-bold text-green-600 flex items-center gap-1 mt-1">
                        <Check size={12} />
                        Archivo seleccionado: {imageFile.name} (Compresión activa)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Estado de Activación
                  </label>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    Las categorías inactivas no se mostrarán a los comercios ni a los clientes.
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

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button" onClick={() => onClose()} disabled={saving}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit" disabled={saving}
                  className="px-6 py-3 bg-fowy-primary text-white rounded-xl text-sm font-bold shadow-[0_4px_12px_rgba(255,90,95,0.25)] flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Categoría"
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
