"use client";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MOCK_BUSINESS } from "@/data/mock-crave";
import { MapPin, Star, Search, Plus } from "lucide-react";

/**
 * CraveVisionSandbox: El "Lienzo en Blanco" para el Re-Diseño Premium.
 * Esta página vive dentro del MobileFrame del layout, por lo que hereda el marco del celular.
 */
export default function CraveVisionSandbox() {
  const { slug } = useParams();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Auto-slide para el banner
  useEffect(() => {
    if (!MOCK_BUSINESS.banners || MOCK_BUSINESS.banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % MOCK_BUSINESS.banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white relative pb-20">
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
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
              selectedCategory === "all"
                ? "shadow-md scale-105"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
            style={
              selectedCategory === "all"
                ? {
                    backgroundColor: MOCK_BUSINESS.accent_color,
                    borderColor: MOCK_BUSINESS.accent_color,
                    color: "#fff",
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
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "shadow-md scale-105"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
              style={
                selectedCategory === cat.id
                  ? {
                      backgroundColor: MOCK_BUSINESS.accent_color,
                      borderColor: MOCK_BUSINESS.accent_color,
                      color: "#fff",
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
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Promo
                    </div>
                  )}
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
  );
}
