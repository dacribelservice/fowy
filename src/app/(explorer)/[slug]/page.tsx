"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Info, 
  ShoppingBag, 
  ChevronLeft, 
  Search,
  Star,
  Clock,
  Plus,
  Minus,
  X
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  in_stock: boolean;
  category_name: string;
}

interface Business {
  id: string;
  name: string;
  logo_url: string;
  color_identity: string;
  city: string;
  phone: string;
}

export default function BusinessMenuPage() {
  const { slug } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch Business
      const { data: busData, error: busError } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (busError || !busData) {
        console.error("Business not found");
        return;
      }
      setBusiness(busData);

      // Fetch Products
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', busData.id)
        .eq('is_active', true)
        .order('category_name', { ascending: true });

      setProducts(prodData || []);

    } catch (error) {
      console.error("Error fetching business menu:", error);
    } finally {
      setLoading(false);
    }
  }, [slug, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const groupedProducts = useMemo(() => {
    const groups: { [key: string]: Product[] } = {};
    filteredProducts.forEach(p => {
      const cat = p.category_name || "Otros";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [filteredProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Preparando la mesa...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-black text-slate-800 mb-2">Negocio no encontrado</h1>
        <p className="text-slate-500 mb-8">El enlace que seguiste podría estar roto o el negocio ya no está activo.</p>
        <Link href="/explorar" className="px-8 py-4 bg-slate-900 text-white rounded-full font-black uppercase text-xs tracking-widest">
          Volver a Explorar
        </Link>
      </div>
    );
  }

  const accentColor = business.color_identity || "#FF5A5F";

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-32">
      {/* Header Overlay */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-50">
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex-1 flex flex-col items-center px-4 overflow-hidden">
             <h1 className="text-sm font-black text-slate-800 truncate w-full text-center">{business.name}</h1>
             <div className="flex items-center gap-1">
               <Star size={10} className="fill-amber-400 text-amber-400" />
               <span className="text-[10px] font-bold text-slate-500">4.9 (120+ reseñas)</span>
             </div>
          </div>

          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-50">
            <Info size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Business Hero */}
        <div className="bg-white p-6 md:rounded-b-[40px] shadow-sm mb-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-slate-50 shadow-xl">
              <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{business.name}</h2>
              <div className="flex items-center justify-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                  <MapPin size={14} />
                  {business.city}
                </div>
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                <div className="flex items-center gap-1 text-green-500 text-xs font-black uppercase">
                  <Clock size={14} />
                  Abierto
                </div>
              </div>
            </div>
          </div>

          {/* Search in Menu */}
          <div className="relative mt-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Busca en el menú..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-slate-300 transition-all font-bold text-slate-700 placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Menu Sections */}
        <div className="px-4 space-y-10 pb-20">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                {category}
              </h3>
              <div className="grid gap-4">
                {items.map((product) => (
                  <motion.div 
                    key={product.id}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-all"
                  >
                    <div className="flex-1">
                      <h4 className="font-black text-slate-800 mb-1">{product.name}</h4>
                      <p className="text-xs text-slate-400 font-medium line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-slate-900">${product.price}</span>
                        
                        {!product.in_stock ? (
                          <span className="text-[10px] font-black uppercase text-red-400 bg-red-50 px-3 py-1 rounded-full">Agotado</span>
                        ) : (
                          <button 
                            onClick={() => addToCart(product)}
                            className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 active:scale-90 transition-all"
                          >
                            <Plus size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                    {product.image_url && (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-lg z-[100]"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              style={{ backgroundColor: accentColor }}
              className="w-full p-4 rounded-[28px] text-white flex items-center justify-between shadow-2xl shadow-slate-900/20 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </div>
                <span className="font-black uppercase tracking-widest text-xs">Ver Carrito</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg">${cartTotal}</span>
                <ShoppingBag size={20} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal / Sheet */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[201] max-h-[90vh] flex flex-col"
            >
              <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Tu Pedido</h3>
                <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{item.product.name}</h4>
                      <p className="text-xs font-black text-slate-400">${item.product.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-full">
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 hover:text-fowy-orange transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-4 text-center font-black text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item.product)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 hover:text-fowy-orange transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-slate-50/50 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                    <span>Subtotal</span>
                    <span>${cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-black text-slate-900">
                    <span>Total</span>
                    <span>${cartTotal}</span>
                  </div>
                </div>

                <button 
                  style={{ backgroundColor: accentColor }}
                  className="w-full py-5 rounded-3xl text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <ShoppingBag size={18} />
                  Confirmar Pedido
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
