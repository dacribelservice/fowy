"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Plus, Search, Filter, AlertCircle, CheckCircle2, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductManager, type Product } from "@/hooks/useProductManager";
import { useCategoryManager } from "@/hooks/useCategoryManager";
import { GlobalCategory } from "@/types/catalogo";
import { toast } from "sonner";

// Importación de Componentes Refactorizados y Aislados
import MenuCategoryManager from "@/components/partners/business/menu/MenuCategoryManager";
import ProductFormModal from "@/components/partners/business/menu/ProductFormModal";
import DeleteConfirmationModal from "@/components/partners/business/menu/DeleteConfirmationModal";
import GlobalProductSelector, { GlobalProduct } from "@/components/partners/business/menu/GlobalProductSelector";
import GlobalProductSaveModal from "@/components/partners/business/menu/GlobalProductSaveModal";
import FowyCatalogView from "@/components/partners/business/menu/FowyCatalogView";
import BusinessTagsManager from "@/components/partners/business/menu/BusinessTagsManager";
import GlobalCategoriesCarousel from "@/components/partners/business/menu/GlobalCategoriesCarousel";
import LocalProductCard from "@/components/partners/business/menu/LocalProductCard";

interface Business {
  id: string;
  name: string;
  tags: string[];
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

  // Subpantalla de Selección de Productos
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

  // Cargar productos de la categoría global seleccionada
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
    const ids = products
      .map(p => p.global_product_id)
      .filter((id): id is string => typeof id === "string");
    return new Set(ids);
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
      toast.error("Error al guardar las categorías.");
      setSaveStatus("idle");
    } else {
      setSaveStatus("saved");
      setBusiness(prev => prev ? { ...prev, tags: selectedCategories } : null);
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!productToDeleteId) return;
    setIsDeleting(true);
    await deleteProduct(productToDeleteId);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setProductToDeleteId(null);
  };

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
          <FowyCatalogView
            selectedGlobalCat={selectedGlobalCat}
            globalSearchTerm={globalSearchTerm}
            setGlobalSearchTerm={setGlobalSearchTerm}
            onBack={() => {
              setSelectedGlobalCat(null);
              setGlobalSearchTerm("");
            }}
            loadingGlobalProds={loadingGlobalProds}
            filteredGlobalProducts={filteredGlobalProducts}
            activeGlobalProductIds={activeGlobalProductIds}
            products={products}
            localCategories={localCategories}
            addLocalCategory={addLocalCategory}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            updateProduct={updateProduct}
          />
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
                  className="flex items-center justify-center gap-2 px-6 py-3 glass-morphism text-slate-600 rounded-2xl font-bold border border-white/50 hover:bg-white transition-all cursor-pointer"
                >
                  <Layers size={20} className="text-fowy-secondary" />
                  Categorias
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setProductToEdit(undefined);
                    setIsProductModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-fowy-secondary text-white rounded-2xl font-bold shadow-premium hover:opacity-90 transition-all cursor-pointer"
                >
                  <Plus size={20} />
                  Nuevo Producto
                </button>
              </div>
            </div>

            {/* Gestor de Etiquetas (Tags) Aislado */}
            <BusinessTagsManager
              dbCategories={dbCategories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              onSave={handleSaveCategories}
              savingCats={saveStatus === "saving"}
              loadingCategories={loadingBiz}
              hasChanges={hasChanges}
            />

            {/* Carrusel de Categorías Circulares del Catálogo Fowy Aislado */}
            <GlobalCategoriesCarousel
              globalCategories={globalCategories}
              onSelectCategory={setSelectedGlobalCat}
            />

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
              <button className="flex items-center justify-center gap-2 px-5 py-3 glass-morphism rounded-2xl text-slate-600 font-medium hover:bg-white hover:shadow-sm transition-all border border-white/50 cursor-pointer">
                <Filter size={20} />
                Filtros
              </button>
            </div>

            {/* Products Grid */}
            {loadingBiz || loadingProds ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fowy-secondary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <LocalProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      onEdit={(prod) => {
                        setProductToEdit(prod);
                        setIsProductModalOpen(true);
                      }}
                      onDelete={(id) => {
                        setProductToDeleteId(id);
                        setIsDeleteModalOpen(true);
                      }}
                      onToggleOffer={toggleOffer}
                      onToggleStock={toggleStock}
                    />
                  ))}
                </AnimatePresence>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setProductToEdit(undefined);
                    setIsProductModalOpen(true);
                  }}
                  className="border-2 border-dashed border-slate-200 rounded-fowy p-6 flex flex-col items-center justify-center text-slate-400 hover:border-[#7B61FF]/40 hover:bg-white/50 hover:text-[#7B61FF] transition-all min-h-[300px] shadow-sm group cursor-pointer"
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
