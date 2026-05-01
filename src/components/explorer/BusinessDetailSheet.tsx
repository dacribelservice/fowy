"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import { getDistance } from "@/utils/geo";

interface BusinessDetailSheetProps {
  business: any;
  onBack: () => void;
  userLocation: [number, number] | null;
}

export default function BusinessDetailSheet({ 
  business, 
  onBack, 
  userLocation 
}: BusinessDetailSheetProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors"
        >
          ← Volver
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="w-24 h-24 rounded-[30px] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner flex-shrink-0">
          <PremiumImage 
            src={business.logo_url || "/placeholder-business.png"} 
            alt={business.name} 
            className="w-full h-full"
            fallbackType="logo"
          />
        </div>
        <div className="flex-1 pt-2">
          <div className="flex flex-wrap gap-2 mb-1">
            {business.tags && business.tags.length > 0 ? (
              business.tags.map((tag: string) => (
                <span key={tag} className="text-[10px] font-black uppercase text-fowy-red tracking-widest bg-fowy-red/10 px-2 py-0.5 rounded-lg">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-[10px] font-black uppercase text-fowy-red tracking-widest bg-fowy-red/10 px-2 py-0.5 rounded-lg">
                {business.categories?.name || "Comercio"}
              </span>
            )}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-black text-amber-600">4.9</span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800 leading-tight mb-2">{business.name}</h2>
          <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-2">
            {business.description || "Explora el menú y haz tu pedido directamente por WhatsApp."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100/50">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 block">Distancia</span>
          <p className="text-sm font-black text-slate-800">
            {userLocation ? `${getDistance(userLocation[0], userLocation[1], Number(business.latitude), Number(business.longitude)).toFixed(1)} km` : "-- km"}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100/50">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 block">Envío</span>
          <p className="text-sm font-black text-slate-800">15-25 min</p>
        </div>
      </div>

      <Link 
        href={`/${business.slug}`}
        className="w-full py-5 bg-slate-900 text-white rounded-[25px] font-black text-sm uppercase tracking-[2px] flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
      >
        Ver Menú Digital
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}
