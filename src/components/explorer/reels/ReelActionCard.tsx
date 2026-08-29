"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, MapPin, Share2, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ReelFeedItem } from "@/types/reels";

interface ReelActionCardProps {
  reel: ReelFeedItem;
  onViewOnMap?: (businessId: string) => void;
  onClosePlayer?: () => void;
}

const supabase = createClient();

export function ReelActionCard({
  reel,
  onViewOnMap,
  onClosePlayer,
}: ReelActionCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const distanceText =
    reel.distanceMeters !== null && reel.distanceMeters !== undefined
      ? reel.distanceMeters < 1000
        ? `a ${Math.round(reel.distanceMeters)}m de ti`
        : `a ${(reel.distanceMeters / 1000).toFixed(1)}km de ti`
      : "Recomendado para ti";

  const handleGoToMenu = () => {
    void supabase.rpc("increment_reel_menu_click", {
      target_reel_id: reel.reelId,
    });
    router.push("/" + reel.businessSlug);
  };

  const handleViewOnMap = () => {
    onClosePlayer?.();
    onViewOnMap?.(reel.businessId);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/explorar?reel=${reel.reelId}`;
    const text = `¡Mira este plato de ${reel.businessName} en FOWY! 🤤🔥 Míralo aquí: ${url}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: reel.title, text, url });
      } catch {
        // Compartir cancelado por el usuario
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col gap-3 shadow-2xl">
      {/* Fila 1: Logo del Negocio, Nombre y Distancia */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/40 bg-white flex-shrink-0 shadow-md">
          <img
            src={reel.businessLogoUrl || "/placeholder-logo.png"}
            alt={reel.businessName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-extrabold text-white truncate leading-tight">
            {reel.businessName}
          </h4>
          <p className="text-xs font-semibold text-orange-400 truncate">
            {distanceText}
          </p>
        </div>
      </div>

      {/* Fila 2: Botones de Acción y Conversión */}
      <div className="flex items-center gap-2">
        {/* Botón Principal: Ver Menú */}
        <button
          onClick={handleGoToMenu}
          className="flex-1 h-12 bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
        >
          <ShoppingBag size={16} />
          <span>Ver Menú & Pedir</span>
        </button>

        {/* Botón: Ver en Mapa */}
        <button
          onClick={handleViewOnMap}
          className="w-12 h-12 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-2xl flex items-center justify-center transition-all border border-white/10 flex-shrink-0"
          title="Ver en el Mapa"
        >
          <MapPin size={18} />
        </button>

        {/* Botón: Compartir */}
        <button
          onClick={handleShare}
          className="w-12 h-12 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-2xl flex items-center justify-center transition-all border border-white/10 flex-shrink-0"
          title={copied ? "¡Enlace copiado!" : "Compartir Video"}
        >
          {copied ? (
            <Check size={18} className="text-emerald-400" />
          ) : (
            <Share2 size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
