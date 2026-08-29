"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, ShoppingBag, BarChart2 } from "lucide-react";
import { TimeFilter } from "@/components/admin/businesses/useBusinessTrafficData";
import { BusinessTrafficSvg } from "@/components/admin/businesses/BusinessTrafficSvg";
import { useReelsTrafficData } from "./useReelsTrafficData";

export interface ReelsTrafficChartProps {
  businessId?: string;
  title?: string;
}

export function ReelsTrafficChart({
  businessId,
  title = "Rendimiento Vectorial de Fowy Reels",
}: ReelsTrafficChartProps) {
  const [filter, setFilter] = useState<TimeFilter>("D");
  const { points, maxViews, maxClicks, totalViewsPeriod, totalClicksPeriod, loading } =
    useReelsTrafficData({ businessId, filter });

  const filterButtons: { key: TimeFilter; label: string }[] = [
    { key: "D", label: "Día" },
    { key: "S", label: "Semana" },
    { key: "M", label: "Mes" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm space-y-6"
    >
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={18} className="text-fowy-orange" />
            <h4 className="text-base font-black text-slate-800 tracking-tight">
              {title}
            </h4>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5A5F]" />
              Curva Naranja: Reproducciones
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              Barras Verdes: Clics Menú
            </span>
          </div>
        </div>

        {/* Time Selector Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => setFilter(btn.key)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filter === btn.key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Render */}
      <div className="w-full bg-slate-50/50 rounded-2xl p-2 border border-slate-100">
        {loading ? (
          <div className="h-44 flex items-center justify-center text-slate-300 text-xs font-bold animate-pulse">
            Cargando estadísticas de tráfico...
          </div>
        ) : (
          <BusinessTrafficSvg
            points={points}
            maxVisits={maxViews}
            maxClicks={maxClicks}
          />
        )}
      </div>

      {/* Summary Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs font-bold text-slate-500">
        <span className="text-[10px] uppercase tracking-wider text-slate-400">
          Resumen del período seleccionado
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-700">
            <Eye size={14} className="text-[#FF5A5F]" />
            <strong className="text-slate-900 font-extrabold">{totalViewsPeriod.toLocaleString()}</strong> Reproducciones
          </span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <ShoppingBag size={14} className="text-[#25D366]" />
            <strong className="text-slate-900 font-extrabold">{totalClicksPeriod.toLocaleString()}</strong> Clics al Menú
          </span>
        </div>
      </div>
    </motion.div>
  );
}
