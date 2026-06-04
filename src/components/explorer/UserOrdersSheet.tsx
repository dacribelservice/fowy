"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Store, Calendar, ChevronDown, ChevronUp, RefreshCw, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { parseSafeDate } from "@/utils/bogotaTimeUtils";
import { useMounted } from "@/hooks/useMounted";



export interface UserOrdersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onReorder?: (items: any[], businessId: string, businessName: string) => void;
}

export function UserOrdersSheet({
  isOpen,
  onClose,
  onReorder,
}: UserOrdersSheetProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const mounted = useMounted();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed" | "cancelled">("all");
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({});
  
  // Pagination State (Fase 15.9.4)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Rating State (Fase 15.9.5)
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});
  const [ratingLoading, setRatingLoading] = useState<Record<string, boolean>>({});

  const supabase = createClient();
  const ITEMS_PER_PAGE = 5;

  const fetchOrders = async (userId: string, targetPage: number, append: boolean = false) => {
    if (targetPage === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const fromIndex = (targetPage - 1) * ITEMS_PER_PAGE;
      const toIndex = fromIndex + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("orders")
        .select(`
          id,
          business_id,
          customer_name,
          customer_phone,
          items,
          total_amount,
          status,
          created_at,
          businesses (
            id,
            name,
            logo_url,
            color_identity
          )
        `, { count: "exact" })
        .eq("customer_id", userId);

      if (activeTab !== "all") {
        query = query.eq("status", activeTab);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(fromIndex, toIndex);

      if (error) throw error;

      if (data) {
        const formatted = data.map((order: any) => {
          const biz = order.businesses;
          return {
            id: order.id,
            business_id: order.business_id,
            business_name: biz?.name || "Negocio",
            business_logo: biz?.logo_url || "",
            business_color: biz?.color_identity || "#FF5A5F",
            items: Array.isArray(order.items) ? order.items : [],
            total_amount: Number(order.total_amount),
            status: order.status || "pending",
            created_at: order.created_at,
          };
        });

        if (append) {
          setOrders((prev) => [...prev, ...formatted]);
        } else {
          setOrders(formatted);
        }

        const totalCountVal = count || 0;
        setTotalCount(totalCountVal);
        
        // Determine if there are more items using standard offset index bounds
        setHasMore(toIndex + 1 < totalCountVal);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchUserRatings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("business_ratings")
        .select("business_id, rating")
        .eq("user_id", userId);
      if (error) throw error;
      if (data) {
        const ratingMap: Record<string, number> = {};
        data.forEach((r: any) => {
          ratingMap[r.business_id] = r.rating;
        });
        setUserRatings(ratingMap);
      }
    } catch (err) {
      console.error("Error fetching user ratings:", err);
    }
  };

  const handleRateBusiness = async (businessId: string, orderId: string, score: number) => {
    if (!user) return;
    setRatingLoading((prev) => ({ ...prev, [businessId]: true }));
    try {
      const { error } = await supabase
        .from("business_ratings")
        .upsert({
          business_id: businessId,
          user_id: user.id,
          order_id: orderId,
          rating: score,
        }, { onConflict: "user_id,business_id" });

      if (error) throw error;

      setUserRatings((prev) => ({ ...prev, [businessId]: score }));
    } catch (err) {
      console.error("Error registering business rating:", err);
    } finally {
      setRatingLoading((prev) => ({ ...prev, [businessId]: false }));
    }
  };

  // Manage auth state
  useEffect(() => {
    let active = true;

    const initAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (active) {
        setUser(authUser);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (active) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Fetch orders when user, isOpen, or activeTab changes
  useEffect(() => {
    if (user && isOpen) {
      setPage(1);
      fetchOrders(user.id, 1, false);
      fetchUserRatings(user.id);
    } else if (!isOpen) {
      // Clear data when closed to avoid stale data next time
      setOrders([]);
      setPage(1);
      setHasMore(false);
      setTotalCount(0);
      setUserRatings({});
      setHoveredStars({});
      setRatingLoading({});
    }
  }, [user, isOpen, activeTab]);

  // Escuchar evento global cuando se crea un pedido nuevo desde el checkout
  useEffect(() => {
    const handleOrderCreated = () => {
      if (user) {
        setPage(1);
        fetchOrders(user.id, 1, false);
      }
    };
    window.addEventListener("fowy:order-created", handleOrderCreated);
    return () => {
      window.removeEventListener("fowy:order-created", handleOrderCreated);
    };
  }, [user]);

  const handleLoadMore = () => {
    if (user && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(user.id, nextPage, true);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderIds((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getStatusLabelAndStyles = (status: string, accentColor: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "completado":
        return {
          label: "Completado",
          classes: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        };
      case "cancelled":
      case "cancelado":
        return {
          label: "Cancelado",
          classes: "bg-rose-50 text-rose-600 border border-rose-100",
        };
      default:
        return {
          label: "Pendiente",
          classes: "bg-amber-50 text-amber-600 border border-amber-100",
        };
    }
  };

  const formatDate = (dateString: string) => {
    if (!mounted) return "";
    try {
      const date = parseSafeDate(dateString);
      return date.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
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

          {/* Bottom/Side Sheet Premium con Glassmorphism */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-[140] rounded-t-[40px] overflow-hidden flex flex-col max-h-[85%]"
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
            <div className="w-full pt-3 pb-4 px-6 shrink-0 flex flex-col items-center border-b border-white/20">
              <div className="w-12 h-1.5 bg-slate-400/30 rounded-full mb-4" />
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5.5 h-5.5 text-slate-800" />
                  <h2 className="text-[20px] font-black text-slate-900 tracking-tight">
                    Mis Pedidos
                  </h2>
                  {totalCount > 0 && (
                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white shadow-sm">
                      {totalCount}
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

              {/* Selector de Pestañas (Filtros de Estado) */}
              <div className="w-full mt-4 flex gap-1.5 bg-slate-500/10 p-1 rounded-2xl border border-white/20">
                {(["all", "pending", "completed", "cancelled"] as const).map((tab) => {
                  const label =
                    tab === "all"
                      ? "Todos"
                      : tab === "pending"
                      ? "Pendientes"
                      : tab === "completed"
                      ? "Completados"
                      : "Cancelados";
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contenido Dinámico */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide max-h-[55vh]">
              {loading && orders.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-3 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Cargando tu historial...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const statusInfo = getStatusLabelAndStyles(order.status, order.business_color);
                    const isExpanded = !!expandedOrderIds[order.id];

                    return (
                      <div
                        key={order.id}
                        className="bg-white/50 rounded-3xl border border-white/40 backdrop-blur-sm shadow-sm hover:bg-white/60 transition-all overflow-hidden"
                      >
                        {/* Cabecera del Pedido */}
                        <div
                          onClick={() => toggleExpand(order.id)}
                          className="p-4 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Logo Comercio */}
                            <div className="w-11 h-11 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-white/60 flex items-center justify-center">
                              {order.business_logo ? (
                                <img
                                  src={order.business_logo}
                                  alt={order.business_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Store className="w-5 h-5 text-slate-400" />
                              )}
                            </div>

                            {/* Info de Negocio y Fecha */}
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-[14px] leading-tight truncate">
                                {order.business_name}
                              </h4>
                              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span suppressHydrationWarning>{formatDate(order.created_at)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Badge de Estado y Flecha */}
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${statusInfo.classes}`}>
                              {statusInfo.label}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Detalle Desplegable */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="border-t border-white/20 bg-white/20"
                            >
                              <div className="p-4 space-y-3.5">
                                {/* Lista de Ítems */}
                                <div className="space-y-2">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Platos Ordenados</span>
                                  <div className="space-y-2.5">
                                    {order.items.map((item: any, idx: number) => (
                                      <div key={idx} className="flex justify-between items-center text-[13px]">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <span className="font-extrabold text-slate-500 bg-slate-400/10 w-5.5 h-5.5 rounded-lg flex items-center justify-center text-[11px] shrink-0">
                                            {item.quantity || 1}x
                                          </span>
                                          <span className="font-semibold text-slate-800 truncate">
                                            {item.name}
                                          </span>
                                        </div>
                                        <span className="font-bold text-slate-900 shrink-0">
                                          ${((item.price || 0) * (item.quantity || 1)).toLocaleString("es-CO")}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Resumen del total */}
                                <div className="flex justify-between items-center pt-3 border-t border-slate-500/10">
                                  <span className="font-black uppercase text-[10px] tracking-wider text-slate-400">Total del Pedido</span>
                                  <span className="font-black text-slate-900 text-[16px]">
                                    ${order.total_amount.toLocaleString("es-CO")}
                                  </span>
                                </div>

                                {/* Acciones del Pedido */}
                                <div className="flex gap-2 pt-1.5">
                                  {onReorder && order.items.length > 0 && (
                                    <button
                                      onClick={() => {
                                        onReorder(order.items, order.business_id, order.business_name);
                                      }}
                                      className="flex-1 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[12px] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                      Repetir Pedido
                                    </button>
                                  )}
                                  
                                  {/* Sistema de Calificación Directa (Fase 15.9.5) */}
                                  {(order.status === "completed" || order.status === "completado") && (
                                    userRatings[order.business_id] !== undefined ? (
                                      <div className="flex-1 py-2 px-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-700 text-[11px] font-black uppercase tracking-wider flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                          Calificado
                                        </span>
                                        <div className="flex gap-0.5">
                                          {[1, 2, 3, 4, 5].map((starValue) => (
                                            <Star
                                              key={starValue}
                                              className={`w-3 h-3 ${
                                                starValue <= userRatings[order.business_id]
                                                  ? "fill-amber-500 text-amber-500"
                                                  : "text-amber-500/20"
                                              }`}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex-1 py-1.5 px-3 rounded-2xl bg-white border border-slate-100 flex items-center justify-between shadow-xs">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                          Calificar
                                        </span>
                                        <div className="flex gap-1 items-center">
                                          {[1, 2, 3, 4, 5].map((starValue) => {
                                            const isHovered = (hoveredStars[order.business_id] || 0) >= starValue;
                                            const isLoading = !!ratingLoading[order.business_id];

                                            return (
                                              <button
                                                key={starValue}
                                                disabled={isLoading}
                                                onMouseEnter={() => !isLoading && setHoveredStars((prev) => ({ ...prev, [order.business_id]: starValue }))}
                                                onMouseLeave={() => !isLoading && setHoveredStars((prev) => ({ ...prev, [order.business_id]: 0 }))}
                                                onClick={() => handleRateBusiness(order.business_id, order.id, starValue)}
                                                className="transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                                              >
                                                <Star
                                                  className={`w-4.5 h-4.5 transition-colors duration-150 ${
                                                    isHovered
                                                      ? "fill-amber-400 text-amber-400"
                                                      : "text-slate-300 hover:text-amber-300"
                                                  }`}
                                                />
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  {/* Botón de Cargar Más con Estética Glassmorphism (Fase 15.9.4) */}
                  {hasMore && (
                    <div className="pt-2 flex justify-center pb-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-3 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/60 text-slate-800 text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        {loadingMore ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                            Cargando...
                          </>
                        ) : (
                          "Cargar más pedidos"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-wider">Aún no tienes pedidos</p>
                    <p className="text-slate-400 text-xs max-w-[200px] leading-relaxed">Realiza tu primer pedido y visualiza el historial de compras en tiempo real aquí.</p>
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
