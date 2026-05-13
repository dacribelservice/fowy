"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, RefreshCw, Layers, Edit2, Trash2, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { storageService } from "@/services/storageService";
import { GlobalCategory } from "@/types/catalogo";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import SuccessToast from "@/components/admin/shared/SuccessToast";

interface CategoryTabProps {
  onOpenModal: (category?: GlobalCategory | null) => void;
}

export default function CategoryTab({ onOpenModal }: CategoryTabProps) {
  const supabase = createClient();
  const [categories, setCategories] = useState<GlobalCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("global_categories")
        .select("*")
        .order("name", { ascending: true });

      if (fetchError) throw fetchError;
      setCategories(data || []);
    } catch (err: any) {
      console.error("Error fetching global categories:", err);
      setError("No se pudieron cargar las categorías globales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleActive = async (category: GlobalCategory) => {
    try {
      const nextActive = !category.is_active;
      const { error: updateError } = await supabase
        .from("global_categories")
        .update({ is_active: nextActive })
        .eq("id", category.id);

      if (updateError) throw updateError;

      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, is_active: nextActive } : c))
      );

      setToast({
        show: true,
        message: nextActive
          ? `Categoría "${category.name}" activada`
          : `Categoría "${category.name}" desactivada`,
      });
    } catch (err: any) {
      console.error("Error toggling active state:", err);
      setToast({ show: true, message: "Error al actualizar estado" });
    }
  };

  const handleDeleteCategory = async (category: GlobalCategory) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${category.name}"? Se impedirá si hay productos asociados.`)) {
      return;
    }

    try {
      setLoading(true);
      
      const { error: deleteError } = await supabase
        .from("global_categories")
        .delete()
        .eq("id", category.id);

      if (deleteError) {
        if (deleteError.code === "23503") {
          throw new Error("No se puede eliminar porque tiene productos globales asociados.");
        }
        throw deleteError;
      }

      if (category.image_url) {
        await storageService.deleteFileByUrl(category.image_url, "categories");
      }

      setToast({ show: true, message: "Categoría eliminada con éxito" });
      fetchCategories();
    } catch (err: any) {
      console.error("Error deleting category:", err);
      alert(err.message || "Ocurrió un error al intentar eliminar la categoría.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Search Bar & Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fowy-red/20 focus:border-fowy-red transition-all"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpenModal(null)}
          className="w-full sm:w-auto px-6 py-3 bg-fowy-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,90,95,0.25)] hover:shadow-[0_4px_25px_rgba(255,90,95,0.4)] transition-all duration-300"
        >
          <Plus size={18} />
          Nueva Categoría Global
        </motion.button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="animate-spin text-fowy-red mb-4" size={36} />
          <p className="text-slate-400 font-bold">Cargando categorías globales...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-fowy p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <Layers size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold text-lg mb-2">No se encontraron categorías</p>
          <p className="text-slate-400 text-sm">
            Crea una nueva categoría global para que los comercios puedan clasificar sus productos circulares.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-fowy p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col items-center text-center"
            >
              {/* Status Badge */}
              <span
                onClick={() => handleToggleActive(category)}
                className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer select-none transition-all ${
                  category.is_active
                    ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                    : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                }`}
              >
                {category.is_active ? "Activa" : "Inactiva"}
              </span>

              {/* Circular Image Container */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-inner mb-4 mt-2 flex items-center justify-center relative bg-slate-50 p-1 group-hover:border-fowy-red/30 transition-colors">
                <PremiumImage
                  src={category.image_url || ""}
                  alt={category.name}
                  className="w-full h-full rounded-full object-cover"
                  fallbackType="category"
                />
              </div>

              {/* Category Name */}
              <h3 className="text-sm font-black text-slate-800 leading-tight mb-4 min-h-[40px] flex items-center justify-center px-1">
                {category.name}
              </h3>

              {/* Action Buttons Overlay / Footer */}
              <div className="flex gap-2 w-full mt-auto pt-3 border-t border-slate-50">
                <button
                  onClick={() => onOpenModal(category)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-fowy-primary/5 hover:text-fowy-red text-slate-500 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Edit2 size={12} />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="px-3 py-2 bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl transition-all flex items-center justify-center active:scale-95"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Success Toast Notification */}
      <SuccessToast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
