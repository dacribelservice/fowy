"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clapperboard, Eye, ShoppingBag } from "lucide-react";
import { BusinessReelsSummary } from "@/types/reels";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import Pagination from "@/components/admin/shared/Pagination";

export interface ReelsBusinessesTableProps {
  summaries: BusinessReelsSummary[];
  loading: boolean;
}

export function ReelsBusinessesTable({ summaries, loading }: ReelsBusinessesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return summaries;
    return summaries.filter(
      (b) =>
        b.businessName.toLowerCase().includes(q) ||
        (b.businessCity && b.businessCity.toLowerCase().includes(q)) ||
        b.businessId.toLowerCase().includes(q)
    );
  }, [summaries, searchTerm]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar negocio por nombre, ciudad o ID..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-fowy-orange/20 focus:border-fowy-orange outline-none transition-all shadow-sm font-bold text-slate-700 placeholder:text-slate-400 text-sm"
          />
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {filtered.length} {filtered.length === 1 ? "negocio encontrado" : "negocios encontrados"}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden xl:block overflow-x-auto rounded-[28px] bg-white border border-slate-100 shadow-sm">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Establecimiento</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ubicación</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Videos</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Vistas Totales</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Clics al Menú</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold text-sm">
                  Cargando resumen de videos de negocios...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold text-sm">
                  No se encontraron negocios con ese filtro.
                </td>
              </tr>
            ) : (
              paginated.map((b) => (
                <tr key={b.businessId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-sm bg-slate-50 shrink-0">
                        <PremiumImage src={b.businessLogoUrl || ""} alt={b.businessName} className="w-full h-full" fallbackType="logo" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate max-w-[220px]">{b.businessName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {b.businessId.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate max-w-[160px]">{b.businessCity || "Sede Principal"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-black ${
                      b.totalReels > 0 ? "bg-orange-50 text-fowy-orange border border-orange-100" : "bg-slate-100 text-slate-400"
                    }`}>
                      {b.totalReels} {b.totalReels === 1 ? "video" : "videos"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700">
                      <Eye size={13} className="text-slate-400" />
                      {b.totalViews.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <ShoppingBag size={13} className="text-emerald-500" />
                      {b.totalClicksToMenu.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/reels/${b.businessId}`}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-50 text-fowy-orange hover:bg-fowy-orange hover:text-white font-black text-xs transition-all shadow-sm"
                      title="Gestionar Reels"
                    >
                      <Clapperboard size={15} />
                      <span>Reels</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="xl:hidden grid grid-cols-1 gap-4">
        {paginated.map((b) => (
          <div key={b.businessId} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border shadow-sm bg-slate-50 shrink-0">
                  <PremiumImage src={b.businessLogoUrl || ""} alt={b.businessName} className="w-full h-full" fallbackType="logo" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{b.businessName}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin size={12} /> {b.businessCity || "Sede Principal"}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-orange-50 text-fowy-orange text-xs font-black">
                {b.totalReels} vids
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold py-2 bg-slate-50 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Vistas</span>
                <span className="text-slate-800 font-extrabold">{b.totalViews.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Clics Menú</span>
                <span className="text-emerald-600 font-extrabold">{b.totalClicksToMenu.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href={`/admin/reels/${b.businessId}`}
              className="w-full py-3 rounded-xl bg-orange-50 text-fowy-orange hover:bg-fowy-orange hover:text-white font-black text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Clapperboard size={16} />
              <span>Gestionar Fowy Reels</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalCount={filtered.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
