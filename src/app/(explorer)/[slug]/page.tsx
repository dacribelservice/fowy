"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Star, 
  Info, 
  MapPin, 
  Search, 
  ShoppingBag, 
  X, 
  Minus, 
  Plus,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import ProductGrid from "@/components/explorer/ProductGrid";
import CartSheet from "@/components/explorer/CartSheet";

export default function BusinessMenuPage() {
  const { slug } = useParams();
  const [business, setBusiness] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  // Initialize Cart Hook
  const { 
    businessItems, 
    businessTotal, 
    businessCount, 
    addToCart, 
    removeFromCart,
    updateQuantity
  } = useCart(business?.id);

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

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Analytics: Record Visit
  const recordVisit = useCallback(async (businessId: string) => {
    try {
      await supabase.from('analytics_visits').insert({
        business_id: businessId,
        path: window.location.pathname,
        user_agent: navigator.userAgent,
        referrer: document.referrer || "direct"
      });
    } catch (e) {
      console.error("Error recording visit:", e);
    }
  }, [supabase]);

  // Analytics: Record Order
  const handleCheckoutTracking = async (formData: any) => {
    if (!business) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('orders').insert({
        business_id: business.id,
        customer_id: user?.id || null,
        customer_name: formData.name,
        customer_phone: formData.phone,
        items: businessItems,
        total_amount: businessTotal,
        status: 'pending'
      });
    } catch (e) {
      console.error("Error recording order:", e);
    }
  };

  useEffect(() => {
    if (business?.id) {
      recordVisit(business.id);
    }
  }, [business?.id, recordVisit]);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      business_id: business.id,
      business_name: business.name
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 rounded-full" />
          <div className="w-16 h-16 border-4 border-t-slate-900 rounded-full animate-spin absolute top-0" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Preparando la mesa</p>
          <p className="text-[8px] font-bold text-slate-300 mt-1 uppercase">Dacribel Engine v1.3</p>
        </div>
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
    <div className="min-h-screen bg-[#FBFAFF] pb-40">
      {/* Header Sticky */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <button 
            onClick={() => router.back()} 
            className="w-12 h-12 rounded-[18px] bg-white border border-slate-100 flex items-center justify-center text-slate-800 shadow-sm active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex-1 flex flex-col items-center overflow-hidden">
             <h1 className="text-sm font-black text-slate-800 truncate w-full text-center tracking-tight">{business.name}</h1>
             <div className="flex items-center gap-2">
               <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                 <Star size={10} className="fill-amber-400 text-amber-400" />
                 <span className="text-[10px] font-black text-amber-600">4.9</span>
               </div>
               <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">120+ reseñas</span>
             </div>
          </div>

          <button className="w-12 h-12 rounded-[18px] bg-white border border-slate-100 flex items-center justify-center text-slate-800 shadow-sm active:scale-90 transition-all">
            <Info size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Business Hero */}
        <div className="relative px-4 pt-10 pb-10">
          {/* Decorative background */}
          <div className="absolute inset-0 top-0 h-40 bg-gradient-to-b from-slate-50 to-transparent z-0" />
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 rounded-[45px] overflow-hidden border-8 border-white shadow-2xl shadow-slate-900/10 mb-6 bg-white"
            >
              <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
            </motion.div>
            
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">{business.name}</h2>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <MapPin size={14} className="text-slate-300" />
                  {business.city}
                </div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <div className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  Abierto ahora
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar - Premium */}
        <div className="px-6 mb-12">
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors">
              <Search size={22} />
            </div>
            <input 
              type="text" 
              placeholder="¿Qué se te antoja hoy?" 
              className="w-full pl-16 pr-6 py-5 bg-white rounded-[30px] border border-slate-100 shadow-sm outline-none focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product Grid Components */}
        <div className="px-6">
          {products.length > 0 ? (
            <ProductGrid 
              products={filteredProducts} 
              cart={businessItems} 
              onAdd={handleAddToCart} 
              onRemove={removeFromCart} 
            />
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                <ShoppingBag size={32} />
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No hay productos disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Premium Floating Cart Button */}
      <AnimatePresence>
        {businessCount > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[400px] z-[100]"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
              className="w-full p-2 pl-6 rounded-[35px] text-white flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95 transition-all group overflow-hidden relative"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="flex items-center gap-4">
                <div className="bg-white text-slate-900 w-10 h-10 rounded-[18px] flex items-center justify-center font-black text-sm shadow-xl">
                  {businessCount}
                </div>
                <span className="font-black uppercase tracking-[0.2em] text-[10px]">Ver mi orden</span>
              </div>
              
              <div className="flex items-center gap-4 bg-black/10 px-6 py-4 rounded-[30px] backdrop-blur-md">
                <span className="font-black text-lg tracking-tighter">${businessTotal.toLocaleString()}</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sheet Component */}
      <CartSheet 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={businessItems}
        total={businessTotal}
        businessName={business.name}
        businessPhone={business.phone || ""}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckoutTracking}
        accentColor={accentColor}
      />
    </div>
  );
}
