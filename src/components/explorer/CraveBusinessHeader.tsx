"use client";

import React from "react";
import { Star, MapPin } from "lucide-react";

interface CraveBusinessHeaderProps {
  logoUrl: string;
  name: string;
  isOpen?: boolean;
  rating?: number;
  distance?: string;
  votesCount?: number;
}

export function CraveBusinessHeader({
  logoUrl,
  name,
  isOpen = true,
  rating = 0.0,
  distance,
  votesCount = 0,
}: CraveBusinessHeaderProps) {
  return (
    <div className="relative px-6 -mt-14 z-20 flex items-start gap-5">
      {/* Logo Circular */}
      <div className="w-28 h-28 rounded-full border-[5px] border-white overflow-hidden shadow-sm bg-white shrink-0">
        <img 
          src={logoUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Detalles del Negocio */}
      <div className="pt-16 flex-1 min-w-0">
        <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight leading-none truncate">
          {name}
        </h1>
        
        {/* Meta-datos Premium */}
        <div className="mt-2 flex items-center gap-3">
          {/* Estado: Abierto / Cerrado */}
          <div className="flex items-center gap-1.5">
            <span 
              className={`w-3 h-3 rounded-full ${isOpen ? "animate-pulse" : ""}`} 
              style={{ backgroundColor: isOpen ? "#34C759" : "#EF4444" }}
            />
            <span 
              className="text-[14px] font-bold tracking-wide"
              style={{ color: isOpen ? "#34C759" : "#EF4444" }}
            >
              {isOpen ? "ABIERTO" : "CERRADO"}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star 
              className="w-[18px] h-[18px]" 
              style={{
                fill: votesCount === 0 ? "#CBD5E1" : "#FFCC00",
                color: votesCount === 0 ? "#CBD5E1" : "#FFCC00"
              }}
            />
            <span className="text-[14px] font-bold text-slate-900">
              {votesCount === 0 ? "0.0" : rating}
            </span>
            <span className="text-[12px] text-slate-400 font-semibold ml-0.5">
              ({votesCount})
            </span>
          </div>
        </div>

        {distance && (
          <div className="mt-1 flex items-center gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              DISTANCIA {distance}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
