"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { 
  ArrowLeft,
  X, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Package, 
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Interfaz para un producto global recibido de la DB
export interface GlobalProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category_default: string | null;
  is_active: boolean;
  created_at?: string;
}

interface GlobalProductSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: GlobalProduct) => void;
  initialCategory?: string;
}

const ITEMS_PER_PAGE = 8;

const CATEGORIES_PRESETS = [
  { id: "All", label: "Todos" },
  { id: "Gaseosas", label: "Gaseosas" },
  { id: "Aguas", label: "Aguas / Sodas" },
  { id: "Cervezas", label: "Cervezas" },
  { id: "Licores", label: "Licores" },
  { id: "Jugos", label: "Jugos / Bebidas" },
  { id: "Energizantes", label: "Energizantes" }
];

export default function GlobalProductSelector({ isOpen, onClose, onSelectProduct, initialCategory }: GlobalProductSelectorProps) {
  const [products, setProducts] = useState<GlobalProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(initialCategory || "All");
      setPage(1);
    }
  }, [isOpen, initialCategory]);

  const supabase = createClient();

  // Función principal para cargar productos globales con filtros server-side
  const loadGlobalProducts = useCallback(async () => {
    setLoading(true);
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("global_products")
        .select("*", { count: "exact" })
        .eq("is_active", true);

      // Búsqueda server-side
      if (searchTerm.trim()) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      // Filtro por categoría server-side
      if (selectedCategory !== "All") {
        query = query.eq("category_default", selectedCategory);
      }

      const { data, count, error } = await query
        .order("name", { ascending: true })
        .range(from, to);

      if (error) throw error;

      setProducts((data as GlobalProduct[]) || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error al cargar el catálogo de Fowy:", err);
      toast.error("No se pudo cargar el catálogo global");
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedCategory, supabase]);

  // Recargar productos cuando cambia la página, término de búsqueda o categoría
  useEffect(() => {
    if (isOpen) {
      loadGlobalProducts();
    }
  }, [isOpen, loadGlobalProducts]);

  // Resetear página al buscar o cambiar categoría
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Framer Motion Animaciones premium
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { x: "100%", opacity: 0.95 },
    visible: { 
      x: 0,
      opacity: 1,
      transition: { type: "spring" as const, damping: 30, stiffness: 260 } 
    },
    exit: { 
      x: "100%",
      opacity: 0.95,
      transition: { ease: "easeInOut", duration: 0.25 } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex justify-end overflow-hidden">
        {/* Fondo con Blur */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants as any}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        />

        {/* Subpantalla Lateral de Catálogo Global */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants as any}
          className="relative w-full max-w-2xl bg-white shadow-premium border-l border-slate-100 flex flex-col h-full overflow-hidden"
        >
          {/* Header del Modal */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-100 bg-white shadow-sm"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fowy-secondary/10 rounded-xl flex items-center justify-center text-fowy-secondary">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Catálogo Global Fowy</h3>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    Productos pre-cargados de alta calidad
                  </p>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600 hidden sm:block"
            >
              <X size={24} />
            </button>
          </div>

          {/* Buscador & Categorías */}
          <div className="p-6 bg-white border-b border-slate-100 space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={20} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por marca o nombre (ej: Coca-Cola, Club Colombia...)"
                className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 focus:bg-white transition-all text-slate-700 font-medium placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(""); setPage(1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest bg-slate-200/50 hover:bg-slate-200 px-2 py-1 rounded-lg transition-all"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Chips de Categorías */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-2 px-2">
              {CATEGORIES_PRESETS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border",
                    selectedCategory === cat.id
                      ? "bg-fowy-secondary text-white border-transparent shadow-sm shadow-fowy-secondary/20"
                      : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 hover:text-slate-800"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grilla de Productos */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
            {loading ? (
              // Loading State (Premium Skeleton Cards)
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-2xl p-3 space-y-3 animate-pulse shadow-sm">
                    <div className="aspect-square w-full bg-slate-100 rounded-xl" />
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              // Results State
              <motion.div
                variants={containerVariants as any}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants as any}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => onSelectProduct(product)}
                    className="group bg-white border border-slate-100 rounded-2xl p-3 flex flex-col justify-between cursor-pointer hover:shadow-premium hover:border-fowy-secondary/25 transition-all shadow-sm"
                  >
                    <div>
                      {/* Imagen con PremiumImage */}
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-3 border border-slate-50 group-hover:border-slate-100 transition-all">
                        <PremiumImage
                          src={product.image_url || ""}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          fallbackType="generic"
                        />
                        {product.category_default && (
                          <span className="absolute top-2 left-2 bg-slate-900/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {product.category_default}
                          </span>
                        )}
                      </div>

                      {/* Información */}
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-fowy-secondary transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[32px] leading-relaxed">
                        {product.description || "Sin descripción predeterminada."}
                      </p>
                    </div>

                    {/* Botón de Selección */}
                    <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] text-fowy-secondary font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Seleccionar
                      </span>
                      <div className="w-7 h-7 bg-fowy-secondary/10 group-hover:bg-fowy-secondary text-fowy-secondary group-hover:text-white rounded-lg flex items-center justify-center transition-all ml-auto">
                        <span className="font-bold text-sm">+</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // Empty State (Premium & Interactive)
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                  <Package size={28} />
                </div>
                <h4 className="text-lg font-bold text-slate-800">No encontramos coincidencias</h4>
                <p className="text-sm text-slate-400 max-w-sm mt-2">
                  Prueba buscando otra marca o cambia de categoría. Las gaseosas y licores más comunes están cargados aquí.
                </p>
                {(searchTerm || selectedCategory !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setPage(1);
                    }}
                    className="mt-6 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm"
                  >
                    Restablecer Filtros
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* Footer con Paginación */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs text-slate-500 font-semibold">
                Mostrando {products.length} de {totalCount} productos
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className={cn(
                    "p-2 rounded-xl border border-slate-200 bg-white transition-all text-slate-600",
                    page === 1 || loading
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300"
                  )}
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-xs text-slate-700 font-bold bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  Página {page} de {totalPages}
                </span>

                <button
                  disabled={page === totalPages || loading}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  className={cn(
                    "p-2 rounded-xl border border-slate-200 bg-white transition-all text-slate-600",
                    page === totalPages || loading
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300"
                  )}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
