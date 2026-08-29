"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, ShoppingBag, Edit2, Trash2, ExternalLink } from "lucide-react";
import { BusinessReel } from "@/types/reels";

export interface AdminReelCardProps {
  reel: BusinessReel;
  onToggleStatus: (reelId: string, current: boolean) => void;
  onEdit: (reel: BusinessReel) => void;
  onDelete: (reel: BusinessReel) => void;
}

export function AdminReelCard({
  reel,
  onToggleStatus,
  onEdit,
  onDelete,
}: AdminReelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[28px] p-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
    >
      {/* 9:16 Thumbnail Container */}
      <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
        <img
          src={reel.thumbnailUrl}
          alt={reel.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

        {/* Top Status Badge & Switch */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <button
            type="button"
            onClick={() => onToggleStatus(reel.id, reel.isActive)}
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 ${
              reel.isActive
                ? "bg-emerald-500 text-white"
                : "bg-slate-700/90 text-slate-300 backdrop-blur-sm"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${reel.isActive ? "bg-white animate-pulse" : "bg-slate-400"}`} />
            <span>{reel.isActive ? "Activo" : "Pausado"}</span>
          </button>

          <a
            href={reel.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-colors"
            title="Ver en Instagram"
          >
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Bottom Title & Metrics Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white z-10 space-y-1.5">
          <h4 className="font-extrabold text-sm leading-snug line-clamp-2 drop-shadow-md">
            {reel.title}
          </h4>

          <div className="flex items-center gap-3 pt-1 border-t border-white/20 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-orange-300">
              <Eye size={12} />
              {reel.viewsCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-emerald-300">
              <ShoppingBag size={12} />
              {reel.clicksToMenuCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3">
        <button
          type="button"
          onClick={() => onEdit(reel)}
          className="flex-1 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Edit2 size={14} className="text-slate-400" />
          <span>Editar</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(reel)}
          className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
          title="Eliminar reel"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );
}
