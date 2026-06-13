"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useV2BusinessMenuData } from "@/hooks/useV2BusinessMenuData";
import { useBusinessAnalytics } from "@/hooks/useBusinessAnalytics";
import { useFavorites } from "@/hooks/useFavorites";
import { isBusinessOpen } from "@/utils/businessTime";
import { Wrench, ChevronLeft } from "lucide-react";

import { BusinessMenuSkeleton } from "@/components/explorer/BusinessMenuSkeleton";
import { BusinessMenuNotFound } from "@/components/explorer/BusinessMenuNotFound";

import { CraveHeaderCompact } from "@/components/explorer/CraveHeaderCompact";
import { MenuHeroSliderV2 } from "@/components/explorer/MenuHeroSliderV2";
import { CraveBusinessHeader } from "@/components/explorer/CraveBusinessHeader";
import { CraveSearchBar } from "@/components/explorer/CraveSearchBar";
import { CraveCategoryBar } from "@/components/explorer/CraveCategoryBar";
import { CraveProductCard } from "@/components/explorer/CraveProductCard";
import { CraveProductDetailModal } from "@/components/explorer/CraveProductDetailModal";
import { CraveMagicCart } from "@/components/explorer/CraveMagicCart";
import { CraveCheckoutSheet } from "@/components/explorer/CraveCheckoutSheet";
import { LazyWrapper } from "@/components/explorer/LazyWrapper";
import { AutoScrollBanners } from "@/components/explorer/AutoScrollBanners";
import Footer from "@/components/explorer/Footer";


/**
 * BusinessMenuPage: El nuevo molde de producción premium de Crave Vision.
 * Totalmente modularizado, tipo-seguro y conectado en tiempo real al core de FOWY.
 */
