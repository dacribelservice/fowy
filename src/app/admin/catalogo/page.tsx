"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Edit2, Trash2, Image as ImageIcon, 
  Upload, X, RefreshCw, Layers, Sparkles, Check, AlertCircle, Tag
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { storageService } from "@/services/storageService";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import SuccessToast from "@/components/admin/shared/SuccessToast";

interface GlobalCategory {
  id: string;
  name: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

interface GlobalProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  global_category_id: string | null;
  category_default: string | null;
  is_active: boolean;
  created_at: string;
  global_categories?: {
    id: string;
    name: string;
  } | null;
}

export default function CatalogoFowyPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"categories" | "products">("categories");
  const [categories, setCategories] = useState<GlobalCategory[]>([]);
  const [products, setProducts] = useState<GlobalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  
  // Category Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GlobalCategory | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<GlobalProduct | null>(null);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productCategoryDefault, setProductCategoryDefault] = useState("");
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [productIsActive, setProductIsActive] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);

  // Notifications State
  const [toast, setToast] = useState({ show: false, message: "" });
  const [error, setError] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
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

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data, error: fetchError } = await supabase
        .from("global_products")
        .select("*, global_categories(id, name)")
        .order("name", { ascending: true });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err: any) {
      console.error("Error fetching global products:", err);
      setProductError("No se pudieron cargar los productos globales.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Filter Categories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter Products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(productSearchTerm.toLowerCase()) || 
      (prod.description && prod.description.toLowerCase().includes(productSearchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategoryFilter === "all" || prod.global_category_id === selectedCategoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Handle open category modal
  const handleOpenModal = (category: GlobalCategory | null = null) => {
    setError(null);
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setIsActive(category.is_active);
      setImagePreview(category.image_url);
      setImageFile(null);
    } else {
      setEditingCategory(null);
      setName("");
      setIsActive(true);
      setImagePreview(null);
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  // Handle open product modal
  const handleOpenProductModal = (product: GlobalProduct | null = null) => {
    setProductError(null);
    if (product) {
      setEditingProduct(product);
      setProductName(product.name);
      setProductDescription(product.description || "");
      setProductCategoryId(product.global_category_id || "");
      setProductCategoryDefault(product.category_default || "");
      setProductImagePreview(product.image_url);
      setProductImageFile(null);
      setProductIsActive(product.is_active);
    } else {
      setEditingProduct(null);
      setProductName("");
      setProductDescription("");
      setProductCategoryId(categories[0]?.id || "");
      setProductCategoryDefault("");
      setProductImagePreview(null);
      setProductImageFile(null);
      setProductIsActive(true);
    }
    setIsProductModalOpen(true);
  };

  // Image Selection with preview for Categories
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

  // Image Selection with preview for Products
  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Category change within the product modal
  const handleProductCategoryChange = (catId: string) => {
    setProductCategoryId(catId);
    // Auto-prefill the default local category folder with the circular global category name
    const selectedCat = categories.find(c => c.id === catId);
    if (selectedCat) {
      setProductCategoryDefault(selectedCat.name);
    }
  };

  // Save Category (Insert or Update)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      let uploadedUrl = editingCategory?.image_url || null;

      // Upload image with compressImage under the hood (storageService)
      if (imageFile) {
        uploadedUrl = await storageService.uploadFile(imageFile, "categories", {
          shouldCompress: true,
          maxWidth: 500, // Circular category images can be perfectly high quality at 500px width
          quality: 0.8,
        });
      }

      const categoryData = {
        name: name.trim(),
        image_url: uploadedUrl,
        is_active: isActive,
      };

      if (editingCategory) {
        // Update
        const { error: updateError } = await supabase
          .from("global_categories")
          .update(categoryData)
          .eq("id", editingCategory.id);

        if (updateError) throw updateError;
        setToast({ show: true, message: "Categoría actualizada con éxito" });
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from("global_categories")
          .insert([categoryData]);

        if (insertError) {
          if (insertError.code === "23505") {
            throw new Error("Ya existe una categoría con este nombre.");
          }
          throw insertError;
        }
        setToast({ show: true, message: "Categoría creada con éxito" });
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error("Error saving category:", err);
      setError(err.message || "Error al guardar la categoría.");
    } finally {
      setSaving(false);
    }
  };

  // Save Product (Insert or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setProductError("El nombre del producto es obligatorio.");
      return;
    }
    if (!productCategoryId) {
      setProductError("Debes seleccionar una categoría global.");
      return;
    }

    try {
      setSavingProduct(true);
      setProductError(null);
      let uploadedUrl = editingProduct?.image_url || null;

      if (productImageFile) {
        uploadedUrl = await storageService.uploadFile(productImageFile, "products", {
          shouldCompress: true,
          maxWidth: 600, // Products are beautifully sharp at 600px
          quality: 0.8,
        });
      }

      // If category_default is empty, prefill it with the category name
      let finalCategoryDefault = productCategoryDefault.trim();
      if (!finalCategoryDefault) {
        const selectedCat = categories.find(c => c.id === productCategoryId);
        if (selectedCat) {
          finalCategoryDefault = selectedCat.name;
        }
      }

      const productData = {
        name: productName.trim(),
        description: productDescription.trim() || null,
        image_url: uploadedUrl,
        global_category_id: productCategoryId,
        category_default: finalCategoryDefault || null,
        is_active: productIsActive,
      };

      if (editingProduct) {
        // Update
        const { error: updateError } = await supabase
          .from("global_products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (updateError) throw updateError;
        setToast({ show: true, message: "Producto global actualizado con éxito" });
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from("global_products")
          .insert([productData]);

        if (insertError) throw insertError;
        setToast({ show: true, message: "Producto global creado con éxito" });
      }

      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error("Error saving global product:", err);
      setProductError(err.message || "Error al guardar el producto global.");
    } finally {
      setSavingProduct(false);
    }
  };

  // Toggle Category Active State directly from grid
  const handleToggleActive = async (category: GlobalCategory) => {
    try {
      const nextActive = !category.is_active;
      const { error: updateError } = await supabase
        .from("global_categories")
        .update({ is_active: nextActive })
        .eq("id", category.id);

      if (updateError) throw updateError;

      // Update local state instantly
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

  // Toggle Product Active State directly from grid
  const handleToggleProductActive = async (product: GlobalProduct) => {
    try {
      const nextActive = !product.is_active;
      const { error: updateError } = await supabase
        .from("global_products")
        .update({ is_active: nextActive })
        .eq("id", product.id);

      if (updateError) throw updateError;

      // Update local state instantly
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: nextActive } : p))
      );

      setToast({
        show: true,
        message: nextActive
          ? `Producto "${product.name}" activado`
          : `Producto "${product.name}" desactivado`,
      });
    } catch (err: any) {
      console.error("Error toggling product active state:", err);
      setToast({ show: true, message: "Error al actualizar estado del producto" });
    }
  };

  // Delete Category
  const handleDeleteCategory = async (category: GlobalCategory) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${category.name}"? Se impedirá si hay productos asociados.`)) {
      return;
    }

    try {
      setLoading(true);
      
      // Delete Category from db
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

      // Delete file from Storage if exists
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

  // Delete Product
  const handleDeleteProduct = async (product: GlobalProduct) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${product.name}" del catálogo global? Se impedirá si ya está asociado a algún negocio.`)) {
      return;
    }

    try {
      setLoadingProducts(true);
      
      const { error: deleteError } = await supabase
        .from("global_products")
        .delete()
        .eq("id", product.id);

      if (deleteError) {
        if (deleteError.code === "23503") {
          throw new Error("No se puede eliminar porque está asociado a productos de comercios existentes.");
        }
        throw deleteError;
      }

      if (product.image_url) {
        await storageService.deleteFileByUrl(product.image_url, "products");
      }

      setToast({ show: true, message: "Producto eliminado con éxito" });
      fetchProducts();
    } catch (err: any) {
      console.error("Error deleting global product:", err);
      alert(err.message || "Ocurrió un error al intentar eliminar el producto.");
    } finally {
      setLoadingProducts(false);
    }
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

      {/* RENDER TAB 1: CATEGORIES (Step 5.5) */}
      {activeTab === "categories" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
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
              onClick={() => handleOpenModal()}
              className="w-full sm:w-auto px-6 py-3 bg-fowy-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,90,95,0.25)] hover:shadow-[0_4px_25px_rgba(255,90,95,0.4)] transition-all duration-300"
            >
              <Plus size={18} />
              Nueva Categoría Global
            </motion.button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

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
                      onClick={() => handleOpenModal(category)}
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
        </motion.div>
      )}

      {/* RENDER TAB 2: PRODUCTS (Step 5.6 Creador de Productos Globales) */}
      {activeTab === "products" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top Panel Filters */}
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center mb-8">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Product Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar gaseosa o licor maestro..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fowy-red/20 focus:border-fowy-red transition-all"
                />
              </div>

              {/* Category Filter dropdown */}
              <div className="relative min-w-[200px]">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-fowy-red/20 focus:border-fowy-red appearance-none font-bold cursor-pointer transition-all"
                >
                  <option value="all">Todas las Categorías</option>
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenProductModal()}
              disabled={categories.length === 0}
              className={`w-full xl:w-auto px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                categories.length === 0
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-fowy-primary text-white shadow-[0_4px_15px_rgba(255,90,95,0.25)] hover:shadow-[0_4px_25px_rgba(255,90,95,0.4)]"
              }`}
            >
              <Plus size={18} />
              Nuevo Producto Global
            </motion.button>
          </div>

          {/* Feedback Info if no categories exist */}
          {categories.length === 0 && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-2xl text-sm font-bold flex items-center gap-3">
              <AlertCircle size={20} />
              Debes crear al menos una Categoría Global activa antes de registrar productos globales.
            </div>
          )}

          {/* Product Error Alert */}
          {productError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3">
              <AlertCircle size={20} />
              {productError}
            </div>
          )}

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="animate-spin text-fowy-red mb-4" size={36} />
              <p className="text-slate-400 font-bold">Cargando productos maestros...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-fowy p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
              <Sparkles size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold text-lg mb-2">No se encontraron productos globales</p>
              <p className="text-slate-400 text-sm max-w-md">
                Registra gaseosas o licores maestros que los negocios socios podrán clonar y habilitar en sus locales instantáneamente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white rounded-fowy p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col"
                >
                  {/* Status Badge Toggle */}
                  <span
                    onClick={() => handleToggleProductActive(product)}
                    className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer select-none transition-all z-10 ${
                      product.is_active
                        ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                        : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {product.is_active ? "Habilitado" : "Deshabilitado"}
                  </span>

                  {/* Product Image Wrapper */}
                  <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 relative bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <PremiumImage
                      src={product.image_url || ""}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                      fallbackType="generic"
                    />
                  </div>

                  {/* Circular Category Badge */}
                  <div className="flex items-center gap-1.5 mb-2 shrink-0">
                    <span className="p-1 bg-slate-100 text-slate-500 rounded-lg">
                      <Layers size={12} />
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
                      {product.global_categories?.name || "Sin Categoría"}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-base font-black text-slate-800 leading-snug mb-1 truncate">
                    {product.name}
                  </h3>

                  {/* Product Description */}
                  <p className="text-slate-400 text-xs font-medium line-clamp-2 min-h-[32px] mb-4">
                    {product.description || "Sin descripción detallada."}
                  </p>

                  {/* Local Default Folder Badge */}
                  {product.category_default && (
                    <div className="mt-auto mb-4 p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center gap-1.5 shrink-0">
                      <Tag size={12} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 truncate">
                        Menú local: <span className="font-extrabold text-slate-600">{product.category_default}</span>
                      </span>
                    </div>
                  )}

                  {/* Action Footer */}
                  <div className="flex gap-2 mt-auto pt-3 border-t border-slate-50">
                    <button
                      onClick={() => handleOpenProductModal(product)}
                      className="flex-1 py-2 bg-slate-50 hover:bg-fowy-primary/5 hover:text-fowy-red text-slate-500 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Edit2 size={12} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="px-3 py-2 bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl transition-all flex items-center justify-center active:scale-95"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* MODAL: CATEGORY CREATION & EDIT (Ethereal Glassmorphic Modal) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-fowy overflow-hidden shadow-2xl relative z-10 border border-white/20 flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-800">
                    {editingCategory ? "Editar Categoría Global" : "Nueva Categoría Global"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Las imágenes se recortarán automáticamente como círculos perfectos.
                  </p>
                </div>
                <button
                  onClick={() => !saving && setIsModalOpen(false)}
                  disabled={saving}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveCategory} className="p-6 flex-1 space-y-6">
                
                {/* Form Error */}
                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {/* Name Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                    Nombre de la Categoría
                  </label>
                  <input
                    type="text"
                    required
                    disabled={saving}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Coca-Cola, Cervezas, Bebidas Sin Gas..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fowy-red/10 focus:border-fowy-red transition-all"
                  />
                </div>

                {/* Circular Image Upload */}
                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                    Logotipo / Imagen Oficial (Circular)
                  </label>

                  <div className="flex items-center gap-6">
                    {/* Circle Preview */}
                    <div className="w-24 h-24 rounded-full border-2 border-slate-200 bg-slate-50 shadow-inner flex items-center justify-center overflow-hidden shrink-0 relative group">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Previsualización"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-slate-300" size={32} />
                      )}
                      
                      {/* Overlay to upload */}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white cursor-pointer">
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

                    {/* Upload button & details */}
                    <div className="space-y-2 flex-1">
                      <p className="text-xs font-medium text-slate-500">
                        Sube una imagen con fondo transparente o contrastado. Formatos admitidos: PNG, JPG o WebP.
                      </p>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 select-none">
                        <Upload size={14} />
                        Seleccionar Archivo
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
                          Archivo seleccionado: {imageFile.name} (Compresión activa)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Toggle Active Status */}
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

                {/* Action Footer */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
                      "Guardar Categoría"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: PRODUCT CREATION & EDIT (Ethereal Glassmorphic Modal) */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !savingProduct && setIsProductModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-fowy overflow-hidden shadow-2xl relative z-10 border border-white/20 flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-800">
                    {editingProduct ? "Editar Producto Global" : "Nuevo Producto Global"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Diseña bebidas de alta fidelidad que se distribuirán en los comercios.
                  </p>
                </div>
                <button
                  onClick={() => !savingProduct && setIsProductModalOpen(false)}
                  disabled={savingProduct}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveProduct} className="p-6 flex-1 space-y-5 overflow-y-auto max-h-[75vh]">
                
                {/* Form Error */}
                {productError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} />
                    {productError}
                  </div>
                )}

                {/* Name Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                    Nombre de la Gaseosa / Licor
                  </label>
                  <input
                    type="text"
                    required
                    disabled={savingProduct}
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ej. Coca-Cola Sabor Original 350ml, Cerveza Corona Extra..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fowy-red/10 focus:border-fowy-red transition-all"
                  />
                </div>

                {/* Description Textarea */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    disabled={savingProduct}
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Describe el producto o agrega información sobre su presentación..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fowy-red/10 focus:border-fowy-red transition-all resize-none text-sm"
                  />
                </div>

                {/* Global Category Selector dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                    Categoría Circular Global
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={productCategoryId}
                      onChange={(e) => handleProductCategoryChange(e.target.value)}
                      disabled={savingProduct}
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

                {/* Local Default Folder category_default */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                      Categoría por Defecto en Comercio Local
                    </label>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">Autocompletado</span>
                  </div>
                  <input
                    type="text"
                    disabled={savingProduct}
                    value={productCategoryDefault}
                    onChange={(e) => setProductCategoryDefault(e.target.value)}
                    placeholder="Ej. Gaseosas, Cervezas Importadas, Licores..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fowy-red/10 focus:border-fowy-red transition-all"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">
                    Es la categoría del menú local donde se colocará este producto cuando un comercio lo agregue. Si se deja en blanco, usará el nombre de la categoría circular global.
                  </p>
                </div>

                {/* Product Image Upload */}
                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                    Imagen del Producto (Fondo Transparente Recomendado)
                  </label>

                  <div className="flex items-center gap-6">
                    {/* Preview Box */}
                    <div className="w-24 h-24 rounded-2xl border-2 border-slate-200 bg-slate-50 shadow-inner flex items-center justify-center overflow-hidden shrink-0 relative group p-2">
                      {productImagePreview ? (
                        <img
                          src={productImagePreview}
                          alt="Previsualización de producto"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="text-slate-300" size={32} />
                      )}
                      
                      {/* Overlay to upload */}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white cursor-pointer rounded-2xl">
                        <Upload size={18} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductImageChange}
                          className="hidden"
                          disabled={savingProduct}
                        />
                      </label>
                    </div>

                    {/* Upload button & details */}
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
                          onChange={handleProductImageChange}
                          className="hidden"
                          disabled={savingProduct}
                        />
                      </label>
                      {productImageFile && (
                        <p className="text-[10px] font-bold text-green-600 flex items-center gap-1 mt-1">
                          <Check size={12} />
                          {productImageFile.name} (Compresión activa)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Activation Status */}
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
                    onClick={() => setProductIsActive(!productIsActive)}
                    disabled={savingProduct}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      productIsActive ? "bg-fowy-primary" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        productIsActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Action Footer */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    disabled={savingProduct}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="px-6 py-3 bg-fowy-primary text-white rounded-xl text-sm font-bold shadow-[0_4px_12px_rgba(255,90,95,0.25)] flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    {savingProduct ? (
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

      {/* Success Toast Notification */}
      <SuccessToast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
