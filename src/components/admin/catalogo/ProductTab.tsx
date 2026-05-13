"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, RefreshCw, Sparkles, Layers, Tag, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { storageService } from "@/services/storageService";
import { GlobalCategory, GlobalProduct } from "@/types/catalogo";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import SuccessToast from "@/components/admin/shared/SuccessToast";
import ProductFormModal from "@/components/admin/catalogo/ProductFormModal";

export default function ProductTab() {
  const supabase = createClient();
  const [products, setProducts] = useState<GlobalProduct[]>([]);
  const [categories, setCategories] = useState<GlobalCategory[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<GlobalProduct | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data, error } = await supabase.from("global_products").select("*, global_categories(id, name)").order("name");
      if (error) throw error;
      setProducts(data || []);
    } catch {
      setProductError("No se pudieron cargar los productos globales.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("global_categories").select("*").order("name");
    if (data) setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((prod) => {
    const term = productSearchTerm.toLowerCase();
    const matchesSearch = prod.name.toLowerCase().includes(term) || (prod.description && prod.description.toLowerCase().includes(term));
    return matchesSearch && (selectedCategoryFilter === "all" || prod.global_category_id === selectedCategoryFilter);
  });

  const handleOpenProductModal = (product: GlobalProduct | null = null) => {
    setProductError(null);
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleToggleProductActive = async (product: GlobalProduct) => {
    try {
      const nextActive = !product.is_active;
      const { error } = await supabase.from("global_products").update({ is_active: nextActive }).eq("id", product.id);
      if (error) throw error;
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_active: nextActive } : p));
      setToast({ show: true, message: `Producto "${product.name}" ${nextActive ? "activado" : "desactivado"}` });
    } catch {
      setToast({ show: true, message: "Error al actualizar estado del producto" });
    }
  };

  const handleDeleteProduct = async (product: GlobalProduct) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${product.name}" del catálogo?`)) return;
    try {
      setLoadingProducts(true);
      const { error } = await supabase.from("global_products").delete().eq("id", product.id);
      if (error) {
        throw new Error(error.code === "23503" ? "No se puede eliminar porque está asociado a comercios." : error.message);
      }
      if (product.image_url) await storageService.deleteFileByUrl(product.image_url, "products");
      setToast({ show: true, message: "Producto eliminado con éxito" });
      fetchProducts();
    } catch (err: any) {
      alert(err.message || "Ocurrió un error al intentar eliminar el producto.");
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Top Panel Filters */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center mb-8">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar gaseosa o licor maestro..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-fowy-red/20 focus:border-fowy-red transition-all"
            />
          </div>

          <div className="relative min-w-[200px]">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-fowy-red/20 focus:border-fowy-red appearance-none font-bold cursor-pointer transition-all"
            >
              <option value="all">Todas las Categorías</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <Layers className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenProductModal()}
          disabled={categories.length === 0}
          className={`w-full xl:w-auto px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            categories.length === 0 ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-fowy-primary text-white shadow-md hover:shadow-lg"
          }`}
        >
          <Plus size={18} /> Nuevo Producto Global
        </motion.button>
      </div>

      {categories.length === 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-2xl text-sm font-bold flex items-center gap-3">
          <AlertCircle size={20} /> Debes crear al menos una Categoría Global activa antes de registrar productos.
        </div>
      )}

      {productError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3">
          <AlertCircle size={20} /> {productError}
        </div>
      )}

      {loadingProducts ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="animate-spin text-fowy-red mb-4" size={36} />
          <p className="text-slate-400 font-bold">Cargando productos maestros...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-fowy p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <Sparkles size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold text-lg mb-2">No se encontraron productos globales</p>
          <p className="text-slate-400 text-sm max-w-md">Registra gaseosas o licores maestros que los negocios socios podrán clonar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-fowy p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col"
            >
              <span
                onClick={() => handleToggleProductActive(product)}
                className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all z-10 ${
                  product.is_active ? "bg-green-50 text-green-600 border border-green-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}
              >
                {product.is_active ? "Habilitado" : "Deshabilitado"}
              </span>

              <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 relative bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <PremiumImage src={product.image_url || ""} alt={product.name} className="w-full h-full object-contain p-2" fallbackType="generic" />
              </div>

              <div className="flex items-center gap-1.5 mb-2 shrink-0">
                <span className="p-1 bg-slate-100 text-slate-500 rounded-lg"><Layers size={12} /></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
                  {product.global_categories?.name || "Sin Categoría"}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-800 leading-snug mb-1 truncate">{product.name}</h3>
              <p className="text-slate-400 text-xs font-medium line-clamp-2 min-h-[32px] mb-4">{product.description || "Sin descripción."}</p>

              {product.category_default && (
                <div className="mt-auto mb-4 p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center gap-1.5 shrink-0">
                  <Tag size={12} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 truncate">
                    Menú local: <span className="font-extrabold text-slate-600">{product.category_default}</span>
                  </span>
                </div>
              )}

              <div className="flex gap-2 mt-auto pt-3 border-t border-slate-50">
                <button
                  onClick={() => handleOpenProductModal(product)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-fowy-primary/5 hover:text-fowy-red text-slate-500 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Edit2 size={12} /> Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(product)}
                  className="px-3 py-2 bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl transition-all flex items-center justify-center"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ProductFormModal
        isOpen={isProductModalOpen} product={editingProduct} categories={categories}
        onClose={() => setIsProductModalOpen(false)} onSuccess={() => { setIsProductModalOpen(false); fetchProducts(); }}
      />

      <SuccessToast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
    </motion.div>
  );
}
