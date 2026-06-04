"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, Plus, X, Store, ShoppingBag } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export interface UserFavoritesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: any) => void;
  onSelectProduct?: (product: any) => void;
}

export function UserFavoritesSheet({
  isOpen,
  onClose,
  onAddToCart,
  onSelectProduct,
}: UserFavoritesSheetProps) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  const fetchFavorites = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_favorites")
        .select(`
          id,
          product_id,
          products (
            id,
            name,
            description,
            price,
            image_url,
            business_id,
            businesses (
              id,
              name,
              logo_url,
              color_identity
            )
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;

      if (data) {
        const formatted = data
          .filter((item: any) => item.products !== null)
          .map((item: any) => {
            const prod = item.products;
            const biz = prod.businesses;
            return {
              id: prod.id,
              favorite_id: item.id,
              name: prod.name,
              description: prod.description,
              price: prod.price,
              image_url: prod.image_url,
              business_id: prod.business_id,
              business_name: biz?.name || "Negocio",
              business_logo: biz?.logo_url || "",
              business_color: biz?.color_identity || "#FF5A5F"
            };
          });
        setFavorites(formatted);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check auth and fetch when open
  useEffect(() => {
    let active = true;

    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (active) {
        setUser(user);
        if (user && isOpen) {
          await fetchFavorites(user.id);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      const newUser = session?.user ?? null;
      if (active) {
        setUser(newUser);
        if (newUser && isOpen) {
          fetchFavorites(newUser.id);
        }
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [isOpen, supabase]);

  const handleRemoveFavorite = async (productId: string) => {
    if (!user) return;

    // Optimistic UI update
    setFavorites((prev) => prev.filter((item) => item.id !== productId));

    try {
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("product_id", productId)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (err) {
      console.error("Error removing favorite:", err);
      // Re-fetch if something fails to keep sync
      fetchFavorites(user.id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-[130]"
          />

          {/* Bottom/Side Sheet Premium de Favoritos con Glassmorphism */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-[140] rounded-t-[40px] overflow-hidden flex flex-col max-h-[80%]"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.3) 100%)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              borderTop: "2px solid rgba(255, 255, 255, 0.9)",
              borderBottom: "none",
              boxShadow: "0 -20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            {/* Drag Handle & Header */}
            <div className="w-full pt-3 pb-5 px-6 shrink-0 flex flex-col items-center border-b border-white/20">
              <div className="w-12 h-1.5 bg-slate-400/30 rounded-full mb-4" />
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Heart className="w-5.5 h-5.5 text-red-500 fill-red-500" />
                  <h2 className="text-[20px] font-black text-slate-900 tracking-tight">
                    Mis Favoritos
                  </h2>
                  {favorites.length > 0 && (
                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white shadow-sm">
                      {favorites.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* Contenido Dinámico */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide max-h-[50vh]">
              {loading && favorites.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-3 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Cargando tus favoritos...</p>
                </div>
              ) : favorites.length > 0 ? (
                <div className="space-y-4">
                  {favorites.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-white/50 p-3.5 rounded-3xl border border-white/40 backdrop-blur-sm shadow-sm hover:bg-white/60 transition-all group"
                    >
                      <div
                        onClick={() => onSelectProduct && onSelectProduct(item)}
                        className="flex items-center gap-3.5 cursor-pointer min-w-0 flex-1"
                      >
                        {/* Imagen del Producto */}
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-white/50 relative">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Detalles */}
                        <div className="flex flex-col min-w-0 flex-1">
                          {/* Identificación de Comercio (Logo/Nombre) */}
                          <div className="flex items-center gap-1.5 mb-1">
                            {item.business_logo ? (
                              <img
                                src={item.business_logo}
                                alt={item.business_name}
                                className="w-3.5 h-3.5 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <Store className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 truncate max-w-[120px]">
                              {item.business_name}
                            </span>
                          </div>

                          <span className="font-bold text-slate-900 text-[14px] leading-tight truncate">
                            {item.name}
                          </span>
                          <span className="text-[13px] font-black text-slate-800 mt-0.5">
                            ${item.price.toLocaleString("es-CO")}
                          </span>
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Eliminar Favorito */}
                        <button
                          onClick={() => handleRemoveFavorite(item.id)}
                          className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-all duration-200 active:scale-90 text-rose-500 cursor-pointer border border-rose-100/50"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                        </button>

                        {/* Agregar al Carrito */}
                        <button
                          onClick={() => onAddToCart(item)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-90 border border-white/10 cursor-pointer"
                          style={{
                            background: `linear-gradient(135deg, ${item.business_color}e6 0%, ${item.business_color} 100%)`,
                            boxShadow: `0 4px 10px ${item.business_color}40`
                          }}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-wider">Aún no tienes favoritos</p>
                    <p className="text-slate-400 text-xs max-w-[200px] leading-relaxed">Explora el menú y toca el corazón para guardar tus platos favoritos aquí.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
