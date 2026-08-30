"use client";

import React, { useState, useMemo } from "react";
import { ReelFeedItem } from "@/types/reels";
import { ReelsProximityBar } from "./ReelsProximityBar";
import ExplorerCategoryBar from "@/components/explorer/ExplorerCategoryBar";
import { ReelsSearchBar } from "./ReelsSearchBar";
import { ReelCard } from "./ReelCard";
import { Film, RotateCcw } from "lucide-react";

interface ReelsGridProps {
  reels: ReelFeedItem[];
  categories: any[];
  onOpenReel: (reel: ReelFeedItem) => void;
}

export function ReelsGrid({
  reels,
  categories,
  onOpenReel,
}: ReelsGridProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extracción única de negocios con distancia para el carrusel
  const uniqueBusinesses = useMemo(() => {
    const map = new Map<string, any>();
    reels.forEach((r) => {
      if (!map.has(r.businessId)) {
        map.set(r.businessId, {
          businessId: r.businessId,
          businessName: r.businessName,
          businessLogoUrl: r.businessLogoUrl,
          distanceMeters: r.distanceMeters,
        });
      }
    });
    return Array.from(map.values());
  }, [reels]);

  // Nombre de la categoría seleccionada para contrastar contra el arreglo de tags
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategoryId || !categories || categories.length === 0) return null;
    const cat = categories.find((c: any) => c.id === selectedCategoryId);
    return cat ? cat.name.trim().toLowerCase() : null;
  }, [selectedCategoryId, categories]);

  // Filtrado reactivo cruzado en memoria RAM a 60 FPS
  const filteredReels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return reels.filter((r) => {
      const matchBiz = !selectedBusinessId || r.businessId === selectedBusinessId;
      
      // Coincide por ID de categoría principal O por cualquiera de las etiquetas (tags) del negocio
      const matchCat =
        !selectedCategoryId ||
        r.businessCategoryId === selectedCategoryId ||
        (selectedCategoryName !== null &&
          Array.isArray(r.businessTags) &&
          r.businessTags.some(
            (tag) => typeof tag === "string" && tag.trim().toLowerCase() === selectedCategoryName
          ));

      const matchText =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.businessName.toLowerCase().includes(q);

      return matchBiz && matchCat && matchText;
    });
  }, [reels, selectedBusinessId, selectedCategoryId, selectedCategoryName, searchQuery]);

  const handleResetFilters = () => {
    setSelectedBusinessId(null);
    setSelectedCategoryId(null);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col gap-3 w-full pb-20">
      {/* 1. Carrusel de Negocios */}
      {uniqueBusinesses.length > 0 && (
        <ReelsProximityBar
          businesses={uniqueBusinesses}
          selectedBusinessId={selectedBusinessId}
          onSelectBusiness={setSelectedBusinessId}
        />
      )}

      {/* 2. Tira de Categorías Reutilizada */}
      {categories.length > 0 && (
        <div className="bg-slate-50/80 rounded-2xl mx-3 p-1 border border-slate-100">
          <ExplorerCategoryBar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            hideHandle={true}
          />
        </div>
      )}

      {/* 3. Buscador de Antojos */}
      <ReelsSearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* 4. Cuadrícula 9:16 de Reels */}
      {filteredReels.length > 0 ? (
        <div className="grid grid-cols-3 gap-[1px] px-[2px] pt-1 [&>*:first-child]:rounded-tl-[24px] [&>*:nth-child(3)]:rounded-tr-[24px]">
          {filteredReels.map((reel) => (
            <ReelCard key={reel.reelId} reel={reel} onOpen={onOpenReel} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
            <Film size={26} />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">
            No encontramos videos con ese filtro
          </h4>
          <p className="text-xs text-slate-500 mb-4 max-w-[240px]">
            Prueba buscando otro plato o categoría.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white rounded-full text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
          >
            <RotateCcw size={14} />
            <span>Ver todos los videos</span>
          </button>
        </div>
      )}
    </div>
  );
}
