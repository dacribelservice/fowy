"use client";

import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageCircle,
  Star,
  TrendingUp,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useOrderManager } from "@/hooks/useOrderManager";
import { parseSafeDate } from "@/utils/bogotaTimeUtils";
import { useMounted } from "@/hooks/useMounted";



const supabase = createClient();
const formatCurrency = (val: number) => `$${new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0 }).format(val)}`;

export default function OrdersPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessRating, setBusinessRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const mounted = useMounted();

  
  const { 
    orders, 
    loading: loadingOrders, 
    isSoundActive,
    toggleSound,
    updateOrderStatus 
  } = useOrderManager(businessId);

  useEffect(() => {
    const fetchBusinessData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('businesses')
        .select('id, rating')
        .eq('owner_id', user.id)
        .single();

      if (business) {
        setBusinessId(business.id);
        setBusinessRating(business.rating || 0);

        // Fetch rating count
        const { count, error } = await supabase
          .from('business_ratings')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', business.id);

        if (!error && count !== null) {
          setRatingCount(count);
        }
      }
    };

    fetchBusinessData();
  }, []);

  const loading = !businessId || loadingOrders;

  // Cálculos dinámicos de los KPIs basados en tiempo real
  const totalCompletedSales = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Pedidos en Tiempo Real 🛒
          </h2>
          <p className="text-slate-500 mt-2">
            Gestiona tus pedidos entrantes y actualiza su estado al instante.
          </p>

          {/* Calificación del Negocio */}
          {businessRating !== null && (
            <div className="flex items-center gap-3.5 mt-3 px-1">
              <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-700 border border-amber-500/10 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="text-[13px]">
                  {ratingCount > 0 && businessRating > 0 ? businessRating.toFixed(1) : "0.0"}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFull = ratingCount > 0 && businessRating > 0 && starVal <= Math.round(businessRating);
                  return (
                    <Star
                      key={starVal}
                      className={`w-4 h-4 ${
                        isFull 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-slate-200 fill-slate-50"
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {ratingCount === 0 
                  ? "(0) Aún sin calificaciones de clientes" 
                  : `(${ratingCount} ${ratingCount === 1 ? "opinión" : "opiniones"})`
                }
              </span>
            </div>
          )}

          {/* Conexión y Control de Sonido (Cilíndricos y apilados verticalmente debajo del ranking) */}
          <div className="flex flex-col items-start gap-2.5 mt-4 px-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-bold border border-green-100 w-fit">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Conectado en vivo
            </div>

            <button
              onClick={toggleSound}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-[0.98] w-fit ${
                isSoundActive
                  ? "bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600"
                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {isSoundActive ? (
                <>
                  <Volume2 size={16} className="animate-pulse" />
                  <span>Sonido Activo</span>
                </>
              ) : (
                <>
                  <VolumeX size={16} />
                  <span>Sonido Inactivo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fowy-secondary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tarjetas de Resumen KPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Total Ventas Completadas */}
            <div className="glass-morphism p-5 rounded-fowy border border-slate-100/80 shadow-sm flex items-center justify-between bg-gradient-to-br from-white/95 to-slate-50/30">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Total Ventas Completadas</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {formatCurrency(totalCompletedSales)}
                </h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-tr from-[#FF5A5F] to-[#FF9A3D] text-white rounded-2xl flex items-center justify-center shadow-md shadow-[#FF5A5F]/20">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            {/* Card Pedidos Pendientes */}
            <div className="glass-morphism p-5 rounded-fowy border border-slate-100/80 shadow-sm flex items-center justify-between bg-gradient-to-br from-white/95 to-slate-50/30">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Pedidos Pendientes</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {pendingOrdersCount}
                </h3>
              </div>
              <div className="w-12 h-12 bg-orange-50 text-[#FF5A5F] border border-orange-100/50 rounded-2xl flex items-center justify-center shadow-sm">
                <Clock className="w-6 h-6 text-[#FF5A5F]" />
              </div>
            </div>
          </div>

          {/* Grilla de Pedidos */}
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {orders.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-morphism p-12 rounded-fowy text-center"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700">Sin pedidos aún</h3>
                  <p className="text-slate-500">Los pedidos que recibas aparecerán aquí con un sonido de caja registradora.</p>
                </motion.div>
              ) : (
                orders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-morphism p-6 rounded-fowy shadow-glass border-l-4 border-l-fowy-secondary flex flex-col md:flex-row items-start md:items-center gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                          order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {order.status === 'pending' ? 'Pendiente' : 
                           order.status === 'completed' ? 'Completado' : 'Cancelado'}
                        </span>
                        {/* Valor de la venta (pedido) */}
                        <span className="text-[11px] font-black px-2.5 py-0.5 bg-orange-50/80 border border-orange-100/50 text-[#FF5A5F] rounded-full shadow-sm">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">{order.customer_name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <div className="flex items-center gap-1" suppressHydrationWarning>
                          <Clock size={14} />
                          {mounted ? parseSafeDate(order.created_at).toLocaleTimeString() : ""}
                        </div>
                        <div className="flex items-center gap-1 text-fowy-secondary font-medium">
                          <MessageCircle size={14} />
                          {order.customer_phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      {order.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-fowy-secondary text-white rounded-xl font-bold shadow-premium hover:opacity-90 transition-all"
                          >
                            <CheckCircle2 size={18} />
                            Completar
                          </button>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-red-500 border border-red-100 rounded-xl font-bold hover:bg-red-50 transition-all"
                          >
                            <XCircle size={18} />
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
