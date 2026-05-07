"use client";

import { useParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useCart } from "@/hooks/useCart";

import { CraveHeaderCompact } from "@/components/explorer/CraveHeaderCompact";
import { MenuHeroSliderV2 } from "@/components/explorer/MenuHeroSliderV2";
import { CraveBusinessHeader } from "@/components/explorer/CraveBusinessHeader";
import { CraveSearchBar } from "@/components/explorer/CraveSearchBar";
import { CraveCategoryBar } from "@/components/explorer/CraveCategoryBar";
import { CraveProductCard } from "@/components/explorer/CraveProductCard";
import { CraveProductDetailModal } from "@/components/explorer/CraveProductDetailModal";
import { CraveMagicCart } from "@/components/explorer/CraveMagicCart";
import { CraveCheckoutSheet } from "@/components/explorer/CraveCheckoutSheet";

/**
 * BusinessMenuPage: El nuevo molde de producción premium de Crave Vision.
 * Totalmente modularizado, tipo-seguro y conectado en tiempo real al core de FOWY.
 */
export default function BusinessMenuPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<any | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Database States
  const [business, setBusiness] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [productsLoading, setProductsLoading] = useState(true);

  const supabase = createClient();

  // Debounce search query to optimize server requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      try {
        setLoading(true);

        // Fetch Business
        const { data: busData, error: busError } = await supabase
          .from("businesses")
          .select("*")
          .eq("slug", slug)
          .single();

        if (busError || !busData) {
          console.error("Business not found in Production Menu:", busError);
          return;
        }
        setBusiness(busData);

        // Fetch Categories
        const { data: catData } = await supabase
          .from("product_menu_categories")
          .select("*")
          .eq("business_id", busData.id)
          .order("order_index", { ascending: true });

        setCategories(catData || []);



        // Fetch Banners
        const { data: bannersData } = await supabase
          .from("business_banners")
          .select("*")
          .eq("business_id", busData.id)
          .order("order_index", { ascending: true });

        setBanners(bannersData || []);
      } catch (error) {
        console.error("Error fetching data in Production Menu:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, supabase]);

  // Reactive Server-Side Products Filtering
  useEffect(() => {
    if (!business?.id) return;

    async function fetchFilteredProducts() {
      try {
        setProductsLoading(true);
        let query = supabase
          .from("products")
          .select("*")
          .eq("business_id", business.id)
          .eq("is_active", true);

        // Category Filter
        if (selectedCategory !== "all") {
          const activeCat = categories.find((c) => c.id === selectedCategory);
          if (activeCat) {
            query = query.eq("category_name", activeCat.name);
          }
        }

        // Search Query Filter
        if (debouncedSearchQuery) {
          query = query.or(
            `name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`
          );
        }

        // Order by category name
        query = query.order("category_name", { ascending: true });

        const { data, error } = await query;
        if (error) {
          console.error("Error fetching filtered products:", error);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Error in fetchFilteredProducts:", err);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [business?.id, debouncedSearchQuery, selectedCategory, categories, supabase]);

  // Analytics: Record Visit
  const recordVisit = useCallback(async (businessId: string) => {
    try {
      await supabase.from("analytics_visits").insert({
        business_id: businessId,
        path: window.location.pathname,
        user_agent: navigator.userAgent,
        referrer: document.referrer || "direct"
      });
    } catch (e) {
      console.error("Error recording visit:", e);
    }
  }, [supabase]);

  useEffect(() => {
    if (business?.id) {
      recordVisit(business.id);
    }
  }, [business?.id, recordVisit]);

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
    return (
      <div className="absolute inset-0 bg-[#ededed] overflow-y-auto flex flex-col scrollbar-hide pb-10">
        {/* Banner Slider Skeleton */}
        <div className="w-full h-[21rem] bg-gradient-to-br from-slate-200/50 to-slate-300/30 animate-pulse relative flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-transparent rounded-full animate-spin absolute" />
        </div>

        {/* Business Header Skeleton */}
        <div className="relative px-6 -mt-14 z-20 flex items-start gap-5 animate-pulse">
          {/* Logo Circle Skeleton */}
          <div className="w-28 h-28 rounded-full border-[5px] border-white bg-gradient-to-br from-slate-200 to-slate-300/80 shadow-sm shrink-0" />

          {/* Details Skeleton */}
          <div className="pt-16 flex-1 space-y-3">
            <div className="h-6 bg-slate-300/60 rounded-full w-3/4" />
            <div className="flex gap-4">
              <div className="h-4 bg-slate-300/60 rounded-full w-1/4" />
              <div className="h-4 bg-slate-300/60 rounded-full w-1/4" />
            </div>
          </div>
        </div>

        {/* Search & Categories Skeleton */}
        <div className="px-6 mt-8 space-y-6 animate-pulse">
          {/* Search Bar Skeleton */}
          <div className="h-12 bg-white/60 backdrop-blur-md rounded-full w-full border border-white/40" />
          
          {/* Categories Bar Skeleton */}
          <div className="flex gap-3 overflow-x-hidden">
            <div className="h-8 bg-white/60 backdrop-blur-md rounded-full w-16 shrink-0 border border-white/40" />
            <div className="h-8 bg-white/60 backdrop-blur-md rounded-full w-24 shrink-0 border border-white/40" />
            <div className="h-8 bg-white/60 backdrop-blur-md rounded-full w-20 shrink-0 border border-white/40" />
            <div className="h-8 bg-white/60 backdrop-blur-md rounded-full w-28 shrink-0 border border-white/40" />
          </div>
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="px-4 mt-6 flex-1 animate-pulse">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 overflow-hidden flex flex-col p-3 space-y-3">
                {/* Image placeholder */}
                <div className="h-28 w-full bg-slate-200/50 rounded-2xl" />
                {/* Title & Desc placeholder */}
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200/60 rounded-full w-5/6" />
                  <div className="h-3 bg-slate-200/40 rounded-full w-2/3" />
                </div>
                {/* Footer placeholder */}
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-slate-200/60 rounded-full w-1/3" />
                  <div className="w-8 h-8 rounded-full bg-slate-200/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center gap-6">
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Menú No Disponible</h1>
        <p className="text-sm text-slate-500">No pudimos encontrar este negocio o el enlace no es válido.</p>
        <button 
          onClick={() => router.push("/explorar")}
          className="px-6 py-3 bg-slate-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest cursor-pointer hover:bg-slate-800 transition-colors"
        >
          Volver a Explorar
        </button>
      </div>
    );
  }

  const accentColor = business.color_identity || "#FF5A5F";
  const logoUrl = business.logo_url || "";
  const businessName = business.name || "";
  const isOpen = business.is_open ?? true;
  const rating = business.rating || 4.8;
  const distance = business.distance || "1.2 km";



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
      <CraveHeaderCompact 
        isScrolled={isScrolled} 
        logoUrl={logoUrl} 
        name={businessName} 
        isOpen={isOpen} 
        rating={rating} 
        distance={distance} 
      />

      <div 
        onScroll={(e) => {
          const scrollTop = e.currentTarget.scrollTop;
          setIsScrolled(scrollTop > 120);
        }}
        className="flex-1 overflow-y-auto pb-20 relative"
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
        <div className="px-4 pb-24 mt-4">
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
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <CraveProductCard
                  key={product.id}
                  product={product}
                  onSelect={() => setSelectedDetailProduct(product)}
                  onAddToCart={() => handleAddToCart(product)}
                  accentColor={accentColor}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-bold uppercase tracking-wider">No se encontraron productos</p>
            </div>
          )}
        </div>
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
