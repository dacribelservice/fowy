"use client";

import React from "react";
import { 
  Briefcase, Loader2, CreditCard, TrendingUp, ShieldCheck 
} from "lucide-react";

interface ExpertOrdersListProps {
  orders: any[];
  loading: boolean;
  onReleaseFunds: (orderId: string) => void;
  onExplore: () => void;
}

export const ExpertOrdersList: React.FC<ExpertOrdersListProps> = ({ 
  orders, 
  loading, 
  onReleaseFunds, 
  onExplore 
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-fowy-secondary" size={48} />
        <p className="text-slate-400 font-bold animate-pulse">Buscando tus contrataciones...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-20 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
        <Briefcase className="mx-auto text-slate-100 mb-6" size={80} />
        <h3 className="text-2xl font-black text-slate-800 mb-2">Sin proyectos activos</h3>
        <p className="text-slate-400 font-bold mb-8">Aún no has contratado a ningún experto para tu negocio.</p>
        <button 
          onClick={onExplore}
          className="px-10 py-4 bg-fowy-secondary text-white rounded-2xl font-black shadow-premium hover:scale-105 transition-all"
        >
          Explorar el Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {orders.map((order) => (
        <div key={order.id} className="glass-morphism p-10 rounded-[3rem] border border-white/40 flex flex-col lg:flex-row items-center gap-10 shadow-glass">
          <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-100 shrink-0 shadow-xl ring-4 ring-white">
            <img src={order.professional?.avatar_url} className="w-full h-full object-cover" alt="expert" />
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <h4 className="text-2xl font-black text-slate-800 mb-1">{order.professional?.full_name}</h4>
            <p className="text-sm font-black text-fowy-blue uppercase tracking-widest mb-6">{order.plan_name}</p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <span className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                order.status === 'completed' ? 'bg-green-100 text-green-600 ring-4 ring-green-500/10' : 
                order.status === 'funds_released' ? 'bg-fowy-secondary text-white shadow-premium' : 'bg-slate-100 text-slate-500'
              }`}>
                {order.status === 'pending_payment' ? 'Esperando Pago 💳' : 
                 order.status === 'in_escrow' ? 'En Custodia 🛡️' : 
                 order.status === 'completed' ? 'Trabajo Entregado ✅' : 
                 order.status === 'funds_released' ? 'Finalizado 🏁' : order.status}
              </span>
              <span className="px-6 py-2.5 rounded-2xl bg-white border-2 border-slate-100 text-xs font-black text-slate-700 shadow-sm flex items-center gap-2">
                <CreditCard size={16} /> Total: ${order.amount}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full lg:w-auto min-w-[200px]">
            {order.delivery_url && (
              <a 
                href={order.delivery_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-800 hover:bg-slate-50 transition-all shadow-sm group"
              >
                <TrendingUp size={20} className="group-hover:translate-y-[-2px] transition-transform" /> Ver Resultados
              </a>
            )}
            {order.status === 'completed' && (
              <button 
                onClick={() => onReleaseFunds(order.id)}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-fowy-secondary text-white rounded-2xl font-black shadow-premium hover:scale-105 transition-all"
              >
                <ShieldCheck size={20} /> Liberar Pago
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
