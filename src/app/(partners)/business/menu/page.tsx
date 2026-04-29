"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Utensils,
  Image as ImageIcon
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

export default function MenuManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Gestión de Menú 🍕
          </h2>
          <p className="text-slate-500 mt-2">
            Administra tus productos, precios y disponibilidad en tiempo real.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-fowy-secondary text-white rounded-2xl font-bold shadow-premium hover:opacity-90 transition-all">
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..."
            className="w-full pl-12 pr-4 py-3 glass-morphism rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-3 glass-morphism rounded-2xl text-slate-600 font-medium hover:bg-white transition-all">
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
                className="glass-morphism rounded-fowy overflow-hidden group shadow-glass hover:shadow-premium transition-all duration-300"
              >
                {/* Image Placeholder */}
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

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-fowy-secondary bg-blue-50 px-2 py-0.5 rounded-full">
                      {product.category_name || 'Sin Categoría'}
                    </span>
                    <span className="text-lg font-bold text-slate-800">
                      ${product.price}
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
                    
                    {/* Stock Switch */}
                    <button 
                      onClick={() => toggleStock(product.id, product.in_stock)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        product.in_stock ? 'bg-fowy-secondary' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          product.in_stock ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add New Card (Empty State) */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="border-2 border-dashed border-slate-200 rounded-fowy p-6 flex flex-col items-center justify-center text-slate-400 hover:border-fowy-secondary/40 hover:bg-white/50 transition-all min-h-[300px]"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Plus size={24} />
            </div>
            <span className="font-bold text-slate-500">Agregar Producto</span>
            <span className="text-xs mt-1">Crea un nuevo ítem en tu menú</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
