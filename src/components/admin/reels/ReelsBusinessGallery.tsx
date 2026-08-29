"use client";

import React from "react";
import { Plus, Clapperboard } from "lucide-react";
import { BusinessReel } from "@/types/reels";
import { AdminReelCard } from "./AdminReelCard";

export interface ReelsBusinessGalleryProps {
  reels: BusinessReel[];
  loading: boolean;
  onToggleStatus: (id: string, current: boolean) => void;
  onEdit: (reel: BusinessReel) => void;
  onDelete: (reel: BusinessReel) => void;
  onNewReel: () => void;
}

export function ReelsBusinessGallery({
  reels,
  loading,
  onToggleStatus,
  onEdit,
  onDelete,
  onNewReel,
}: ReelsBusinessGalleryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full aspect-[9/16] rounded-[28px] bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="p-12 rounded-[32px] bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-orange-50 text-fowy-orange flex items-center justify-center shadow-inner">
          <Clapperboard size={32} />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800">
            No hay videos registrados aún
          </h3>
          <p className="text-xs text-slate-400 font-medium max-w-sm mt-1">
            Comienza a atraer clientes al menú publicando el primer video de Instagram para este restaurante.
          </p>
        </div>
        <button
          type="button"
          onClick={onNewReel}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-fowy-orange/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Publicar Primer Reel</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {reels.map((reel) => (
        <AdminReelCard
          key={reel.id}
          reel={reel}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
