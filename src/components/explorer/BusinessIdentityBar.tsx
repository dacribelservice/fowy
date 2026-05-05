"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, ShieldCheck } from "lucide-react";

interface BusinessIdentityBarProps {
  business: {
    id: string;
    name: string;
    logo_url: string;
    city: string;
    color_identity?: string;
  };
  rating?: number;
  reviewsCount?: number;
  distance?: string;
  isOpen?: boolean;
}

export function BusinessIdentityBar({ 
  business, 
  rating = 4.8, 
  reviewsCount = 124,
  distance = "1.2 km",
  isOpen = true
}: BusinessIdentityBarProps) {
  const accentColor = business.color_identity || "#000000";

  return (
    <div className="relative px-6 -mt-20 z-30">
      <div className="flex flex-col gap-4">
        {/* Logo & Main Identity */}
        <div className="flex items-end gap-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative group"
          >
            {/* Logo Outer Glow */}
            <div 
              className="absolute inset-0 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
              style={{ backgroundColor: accentColor }}
            />
            
            <div className="w-32 h-32 rounded-[2.5rem] border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden bg-white flex-shrink-0 relative z-10">
              <img 
                src={business.logo_url} 
                alt={business.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Verified Badge */}
            <div className="absolute -bottom-2 -right-2 z-20 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white shadow-lg">
              <ShieldCheck size={16} fill="currentColor" className="text-white" />
            </div>
          </motion.div>

          <div className="pb-4 flex-1 min-w-0">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-1">
                 <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isOpen ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                  {isOpen ? "Abierto ahora" : "Cerrado"}
                </span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight truncate">
                {business.name}
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Action/Info Bar - Glassmorphism */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {/* Rating Badge */}
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-1">
              {[...Array(1)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm font-black text-slate-900">{rating}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{reviewsCount}+ Reseñas</span>
          </div>

          {/* Location Badge */}
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-sm font-black text-slate-900">{distance}</span>
          </div>

          {/* Time Badge */}
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
            <Clock size={16} className="text-slate-400" />
            <span className="text-sm font-black text-slate-900">25-35 min</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
