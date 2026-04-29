"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  ShieldAlert,
  Loader2,
  ExternalLink,
  Gavel,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolutionText, setResolutionText] = useState("");
  const [processing, setProcessing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          *,
          order:service_orders (
            *,
            business:businesses(name, logo_url),
            professional:profiles!professional_id(full_name, avatar_url)
          ),
          raised_by_profile:profiles!raised_by(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDisputes(data || []);
    } catch (error: any) {
      console.error("Error fetching disputes:", error);
      toast.error("Error al cargar disputas");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (status: 'resolved' | 'closed', resolution: string, action?: 'release' | 'refund') => {
    if (!resolution) {
      toast.error("Debes proporcionar una resolución");
      return;
    }

    try {
      setProcessing(true);
      
      // 1. Update dispute
      const { error: disputeError } = await supabase
        .from('disputes')
        .update({ 
          status, 
          resolution, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', selectedDispute.id);

      if (disputeError) throw disputeError;

      // 2. Perform action on order if specified
      if (action === 'release') {
        await supabase
          .from('service_orders')
          .update({ status: 'funds_released' })
          .eq('id', selectedDispute.order_id);
      } else if (action === 'refund') {
        await supabase
          .from('service_orders')
          .update({ status: 'pending_payment' }) // Or a new 'refunded' state
          .eq('id', selectedDispute.order_id);
      }

      toast.success("Disputa resuelta con éxito");
      setSelectedDispute(null);
      setResolutionText("");
      fetchDisputes();
    } catch (error: any) {
      console.error("Error resolving dispute:", error);
      toast.error("Error al resolver la disputa");
    } finally {
      setProcessing(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Centro de Disputas</h1>
          <p className="text-slate-500">Gestión de conflictos en el Marketplace de Expertos.</p>
        </div>
        <div className="bg-amber-100 text-amber-600 px-6 py-3 rounded-2xl flex items-center gap-3 font-bold shadow-sm">
          <ShieldAlert size={24} />
          {disputes.filter(d => d.status === 'open').length} Disputas Abiertas
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-1 space-y-4">
          {disputes.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-[2rem] border border-slate-100">
              <CheckCircle2 className="mx-auto text-green-200 mb-4" size={48} />
              <p className="text-slate-500 font-bold">No hay disputas activas.</p>
            </div>
          ) : (
            disputes.map((dispute) => (
              <motion.div
                key={dispute.id}
                onClick={() => setSelectedDispute(dispute)}
                className={`p-6 rounded-[2rem] border transition-all cursor-pointer ${
                  selectedDispute?.id === dispute.id 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                    : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    dispute.status === 'open' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {dispute.status === 'open' ? 'Abierta' : 'Resuelta'}
                  </span>
                  <span className="text-[10px] opacity-50 font-bold">
                    {new Date(dispute.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className={`font-black mb-1 ${selectedDispute?.id === dispute.id ? 'text-white' : 'text-slate-800'}`}>
                  Orden #{dispute.order_id.slice(0, 8)}
                </h4>
                <p className={`text-xs line-clamp-2 ${selectedDispute?.id === dispute.id ? 'text-slate-400' : 'text-slate-500'}`}>
                  {dispute.reason}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">
                    Por: {dispute.raised_by_profile?.full_name}
                  </span>
                  <ChevronRight size={16} />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedDispute ? (
              <motion.div
                key={selectedDispute.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                      <Gavel className="text-fowy-secondary" />
                      Detalle de la Disputa
                    </h3>
                    <button 
                      onClick={() => setSelectedDispute(null)}
                      className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      <XCircle size={24} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden">
                        <img src={selectedDispute.order?.business?.logo_url} className="w-full h-full object-cover" alt="biz" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Negocio</p>
                        <p className="font-bold text-slate-800">{selectedDispute.order?.business?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden">
                        <img src={selectedDispute.order?.professional?.avatar_url} className="w-full h-full object-cover" alt="pro" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experto</p>
                        <p className="font-bold text-slate-800">{selectedDispute.order?.professional?.full_name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-500" /> Motivo de la disputa
                    </h4>
                    <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 text-slate-700 italic">
                      "{selectedDispute.reason}"
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <MessageSquare size={16} className="text-blue-500" /> Información de la Orden
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Servicio</p>
                        <p className="font-bold text-slate-800">{selectedDispute.order?.plan_name}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monto Total</p>
                        <p className="font-bold text-slate-800">${selectedDispute.order?.amount}</p>
                      </div>
                      {selectedDispute.order?.delivery_url && (
                        <div className="col-span-2">
                          <a 
                            href={selectedDispute.order.delivery_url} 
                            target="_blank" 
                            className="flex items-center justify-center gap-2 w-full p-4 bg-fowy-blue text-white rounded-2xl font-bold hover:opacity-90 transition-all"
                          >
                            <ExternalLink size={18} /> Revisar Entrega Entregada
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedDispute.status === 'open' ? (
                    <div className="pt-6 border-t border-slate-100 space-y-6">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Resolución Administrativa</h4>
                      <textarea
                        value={resolutionText}
                        onChange={(e) => setResolutionText(e.target.value)}
                        placeholder="Describe la resolución y las acciones tomadas..."
                        className="w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100 focus:ring-2 ring-fowy-secondary/20 outline-none min-h-[120px] text-slate-700"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          disabled={processing}
                          onClick={() => handleResolve('resolved', resolutionText, 'release')}
                          className="py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg"
                        >
                          {processing ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                          Liberar al Experto
                        </button>
                        <button
                          disabled={processing}
                          onClick={() => handleResolve('resolved', resolutionText, 'refund')}
                          className="py-4 bg-red-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg"
                        >
                          {processing ? <Loader2 className="animate-spin" /> : <XCircle size={18} />}
                          Reembolsar al Negocio
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-3">Disputa Resuelta</h4>
                      <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100 text-slate-700">
                        {selectedDispute.resolution}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-40">
                <Gavel size={120} className="text-slate-200 mb-6" />
                <h3 className="text-2xl font-black text-slate-400">Selecciona una disputa</h3>
                <p className="text-slate-400 max-w-xs mx-auto mt-2">
                  Revisa los motivos y la evidencia de entrega para tomar una decisión justa.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
