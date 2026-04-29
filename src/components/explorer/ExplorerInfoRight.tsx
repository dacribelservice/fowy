'use client';

import React from 'react';
import { HelpCircle, Star, TrendingUp, ExternalLink } from 'lucide-react';

export const ExplorerInfoRight = () => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right duration-700">
      {/* Dynamic News/Promo Card */}
      <div className="bg-slate-100/95 p-6 rounded-fowy border border-white/50 shadow-lg">
        <div className="flex items-center gap-2 mb-4 text-fowy-orange">
          <TrendingUp size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Tendencias Hoy</span>
        </div>
        
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold text-slate-800 group-hover:text-fowy-orange transition-colors">
                  {i === 1 ? 'Los mejores Burgers de la zona' : 'Nuevas aperturas: Sector Norte'}
                </p>
                <ExternalLink size={12} className="text-slate-300 group-hover:text-fowy-orange" />
              </div>
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] font-bold text-slate-500">Populares esta semana</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-slate-100/95 p-6 rounded-fowy border border-white/50 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white">
            <HelpCircle size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">¿Necesitas Ayuda?</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Si tienes problemas con un pedido o quieres registrar tu negocio, contáctanos.
        </p>
        <button className="w-full py-2 px-4 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-all shadow-sm">
          Centro de Soporte
        </button>
      </div>
    </div>
  );
};
