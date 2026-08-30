"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { ReelFeedItem } from "@/types/reels";

interface ReelCardProps {
  reel: ReelFeedItem;
  onOpen: (reel: ReelFeedItem) => void;
}

function formatViews(num: number): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(".0", "")}k`;
  return num.toString();
}

export function ReelCard({ reel, onOpen }: ReelCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={() => onOpen(reel)}
      className="aspect-[9/16] relative overflow-hidden cursor-pointer group bg-slate-950"
    >
      {/* Miniatura */}
      <img
        src={reel.thumbnailUrl || "/placeholder-reel.jpg"}
        alt={reel.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />

      {/* Degradado para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      {/* Badge de Vistas (Superior Izquierdo) */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[10px] font-bold">
        <Play size={10} className="fill-white" />
        <span>{formatViews(reel.viewsCount)}</span>
      </div>

      {/* Datos del Plato y Restaurante (Inferior) */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5">
        <p className="text-[11px] font-extrabold text-white line-clamp-1 leading-tight drop-shadow-sm">
          {reel.title}
        </p>
        <p className="text-[9.5px] font-semibold text-slate-300 truncate drop-shadow-sm mt-0.5">
          {reel.businessName}
        </p>
      </div>
    </motion.div>
  );
}
