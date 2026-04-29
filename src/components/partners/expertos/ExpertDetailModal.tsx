"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Star, Award, ShieldCheck, Briefcase, Layers, Zap, Loader2, Sparkles 
} from "lucide-react";

interface ExpertDetailModalProps {
  expert: any;
  onClose: () => void;
  onHire: (expert: any, plan: any) => void;
  loading: boolean;
}

export const ExpertDetailModal: React.FC<ExpertDetailModalProps> = ({ 
  expert, 
  onClose, 
  onHire, 
  loading 
}) => {
  if (!expert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-4 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20 group"
        >
          <X size={24} className="text-slate-600 group-hover:rotate-90 transition-transform" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
          {/* Modal Sidebar */}
          <div className="lg:col-span-2 bg-slate-50 p-12 flex flex-col items-center text-center border-r border-slate-100">
            <div className="relative mb-8">
              <img 
                src={expert.image} 
                alt={expert.name} 
                className="w-48 h-48 rounded-[3.5rem] object-cover shadow-2xl ring-8 ring-white"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 border border-slate-100">
                <Star size={18} className="text-yellow-400" fill="currentColor" />
                <span className="font-black text-slate-800 text-lg">{expert.rating}</span>
              </div>
            </div>
            
            <h3 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">{expert.name}</h3>
            <p className="text-fowy-secondary font-black mb-10 uppercase tracking-[0.2em] text-xs">{expert.specialty}</p>

            <div className="grid grid-cols-2 gap-6 w-full">
              <div className="glass-morphism bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <p className="text-3xl font-black text-slate-800">{expert.stats?.completions || 0}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Proyectos</p>
              </div>
              <div className="glass-morphism bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <p className="text-3xl font-black text-slate-800">{expert.stats?.years || 0}+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Años Exp.</p>
              </div>
            </div>

            <div className="mt-12 w-full space-y-4">
              <div className="flex items-center gap-5 text-left p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                <Award className="text-fowy-blue shrink-0" size={32} />
                <div>
                  <p className="text-sm font-black text-slate-800">Verificado FOWY</p>
                  <p className="text-[11px] text-slate-500 font-medium">Cumple con estándares de calidad</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-left p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                <ShieldCheck className="text-green-500 shrink-0" size={32} />
                <div>
                  <p className="text-sm font-black text-slate-800">FOWY Escrow</p>
                  <p className="text-[11px] text-slate-500 font-medium">Pago 100% seguro y garantizado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="lg:col-span-3 p-12 space-y-12">
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Briefcase size={16} /> Perfil Profesional
              </h4>
              <p className="text-slate-600 leading-relaxed text-xl font-medium">
                {expert.description}
              </p>
            </section>

            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Layers size={16} /> Portafolio de Éxitos
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {expert.portfolio?.map((item: any, i: number) => (
                  <div key={i} className="aspect-square rounded-[2rem] overflow-hidden shadow-premium group cursor-zoom-in">
                    <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="work" />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Zap size={16} /> Planes Disponibles
              </h4>
              <div className="grid grid-cols-1 gap-6">
                {expert.plans?.map((plan: any) => (
                  <div key={plan.name} className="flex flex-col p-8 rounded-[2.5rem] bg-slate-50 border-4 border-transparent hover:border-fowy-secondary transition-all group relative shadow-inner">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-black text-slate-800 text-xl">{plan.name}</span>
                      <span className="text-3xl font-black text-fowy-secondary">${plan.price}</span>
                    </div>
                    <p className="text-slate-500 mb-8 font-medium">{plan.details}</p>
                    <button 
                      disabled={loading}
                      onClick={() => onHire(expert, plan)}
                      className="w-full py-4 bg-white text-slate-800 border-2 border-slate-200 rounded-2xl font-black hover:bg-fowy-secondary hover:text-white hover:border-fowy-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-sm"
                    >
                      {loading && <Loader2 className="animate-spin" size={20} />}
                      Contratar Plan
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-10 border-t border-slate-100">
              <button 
                disabled={loading}
                onClick={() => onHire(expert, expert.plans?.[0])}
                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black shadow-premium hover:scale-[1.02] transition-all flex items-center justify-center gap-4 text-xl disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={28} />
                ) : (
                  <>
                    Reservar a {expert.name?.split(' ')[0]}
                    <Sparkles size={24} className="text-fowy-secondary" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-6 font-bold italic tracking-wide">
                🔒 FOWY es el garante de tu pago. El experto recibe los fondos solo tras tu aprobación final.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
