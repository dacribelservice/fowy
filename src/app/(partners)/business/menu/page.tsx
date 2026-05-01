"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  in_stock: boolean;
  is_active: boolean;
  category_name: string;
}

interface Business {
  id: string;
  name: string;
  tags: string[];
}



export default function MenuManagementPage() {
  const searchParams = useSearchParams();
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  
  const supabase = createClient();

  // Carga inicial de datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 0. Resolver el ID del negocio desde la sesión
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: bizData } = await supabase
        .from('businesses')
        .select('id, name, tags')
        .eq('owner_id', user.id)
        .single();

      if (!bizData) {
        setLoading(false);
        return;
      }

      setBusinessId(bizData.id);
      setBusiness(bizData);
      setSelectedCategories(bizData.tags || []);

      // 1. Cargar Categorías Globales (para alineación)
      const { data: catData } = await supabase
        .from('categories')
        .select('name')
        .order('name', { ascending: true });
      
      if (catData) setDbCategories(catData.map(c => c.name));

      // 2. Cargar Productos
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', bizData.id)
        .order('created_at', { ascending: false });

      if (prodData) setProducts(prodData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Persistencia de etiquetas (Guardado Instantáneo)

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

    // Buscamos el ID de la primera categoría seleccionada para mantener sincronizado category_id
    let categoryIdToSync = null;
    if (selectedCategories.length > 0) {
      // Necesitamos el ID de la categoría cuyo nombre es selectedCategories[0]
      // Ya tenemos dbCategories (nombres), pero necesitamos los IDs. 
      // Por simplicidad en este paso, buscaremos el ID en la tabla categories.
      const { data: catRecord } = await supabase
        .from('categories')
        .select('id')
        .eq('name', selectedCategories[0])
        .single();
      
      if (catRecord) {
        categoryIdToSync = catRecord.id;
      }
    }
    
    const { error } = await supabase
      .from('businesses')
      .update({ 
        tags: selectedCategories,
        category_id: categoryIdToSync // Sincronización automática
      })
      .eq('id', businessId);

    if (error) {
      console.error("Error saving categories:", error);
      alert("Error al guardar las categorías. Por favor, verifica tus permisos.");
      setSaveStatus("idle");
    } else {
      setSaveStatus("saved");
      // Update local business state to reflect saved changes
      setBusiness(prev => prev ? { ...prev, tags: selectedCategories } : null);
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const toggleStock = async (id: string, currentStock: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ in_stock: !currentStock })
      .eq('id', id);

    if (!error) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, in_stock: !currentStock } : p));
    }
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
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-fowy-secondary text-white rounded-2xl font-bold shadow-premium hover:opacity-90 transition-all">
          <Plus size={20} />
          Nuevo Producto
        </button>
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
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon size={40} className="mb-2 opacity-50" />
                      <span className="text-xs font-medium italic">Sin imagen</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-fowy-secondary shadow-sm transition-all">
                      <MoreVertical size={16} />
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

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-xs font-bold text-slate-600">
                        {product.in_stock ? 'En Stock' : 'Agotado'}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => toggleStock(product.id, product.in_stock)}
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
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.02 }}
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
    </div>
  );
}

