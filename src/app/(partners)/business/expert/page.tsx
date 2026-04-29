"use client";

import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  DollarSign, 
  ShieldCheck,
  FileText,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function ExpertPanelPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          businesses (
            name,
            logo_url
          )
        `)
        .eq('professional_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Error al cargar tus pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDelivery = async (orderId: string) => {
    const url = prompt("Introduce la URL de entrega (Drive, Canva, etc.):");
    if (!url) return;

    try {
      setUpdating(orderId);
      const { error } = await supabase
        .from('service_orders')
        .update({ 
          delivery_url: url,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success("¡Entrega enviada!", {
        description: "El cliente ha sido notificado para revisar y liberar los fondos."
      });
      fetchOrders();
    } catch (error: any) {
      toast.error("Error al actualizar la entrega");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'bg-amber-100 text-amber-600';
      case 'in_escrow': return 'bg-blue-100 text-blue-600';
      case 'in_progress': return 'bg-indigo-100 text-indigo-600';
      case 'completed': return 'bg-green-100 text-green-600';
      case 'funds_released': return 'bg-fowy-secondary text-white';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'Esperando Pago';
      case 'in_escrow': return 'Pago en Custodia';
      case 'in_progress': return 'En Ejecución';
      case 'completed': return 'Esperando Revisión';
      case 'funds_released': return 'Fondos Pagados';
      case 'disputed': return 'En Disputa';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-fowy-secondary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-morphism p-6 rounded-[2rem] border border-white/40">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <Clock size={24} />
            </div>
            <span className="font-bold text-slate-500">Pendientes</span>
          </div>
          <p className="text-3xl font-black text-slate-800">
            {orders.filter(o => o.status !== 'funds_released').length}
          </p>
        </div>
        <div className="glass-morphism p-6 rounded-[2rem] border border-white/40">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <span className="font-bold text-slate-500">En Custodia</span>
          </div>
          <p className="text-3xl font-black text-slate-800">
            ${orders.filter(o => o.status === 'in_escrow' || o.status === 'completed').reduce((acc, o) => acc + o.professional_net, 0).toFixed(2)}
          </p>
        </div>
        <div className="glass-morphism p-6 rounded-[2rem] border border-white/40">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-fowy-secondary/10 text-fowy-secondary rounded-2xl">
              <DollarSign size={24} />
            </div>
            <span className="font-bold text-slate-500">Total Ganado</span>
          </div>
          <p className="text-3xl font-black text-slate-800">
            ${orders.filter(o => o.status === 'funds_released').reduce((acc, o) => acc + o.professional_net, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 px-2">Pedidos de Servicio</h3>
        {orders.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <FileText size={32} />
            </div>
            <p className="text-slate-500 font-medium">Aún no tienes pedidos asignados.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                layout
                className="glass-morphism p-6 rounded-[2.5rem] border border-white/40 flex flex-col md:flex-row items-center gap-6"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                  {order.businesses?.logo_url ? (
                    <img src={order.businesses.logo_url} className="w-full h-full object-cover" alt="biz" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-fowy-blue text-white font-bold">
                      {order.businesses?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h4 className="font-black text-slate-800 text-lg">{order.businesses?.name}</h4>
                  <p className="text-sm font-bold text-fowy-blue uppercase tracking-widest">{order.plan_name}</p>
                  <p className="text-xs text-slate-400 mt-1">ID: {order.id.slice(0, 8)}...</p>
                </div>

                <div className="px-6 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Tu Pago Neto</p>
                  <p className="text-xl font-black text-slate-800">${order.professional_net.toFixed(2)}</p>
                </div>

                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </div>

                <div className="flex gap-2">
                  {order.delivery_url && (
                    <a 
                      href={order.delivery_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-white text-slate-600 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                  {order.status !== 'funds_released' && order.status !== 'pending_payment' && (
                    <button 
                      disabled={updating === order.id}
                      onClick={() => handleUpdateDelivery(order.id)}
                      className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                    >
                      {updating === order.id ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                      {order.delivery_url ? 'Actualizar Entrega' : 'Enviar Entrega'}
                    </button>
                  )}
                  {order.status === 'pending_payment' && (
                    <div className="flex items-center gap-2 text-amber-500 font-bold text-sm px-4">
                      <AlertCircle size={18} />
                      Esperando que el negocio pague a FOWY
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Escrow Disclaimer */}
      <div className="p-8 rounded-[2rem] bg-fowy-blue text-white flex items-start gap-6 shadow-xl">
        <ShieldCheck size={40} className="shrink-0" />
        <div>
          <h4 className="text-lg font-bold mb-2">Garantía FOWY para Expertos</h4>
          <p className="text-fowy-blue-light/80 leading-relaxed text-sm">
            FOWY asegura tu pago. Una vez que el negocio acepta tu plan, los fondos se mueven a nuestra cuenta de custodia. 
            Tan pronto como entregues y el cliente marque como completado, los fondos se liberan a tu cuenta. 
            ¡Tú solo preocúpate por hacer un gran trabajo!
          </p>
        </div>
      </div>
    </div>
  );
}
