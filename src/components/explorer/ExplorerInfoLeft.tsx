'use client';

import React from 'react';
import { Info, ShieldCheck, Zap } from 'lucide-react';

export const ExplorerInfoLeft = () => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left duration-700">
      {/* Branding Card */}
      <div className="bg-slate-100/95 p-8 rounded-fowy border border-white/50 shadow-xl relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-fowy-energy rounded-2xl flex items-center justify-center shadow-lg shadow-fowy-energy/20">
            <span className="text-white font-black text-2xl">F</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">FOWY</h2>
            <p className="text-[10px] font-bold text-fowy-energy uppercase tracking-widest">Explorer Edition</p>
          </div>
        </div>
        
        <p className="text-slate-600 leading-relaxed font-medium">
          Tu puerta de acceso a los mejores comercios locales. Explora, elige y pide en segundos.
        </p>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center gap-4 p-4 rounded-fowy bg-slate-100/95 border border-white/50 shadow-md">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Pedido Rápido</p>
            <p className="text-xs text-slate-500">Sin registros complejos.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-fowy bg-slate-100/95 border border-white/50 shadow-md">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Pago Seguro</p>
            <p className="text-xs text-slate-500">Directo al WhatsApp del local.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
