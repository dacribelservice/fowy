"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import { getDistance } from "@/utils/geo";

interface BusinessListSheetProps {
  businesses: any[];
  loading: boolean;
  categoryName: string;
  onSelectBusiness: (biz: any) => void;
  userLocation: [number, number] | null;
}

export default function BusinessListSheet({
  businesses,
  loading,
  categoryName,
  onSelectBusiness,
  userLocation
}: BusinessListSheetProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">
          {categoryName}
        </h2>
        <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {businesses.length} Resultados
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <Loader2 className="w-8 h-8 text-fowy-red animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {businesses.map((biz) => (
            <motion.div 
              key={biz.id} 
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectBusiness(biz)}
              className="bg-zinc-100/50 rounded-[20px] p-3 border border-white/40 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-full aspect-square rounded-2xl bg-slate-50 overflow-hidden mb-3 relative">
                <PremiumImage 
                  src={biz.logo_url || "/placeholder-business.png"} 
                  alt={biz.name} 
                  className="w-full h-full transition-transform group-hover:scale-110"
                  fallbackType="logo"
                />
                {userLocation && (
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black shadow-sm">
                    {getDistance(userLocation[0], userLocation[1], Number(biz.latitude), Number(biz.longitude)).toFixed(1)} km
                  </div>
                )}
              </div>
              <h3 className="text-xs font-black text-slate-800 leading-tight mb-1 truncate">{biz.name}</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                {biz.tags && biz.tags.length > 0 ? biz.tags.join(" • ") : (biz.categories?.name || "Comercio")}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
