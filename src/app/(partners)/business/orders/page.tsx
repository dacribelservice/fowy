"use client";

import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useOrderManager } from "@/hooks/useOrderManager";

const supabase = createClient();

export default function OrdersPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  const { 
    orders, 
    loading: loadingOrders, 
    updateOrderStatus 
  } = useOrderManager(businessId);

  useEffect(() => {
    const fetchBusinessId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (business) setBusinessId(business.id);
    };

    fetchBusinessId();
  }, []);

  const loading = !businessId || loadingOrders;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Pedidos en Tiempo Real 🛒
          </h2>
          <p className="text-slate-500 mt-2">
            Gestiona tus pedidos entrantes y actualiza su estado al instante.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-bold border border-green-100">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Conectado en vivo
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fowy-secondary"></div>
        </div>
      ) : (
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
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{order.customer_name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(order.created_at).toLocaleTimeString()}
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
                    <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
