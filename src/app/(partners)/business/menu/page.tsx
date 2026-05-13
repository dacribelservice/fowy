"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Utensils,
  Image as ImageIcon,
  Tag,
  AlertCircle,
  CheckCircle2,
  Layers,
  Pencil,
  Trash2,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductManager, type Product } from "@/hooks/useProductManager";
import { useCategoryManager, type MenuCategory } from "@/hooks/useCategoryManager";
import MenuCategoryManager from "@/components/partners/business/menu/MenuCategoryManager";
import ProductFormModal from "@/components/partners/business/menu/ProductFormModal";
import DeleteConfirmationModal from "@/components/partners/business/menu/DeleteConfirmationModal";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import GlobalProductSelector, { GlobalProduct } from "@/components/partners/business/menu/GlobalProductSelector";
import GlobalProductSaveModal from "@/components/partners/business/menu/GlobalProductSaveModal";
import { GlobalCategory } from "@/types/catalogo";
import { toast } from "sonner";

interface Business {
  id: string;
  name: string;
  tags: string[];
}

interface GlobalProductCardProps {
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

function GlobalProductCard({
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
      const confirm = window.confirm(`¿Estás seguro de que deseas eliminar "${gp.name}" de tu menú?`);
      if (confirm) {
        setIsSaving(true);
        const ok = await deleteProduct(activeProduct.id);
        setIsSaving(false);
        if (ok) {
          toast.success(`"${gp.name}" eliminado de tu menú.`);
        } else {
          toast.error(`Error al eliminar "${gp.name}".`);
        }
      }
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
    </motion.div>
  );
}

export default function MenuManagementPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loadingBiz, setLoadingBiz] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Global Products Catálogo States
  const [isGlobalSelectorOpen, setIsGlobalSelectorOpen] = useState(false);
  const [isGlobalSaveModalOpen, setIsGlobalSaveModalOpen] = useState(false);
  const [selectedGlobalProduct, setSelectedGlobalProduct] = useState<GlobalProduct | null>(null);
  const [globalCategories, setGlobalCategories] = useState<GlobalCategory[]>([]);
  const [selectedGlobalCategory, setSelectedGlobalCategory] = useState<string | null>(null);

  // Subpantalla de Selección de Productos (Step 5.8)
  const [selectedGlobalCat, setSelectedGlobalCat] = useState<GlobalCategory | null>(null);
  const [globalProductsInCat, setGlobalProductsInCat] = useState<any[]>([]);
  const [loadingGlobalProds, setLoadingGlobalProds] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  const handleSelectGlobalProduct = (product: GlobalProduct) => {
    setSelectedGlobalProduct(product);
    setIsGlobalSaveModalOpen(true);
  };

  // Cargar categorías globales del catálogo fowy
  useEffect(() => {
    const loadGlobalCategories = async () => {
      const { data } = await supabase
        .from("global_categories")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });
      if (data) setGlobalCategories(data);
    };
    loadGlobalCategories();
  }, [supabase]);

  // Cargar productos de la categoría global seleccionada (Step 5.8)
  useEffect(() => {
    const fetchGlobalProducts = async () => {
      if (!selectedGlobalCat) {
        setGlobalProductsInCat([]);
        return;
      }
      setLoadingGlobalProds(true);
      try {
        const { data, error } = await supabase
          .from("global_products")
          .select("*")
          .eq("global_category_id", selectedGlobalCat.id);
        
        if (error) {
          console.error("Error fetching global products:", error);
        } else if (data) {
          setGlobalProductsInCat(data);
        }
      } catch (err) {
        console.error("Error fetching global products:", err);
      } finally {
        setLoadingGlobalProds(false);
      }
    };

    fetchGlobalProducts();
  }, [selectedGlobalCat, supabase]);
  
  const {
    categories: localCategories,
    addCategory: addLocalCategory
  } = useCategoryManager(businessId);

  const { 
    products, 
    loading: loadingProds, 
    toggleStock,
    toggleOffer,
    deleteProduct,
    addProduct,
    updateProduct,
    refreshProducts 
  } = useProductManager(businessId);

  const activeGlobalProductIds = React.useMemo(() => {
    return new Set(
      products.filter(p => p.global_product_id).map(p => p.global_product_id)
    );
  }, [products]);

  const filteredGlobalProducts = React.useMemo(() => {
    if (!selectedGlobalCat) return [];
    return globalProductsInCat.filter(gp => 
      gp.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
      (gp.description && gp.description.toLowerCase().includes(globalSearchTerm.toLowerCase()))
    );
  }, [globalProductsInCat, globalSearchTerm, selectedGlobalCat]);

  // Carga inicial de datos del negocio
  useEffect(() => {
    const fetchBusinessData = async () => {
      setLoadingBiz(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoadingBiz(false);
        return;
      }

      const { data: bizData } = await supabase
        .from('businesses')
        .select('id, name, tags')
        .eq('owner_id', user.id)
        .single();

      if (bizData) {
        setBusinessId(bizData.id);
        setBusiness(bizData);
        setSelectedCategories(bizData.tags || []);
      }

      const { data: catData } = await supabase
        .from('categories')
        .select('name')
        .order('name', { ascending: true });
      
      if (catData) setDbCategories(catData.map(c => c.name));
      setLoadingBiz(false);
    };

    fetchBusinessData();
  }, [supabase]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const hasChanges = JSON.stringify([...selectedCategories].sort()) !== JSON.stringify([...(business?.tags || [])].sort());

  const handleSaveCategories = async () => {
    if (!businessId) return;
    setSaveStatus("saving");

    let categoryIdToSync = null;
    if (selectedCategories.length > 0) {
      const { data: catRecord } = await supabase
        .from('categories')
        .select('id')
        .eq('name', selectedCategories[0])
        .single();
      
      if (catRecord) categoryIdToSync = catRecord.id;
    }
    
    const { error } = await supabase
      .from('businesses')
      .update({ 
        tags: selectedCategories,
        category_id: categoryIdToSync 
      })
      .eq('id', businessId);

    if (error) {
      console.error("Error saving categories:", error);
      alert("Error al guardar las categorías.");
      setSaveStatus("idle");
    } else {
      setSaveStatus("saved");
      setBusiness(prev => prev ? { ...prev, tags: selectedCategories } : null);
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleToggleStock = async (id: string, currentStock: boolean) => {
    await toggleStock(id, currentStock);
  };

  const handleToggleOffer = async (id: string, currentOffer: boolean) => {
    await toggleOffer(id, currentOffer);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    setProductToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDeleteId) return;
    setIsDeleting(true);
    await deleteProduct(productToDeleteId);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setProductToDeleteId(null);
  };

  const handleAddNewProduct = () => {
    setProductToEdit(undefined);
    setIsProductModalOpen(true);
  };

  const loading = loadingBiz || loadingProds;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">No se especificó un negocio</h2>
        <p className="text-slate-500 mt-2 max-w-md">
          Para gestionar el menú, necesitas acceder a través de una URL de negocio válida.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence mode="wait">
        {selectedGlobalCat ? (
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
                  onClick={() => {
                    setSelectedGlobalCat(null);
                    setGlobalSearchTerm("");
                  }}
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
        ) : (
          <motion.div
            key="main-menu-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                    {business?.name || "Cargando..."}
                  </h2>
                  {saveStatus === "saving" && (
                    <span className="text-[10px] font-bold text-fowy-secondary animate-pulse uppercase tracking-widest bg-fowy-secondary/10 px-2 py-0.5 rounded-full">
                      Sincronizando...
                    </span>
                  )}
                  {saveStatus === "saved" && (
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} /> Actualizado
                    </span>
                  )}
                </div>
                <p className="text-slate-500">
                  Administra tus productos, precios y etiquetas en tiempo real.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCategoryManagerOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 glass-morphism text-slate-600 rounded-2xl font-bold border border-white/50 hover:bg-white transition-all"
                >
                  <Layers size={20} className="text-fowy-secondary" />
                  Categorias
                </button>
                <button 
                  type="button"
                  onClick={handleAddNewProduct}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-fowy-secondary text-white rounded-2xl font-bold shadow-premium hover:opacity-90 transition-all"
                >
                  <Plus size={20} />
                  Nuevo Producto
                </button>
              </div>
            </div>

            {/* Etiquetas del Negocio */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-morphism rounded-fowy p-6 relative overflow-hidden shadow-sm border border-white/50"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-fowy-secondary/10 to-[#4D8BFF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <Tag size={20} className="text-fowy-secondary" />
                    Etiquetas de tu Negocio
                  </h3>
                  <p className="text-sm text-slate-500">
                    Selecciona las categorías que describen tu negocio para que los clientes te encuentren.
                  </p>
                </div>

                <AnimatePresence>
                  {hasChanges && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={handleSaveCategories}
                      disabled={saveStatus === "saving"}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#7B61FF] to-[#4D8BFF] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7B61FF]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      {saveStatus === "saving" ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      Guardar Cambios
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex flex-wrap gap-3 relative z-10">
                {dbCategories.map((category) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCategory(category)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border border-transparent shadow-sm
                        ${isSelected 
                          ? 'bg-gradient-to-r from-[#7B61FF] to-[#4D8BFF] text-white shadow-md shadow-[#7B61FF]/30' 
                          : 'bg-white text-slate-600 hover:border-slate-200 hover:shadow-md hover:text-slate-800'
                        }
                      `}
                    >
                      {category}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Carrusel de Categorías Circulares del Catálogo Fowy */}
            {globalCategories.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-morphism rounded-fowy p-6 shadow-sm border border-white/50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7B61FF]/5 to-fowy-secondary/5 rounded-full blur-3xl pointer-events-none" />
                
                <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2 relative z-10">
                  <Sparkles size={20} className="text-fowy-secondary animate-pulse" />
                  Catálogo Fowy
                </h3>
                <p className="text-sm text-slate-500 mb-6 relative z-10">
                  Selecciona una categoría para agregar productos predefinidos a tu catálogo.
                </p>

                <div className="flex gap-6 overflow-x-auto pb-4 pt-1 px-1 -mx-1 no-scrollbar scroll-smooth relative z-10">
                  {globalCategories.map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        setSelectedGlobalCat(cat);
                      }}
                      className="flex flex-col items-center flex-shrink-0 focus:outline-none group"
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/40 shadow-md backdrop-blur-md relative bg-slate-100 flex items-center justify-center transition-all group-hover:border-fowy-secondary/60">
                        <PremiumImage
                          src={cat.image_url || ""}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                          fallbackType="generic"
                        />
                      </div>
                      <span className="text-xs font-extrabold text-slate-600 mt-3 text-center truncate w-24 group-hover:text-fowy-secondary transition-colors">
                        {cat.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o categoría..."
                  className="w-full pl-12 pr-4 py-3 glass-morphism rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 transition-all border border-white/50 shadow-inner-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-5 py-3 glass-morphism rounded-2xl text-slate-600 font-medium hover:bg-white hover:shadow-sm transition-all border border-white/50">
                <Filter size={20} />
                Filtros
              </button>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fowy-secondary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-morphism rounded-fowy overflow-hidden group shadow-sm border border-white/40 hover:shadow-premium transition-all duration-300"
                    >
                      <div className="aspect-video bg-slate-100 relative overflow-hidden">
                        <PremiumImage 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                          fallbackType="generic"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-fowy-secondary shadow-sm transition-all hover:scale-110 active:scale-95"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 shadow-sm transition-all hover:scale-110 active:scale-95"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7B61FF] bg-[#7B61FF]/10 px-2 py-0.5 rounded-full">
                            {product.category_name || 'Sin Categoría'}
                          </span>
                          <span className="text-lg font-bold text-slate-800">
                            ${Number(product.price).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2 h-10">
                          {product.description || 'Sin descripción disponible.'}
                        </p>

                        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                          {/* Fila de Promoción/Oferta */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${product.is_offer ? 'bg-[#FF5A5F]' : 'bg-slate-300'}`} />
                              <span className="text-xs font-bold text-slate-600">
                                {product.is_offer ? 'En Promoción' : 'Sin Promo'}
                              </span>
                            </div>
                            
                            <button 
                              onClick={() => handleToggleOffer(product.id, product.is_offer)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                product.is_offer ? 'bg-[#FF5A5F]' : 'bg-slate-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                                  product.is_offer ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Fila de Stock */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span className="text-xs font-bold text-slate-600">
                                {product.in_stock ? 'En Stock' : 'Agotado'}
                              </span>
                            </div>
                            
                            <button 
                              onClick={() => handleToggleStock(product.id, product.in_stock)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                product.in_stock ? 'bg-[#7B61FF]' : 'bg-slate-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                                  product.in_stock ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  onClick={handleAddNewProduct}
                  className="border-2 border-dashed border-slate-200 rounded-fowy p-6 flex flex-col items-center justify-center text-slate-400 hover:border-[#7B61FF]/40 hover:bg-white/50 hover:text-[#7B61FF] transition-all min-h-[300px] shadow-sm group"
                >
                  <div className="w-12 h-12 bg-slate-50 group-hover:bg-[#7B61FF]/10 rounded-full flex items-center justify-center mb-4 transition-colors">
                    <Plus size={24} className="group-hover:text-[#7B61FF] transition-colors" />
                  </div>
                  <span className="font-bold text-slate-500 group-hover:text-[#7B61FF] transition-colors">Agregar Producto</span>
                  <span className="text-xs mt-1">Crea un nuevo ítem en tu menú</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Category Manager Modal */}
      <AnimatePresence>
        {isCategoryManagerOpen && businessId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryManagerOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <MenuCategoryManager 
              businessId={businessId} 
              onClose={() => setIsCategoryManagerOpen(false)} 
            />
          </div>
        )}
      </AnimatePresence>

      {/* Product Form Modal */}
      <AnimatePresence>
        {isProductModalOpen && businessId && (
          <ProductFormModal 
            businessId={businessId}
            productToEdit={productToEdit}
            onClose={() => {
              setIsProductModalOpen(false);
              setProductToEdit(undefined);
            }}
            onSuccess={refreshProducts}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteProduct}
        title="¿Eliminar Producto?"
        description="Esta acción no se puede deshacer. El producto desaparecerá de tu menú inmediatamente."
        isLoading={isDeleting}
      />

      {/* Global Product Selector Catalog */}
      <GlobalProductSelector 
        isOpen={isGlobalSelectorOpen}
        onClose={() => {
          setIsGlobalSelectorOpen(false);
          setSelectedGlobalCategory(null);
        }}
        onSelectProduct={handleSelectGlobalProduct}
        initialCategory={selectedGlobalCategory || undefined}
      />

      {/* Global Product Local Price / Category Save Modal */}
      {isGlobalSaveModalOpen && businessId && selectedGlobalProduct && (
        <GlobalProductSaveModal 
          isOpen={isGlobalSaveModalOpen}
          businessId={businessId}
          globalProduct={selectedGlobalProduct}
          onClose={() => {
            setIsGlobalSaveModalOpen(false);
            setSelectedGlobalProduct(null);
          }}
          onSuccess={() => {
            refreshProducts();
            setIsGlobalSaveModalOpen(false);
            setSelectedGlobalProduct(null);
            setIsGlobalSelectorOpen(false);
          }}
        />
      )}
    </div>
  );
}

