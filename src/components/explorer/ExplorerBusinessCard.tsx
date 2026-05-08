"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, ChevronRight, Navigation } from "lucide-react";
import Link from "next/link";

interface Business {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  city: string | null;
  category_name?: string;
  color_identity: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface ExplorerBusinessCardProps {
  business: Business;
  index: number;
}

export default function ExplorerBusinessCard({ business, index }: ExplorerBusinessCardProps) {
  const accentColor = business.color_identity || "#FF5A5F";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white/80 backdrop-blur-xl rounded-fowy-lg border border-white/40 p-4 hover:border-fowy-red/30 transition-all duration-300"
    >
      <div className="flex gap-4">
        {/* Business Logo */}
        <div className="relative w-20 h-20 rounded-fowy overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-50 to-white border border-slate-100/50 transition-transform duration-500 group-hover:scale-105">
          <img
            src={business.logo_url || "/placeholder-business.png"}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          {/* Active Status Dot */}
          <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
        </div>

        {/* Business Info */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400/80">
                {business.category_name || "Negocio"}
              </span>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-black text-amber-700">4.9</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-700 leading-tight group-hover:text-fowy-red transition-colors">
              {business.name}
            </h3>
            <div className="flex items-center gap-1 text-slate-400/80 mt-1">
              <MapPin size={12} />
              <span className="text-xs font-semibold">{business.city || "Ciudad FOWY"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-green-500/80">
              <Clock size={12} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Abierto ahora</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-slate-100/50 flex items-center justify-between gap-3">
        <div className="flex -space-x-2 flex-shrink-0">
           {[1,2,3].map(i => (
             <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
               <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
             </div>
           ))}
           <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center shadow-sm">
             <span className="text-[8px] font-bold text-slate-400">+12</span>
           </div>
        </div>

        <div className="flex gap-2">
          {/* Navegar */}
          {business.latitude && business.longitude && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 py-2 px-3 rounded-full bg-gradient-to-b from-[#7B61FF] to-[#4D8BFF] text-white text-xs font-black uppercase tracking-widest shadow-md shadow-[#7B61FF]/30 hover:shadow-[#7B61FF]/50 active:scale-95 transition-all border border-white/20"
            >
              <Navigation size={13} />
              Navegar
            </a>
          )}
          {/* Menú */}
          <Link
            href={`/${business.slug}`}
            className="flex items-center gap-1.5 py-2 px-3 rounded-full bg-gradient-to-b from-[#FF5A5F] to-[#FF9A3D] text-white text-xs font-black uppercase tracking-widest shadow-md shadow-[#FF5A5F]/30 hover:shadow-[#FF5A5F]/50 active:scale-95 transition-all border border-white/20 group/btn"
          >
            <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
            Menú
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