export default function BusinessMenuPage() {
  const { slug } = useParams();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<any | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Custom Hooks (Data & Analytics)
  const {
    business,
    categories,
    products,
    banners,
    loading,
    productsLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    votesCount,
  } = useV2BusinessMenuData(slug);

  useBusinessAnalytics(business?.id);

  // Favorites Hook
  const { isProductFavorite, toggleFavorite } = useFavorites();

  // Initialize global cart hook for this specific business
  const { businessItems, addToCart, removeFromCart } = useCart(business?.id);

  // Derive flatCartItems for backwards compatibility with existing view components
  const flatCartItems = businessItems.flatMap((item) =>
    Array(item.quantity).fill({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      business_id: item.business_id,
      business_name: item.business_name,
    })
  );

  const handleAddToCart = (product: any, quantity: number = 1) => {
    if (!business) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        business_id: business.id,
        business_name: business.name,
      });
    }
  };

  const handleRemoveOne = (productId: string) => {
    removeFromCart(productId);
  };

  const handleAddOne = (product: any) => {
    if (!business) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      business_id: business.id,
      business_name: business.name,
    });
  };

  // Cerrar bottom sheet automáticamente si el carrito queda vacío
  useEffect(() => {
    if (flatCartItems.length === 0) {
      setIsCartOpen(false);
    }
  }, [flatCartItems.length]);

  if (loading) {
    return <BusinessMenuSkeleton />;
  }

  if (!business) {
    return <BusinessMenuNotFound />;
  }

  const accentColor = business.color_identity || "#FF5A5F";
  const logoUrl = business.logo_url || "";
  const businessName = business.name || "";
  const rating = business.rating ?? 0.0;
  const distance = business.distance || "1.2 km";
  const isOpen = business.status === true && isBusinessOpen(business.schedules);



  return (
    <div 
      className="absolute inset-0 bg-[#ededed] overflow-hidden flex flex-col"
      style={{
        "--accent-color": accentColor,
        "--accent-color-90": `${accentColor}e6`,
        "--accent-color-40": `${accentColor}66`,
        "--accent-color-10": `${accentColor}1a`,
      } as React.CSSProperties}
    >
      {/* PANTALLA DE MANTENIMIENTO GLASSMORPHISM PARA NEGOCIOS INACTIVOS */}
      {business.status !== true && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md p-6 text-center">
          <div className="bg-white/85 backdrop-blur-xl border border-white/30 p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] max-w-[320px] w-full flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 shadow-inner">
              <Wrench size={32} className="animate-pulse text-slate-700" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center justify-center gap-2">
                ⚠️ Mantenimiento
              </h3>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                Este menú se encuentra inactivo. Por favor, intenta de nuevo más tarde.
              </p>
            </div>
            <Link 
              href="/explorar"
              className="mt-2 w-full py-3.5 bg-slate-900 text-white font-semibold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Ver otros negocios {">"}
            </Link>
          </div>
        </div>
      )}

      <CraveHeaderCompact 
        isScrolled={isScrolled} 
        logoUrl={logoUrl} 
        name={businessName} 
        isOpen={isOpen} 
        rating={rating} 
        distance={distance} 
        votesCount={votesCount}
      />

      <div 
        onScroll={(e) => {
          const scrollTop = e.currentTarget.scrollTop;
          setIsScrolled(scrollTop > 120);
        }}
        className="flex-1 overflow-y-auto relative"
      >
        {/* BLOQUE 2: HEADER Y BRANDING V3 */}
        
        {/* 2.3 SLIDER DE BANNERS */}
        <MenuHeroSliderV2 
          banners={banners.map(b => ({ id: String(b.id), image_url: b.image_url }))} 
          fallbackImage={business.banner_url || logoUrl} 
          businessName={businessName} 
          showBackButton={false} 
        />

        {/* 2.1 & 2.2 IDENTITY BAR (Logo-Left / Text-Right) */}
        <CraveBusinessHeader 
          logoUrl={logoUrl} 
          name={businessName} 
          isOpen={isOpen} 
          rating={rating} 
          distance={distance} 
          votesCount={votesCount}
        />

        {/* BLOQUE 3: BÚSQUEDA Y NAVEGACIÓN */}
        <div className="px-6 mt-8 space-y-6">
          <CraveSearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          <CraveCategoryBar 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onCategorySelect={setSelectedCategory} 
            accentColor={accentColor}
          />
        </div>

        {/* BLOQUE 4: LA JOYA DE LA CORONA - PRODUCT CARD V3 */}
        <div className="px-4 pb-8 mt-4">
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 p-3 space-y-3 animate-pulse">
                  <div className="h-28 w-full bg-slate-200/50 rounded-2xl animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200/60 rounded-full w-5/6 animate-pulse" />
                    <div className="h-3 bg-slate-200/40 rounded-full w-2/3 animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-5 bg-slate-200/60 rounded-full w-1/3 animate-pulse" />
                    <div className="w-8 h-8 rounded-full bg-slate-200/60 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.filter((p) => p.in_stock !== false).length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {products.filter((p) => p.in_stock !== false).map((product) => (
                <LazyWrapper key={product.id}>
                  <CraveProductCard
                    product={product}
                    onSelect={() => setSelectedDetailProduct(product)}
                    onAddToCart={() => handleAddToCart(product)}
                    accentColor={accentColor}
                    isFavorite={isProductFavorite(product.id)}
                    onToggleFavorite={() => toggleFavorite(product.id)}
                  />
                </LazyWrapper>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-bold uppercase tracking-wider">No se encontraron productos</p>
            </div>
          )}
        </div>

        {/* BLOQUE 4.5: MARKETING BANNERS (Fase 19.3.6) */}
        <AutoScrollBanners />

        {/* BLOQUE 4.6: PIE DE PÁGINA (Fase 22.1.1 & 22.1.2) */}
        <Footer extraPaddingBottom={flatCartItems.length > 0 && !isCartOpen} />
      </div>

      {/* BLOQUE 5: LA EXPERIENCIA DEL CARRITO (MAGIC PILL & BOTTOM SHEET) */}
      <CraveMagicCart
        cartItems={flatCartItems}
        onClick={() => setIsCartOpen(true)}
        accentColor={accentColor}
        isVisible={flatCartItems.length > 0 && !isCartOpen}
      />

      <CraveCheckoutSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={flatCartItems}
        onAddOne={handleAddOne}
        onRemoveOne={handleRemoveOne}
        accentColor={accentColor}
        businessName={businessName}
        businessPhone={business?.phone}
        businessId={business?.id}
        isBusinessOpen={isOpen}
      />

      {/* DETALLES DE PRODUCTO - POPUP ULTRA PREMIUM */}
      <AnimatePresence>
        {selectedDetailProduct && (
          <CraveProductDetailModal
            product={selectedDetailProduct}
            onClose={() => setSelectedDetailProduct(null)}
            onAddToCart={handleAddToCart}
            accentColor={accentColor}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
