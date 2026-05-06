"use client";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MOCK_BUSINESS } from "@/data/mock-crave";
import { MapPin, Star, Search, Plus, Heart, ShoppingCart } from "lucide-react";

/**
 * CraveVisionSandbox: El "Lienzo en Blanco" para el Re-Diseño Premium.
 * Esta página vive dentro del MobileFrame del layout, por lo que hereda el marco del celular.
 */
export default function CraveVisionSandbox() {
  const { slug } = useParams();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<any[]>([]);

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => [...prev, product]);
  };

  // Auto-slide para el banner
  useEffect(() => {
    if (!MOCK_BUSINESS.banners || MOCK_BUSINESS.banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % MOCK_BUSINESS.banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20 relative">
      {/* BLOQUE 2: HEADER Y BRANDING V3 */}
      
      {/* 2.3 SLIDER DE BANNERS */}
      <div className="relative w-full h-[280px] bg-slate-900 rounded-b-[40px] overflow-hidden shadow-sm">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentBannerIndex}
            src={MOCK_BUSINESS.banners[currentBannerIndex]?.image_url || MOCK_BUSINESS.banner_url}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Gradiente sutil inferior para legibilidad de los puntos */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>


        {/* Indicadores (Dots) animados */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {MOCK_BUSINESS.banners.map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-2.5 rounded-full bg-white transition-all duration-500 ease-in-out ${
                idx === currentBannerIndex ? "w-8 opacity-100" : "w-2.5 opacity-50"
              }`}
              layout
            />
          ))}
        </div>
      </div>

      {/* 2.1 & 2.2 IDENTITY BAR (Logo-Left / Text-Right) */}
      <div className="relative px-6 -mt-14 z-20 flex items-start gap-5">
        {/* Logo Circular */}
        <div className="w-28 h-28 rounded-full border-[5px] border-white overflow-hidden shadow-sm bg-white shrink-0">
          <img 
            src={MOCK_BUSINESS.logo_url} 
            alt={MOCK_BUSINESS.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detalles del Negocio */}
        <div className="pt-14 flex-1 min-w-0">
          <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight leading-none truncate">
            {MOCK_BUSINESS.name}
          </h1>
          
          {/* 2.2 Meta-datos Premium */}
          <div className="mt-2 flex items-center gap-3">
            {/* Estado: Abierto / Cerrado */}
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${MOCK_BUSINESS.is_open ? 'bg-[#34C759]' : 'bg-red-500'}`}></span>
              <span className={`text-[14px] font-bold tracking-wide ${MOCK_BUSINESS.is_open ? 'text-[#34C759]' : 'text-red-600'}`}>
                {MOCK_BUSINESS.is_open ? 'ABIERTO' : 'CERRADO'}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-[18px] h-[18px] fill-[#FFCC00] text-[#FFCC00]" />
              <span className="text-[14px] font-bold text-slate-900">{MOCK_BUSINESS.rating}</span>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              DISTANCIA {MOCK_BUSINESS.distance}
            </span>
          </div>
        </div>
      </div>

      {/* BLOQUE 3: BÚSQUEDA Y NAVEGACIÓN */}
      <div className="px-6 mt-8 space-y-6">
        
        {/* 3.1 Buscador Flotante Glassmorphism */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/80 backdrop-blur-md border border-slate-200 text-slate-800 text-[15px] font-medium rounded-full py-3.5 pl-12 pr-4 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
          />
        </div>

        {/* 3.2 Carrusel de Categorías V3 */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-[10px] py-[5px] rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-90 border ${
              selectedCategory === "all"
                ? "border-transparent text-white"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
            style={
              selectedCategory === "all"
                ? {
                    background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                    boxShadow: `0 4px 10px ${MOCK_BUSINESS.accent_color}66, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)`,
                  }
                : {}
            }
          >
            Todos
          </button>
          
          {MOCK_BUSINESS.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-[10px] py-[5px] rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-90 border flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "border-transparent text-white"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
              style={
                selectedCategory === cat.id
                  ? {
                      background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                      boxShadow: `0 4px 10px ${MOCK_BUSINESS.accent_color}66, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)`,
                    }
                  : {}
              }
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* BLOQUE 4: LA JOYA DE LA CORONA - PRODUCT CARD V3 */}
      <div className="px-4 pb-24 mt-4">
        <div className="grid grid-cols-2 gap-4">
          {MOCK_BUSINESS.products
            .filter((product) => {
              const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
              return matchesSearch && matchesCategory;
            })
            .map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col relative group"
              >
                {/* Product Image */}
                <div className="h-32 w-full relative overflow-hidden bg-slate-50">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.is_promo && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10">
                      Promo
                    </div>
                  )}
                  {/* Ícono de Favoritos (Corazón) - Premium Glassmorphism */}
                  <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-sm transition-all active:scale-90 hover:bg-white/30 z-10">
                    <Heart className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 text-[11px] mt-1 line-clamp-2 flex-1 leading-snug">
                    {product.description}
                  </p>

                  {/* Price and Action Button */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-slate-900 text-[15px]">
                      ${product.price.toLocaleString("es-CO")}
                    </span>

                    {/* Floating Action Button Premium */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-90 hover:brightness-110 border border-white/20"
                      style={{
                        background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                        boxShadow: `0 4px 10px ${MOCK_BUSINESS.accent_color}66, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)`
                      }}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      </div>

      {/* BLOQUE 5: LA EXPERIENCIA DEL CARRITO (MAGIC PILL) */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.div
            initial={{ 
              width: "64px", 
              height: "64px", 
              borderRadius: "32px", 
              opacity: 0, 
              y: 60, 
              x: "-50%",
              scale: 0.5 
            }}
            animate={{ 
              width: "92%", 
              height: "72px", 
              borderRadius: "36px", 
              opacity: 1, 
              y: 0, 
              x: "-50%",
              scale: 1 
            }}
            exit={{ 
              opacity: 0, 
              y: 60, 
              scale: 0.8, 
              x: "-50%",
              width: "64px"
            }}
            transition={{ 
              type: "spring", 
              stiffness: 90, 
              damping: 14,
              mass: 1.1
            }}
            className="absolute bottom-10 left-1/2 z-50 overflow-hidden cursor-pointer flex items-center justify-between"
            style={{
              // Glassmorphism ultra-premium super marcado
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.3) 100%)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              borderTop: "1px solid rgba(255, 255, 255, 0.9)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <motion.div 
              className="flex items-center justify-between w-full h-full px-5"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.35, duration: 0.45, ease: "easeOut" }}
            >
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
                  Ver Pedido
                </span>
                <span className="text-[22px] font-black text-slate-900 leading-none tracking-tight">
                  ${cartItems.reduce((acc, curr) => acc + curr.price, 0).toLocaleString("es-CO")}
                </span>
              </div>
              
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 relative"
                style={{
                   background: `linear-gradient(135deg, ${MOCK_BUSINESS.accent_color}e6 0%, ${MOCK_BUSINESS.accent_color} 100%)`,
                   boxShadow: `0 8px 20px ${MOCK_BUSINESS.accent_color}80, inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4)`
                }}
              >
                <ShoppingCart className="w-[20px] h-[20px] stroke-[2.5]" />
                <AnimatePresence mode="popLayout">
                  <motion.div 
                    key={cartItems.length}
                    initial={{ scale: 0, y: 10, rotate: -45 }}
                    animate={{ scale: 1, y: 0, rotate: 0 }}
                    exit={{ scale: 0, y: -10, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[12px] w-[24px] h-[24px] flex items-center justify-center rounded-full font-bold border-[2.5px] border-white shadow-md"
                  >
                    {cartItems.length}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
