"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Loader2, Eye, MessageCircle } from "lucide-react";
import { useBusinessTrafficData, TimeFilter } from "./useBusinessTrafficData";
import { BusinessTrafficSvg } from "./BusinessTrafficSvg";

export interface BusinessTrafficChartProps {
  businessId?: string;
}

/**
 * Componente Contenedor de la Gráfica de Tráfico y Pedidos WhatsApp:
 * - Filtros temporales (DÍA, SEMANA, MES)
 * - Leyenda de colores (Visitas en Naranja / Pedidos en Verde)
 * - Skeleton Loader durante la carga
 * - Integración con BusinessTrafficSvg y useBusinessTrafficData
 */
export function BusinessTrafficChart({ businessId }: BusinessTrafficChartProps) {
  const [filter, setFilter] = useState<TimeFilter>("D");

  const {
    loading,
    points,
    maxVisits,
    maxClicks,
    totalPeriodVisits,
    totalPeriodClicks,
  } = useBusinessTrafficData({ businessId, filter });

  return (
    <div className="w-full">
      {/* Cabecera, Leyendas & Controles de Filtro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-fowy-orange animate-pulse" />
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Rendimiento de Tráfico y Contactos
            </h4>
          </div>
          {/* Leyenda de Colores (Naranja = Tráfico, Verde = WhatsApp) */}
          <div className="flex items-center gap-3 text-[10px] font-extrabold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FF5A5F]" />
              Visitas (Tráfico)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              Pedidos (WhatsApp)
            </span>
          </div>
        </div>

        {/* Botones de Conmutación de Filtro (DÍA, SEMANA, MES) */}
        <div className="bg-orange-50/60 border border-orange-100/50 rounded-full p-0.5 flex gap-0.5 shadow-sm">
          {(["D", "S", "M"] as TimeFilter[]).map((f) => {
            const labelMap = { D: "DÍA", S: "SEMANA", M: "MES" };
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[9px] font-black px-3 py-1 rounded-full uppercase transition-all duration-300 relative ${
                  isActive ? "text-[#FF5A5F]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span className="relative z-10">{labelMap[f]}</span>
                {isActive && (
                  <motion.div
                    layoutId="businessTrafficFilterBg"
                    className="absolute inset-0 bg-orange-100/70 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenedor del Gráfico SVG / Skeleton Loader */}
      <div className="relative bg-slate-50/40 rounded-2xl border border-slate-100/80 p-3 overflow-hidden select-none min-h-[220px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="traffic-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[180px] flex flex-col items-center justify-center gap-2"
            >
              <Loader2 className="w-6 h-6 text-fowy-orange animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 animate-pulse">
                Procesando Tráfico y Pedidos...
              </p>
            </motion.div>
          ) : (
            <BusinessTrafficSvg
              key={`traffic-svg-${filter}`}
              points={points}
              maxVisits={maxVisits}
              maxClicks={maxClicks}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Pie de Tarjeta: Resumen Total del Período */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-3 px-1 gap-2 text-[10px]">
        <div className="text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Resumen del Período
        </div>
        <div className="flex items-center gap-2">
          {/* Badge Visitas Totales */}
          <div className="bg-orange-50 text-fowy-orange font-extrabold text-xs flex items-center gap-1 rounded-full px-3 py-1 border border-orange-100 shadow-sm">
            <Eye className="w-3.5 h-3.5 text-fowy-orange" />
            {totalPeriodVisits} Visitas
          </div>
          {/* Badge Pedidos WhatsApp */}
          <div className="bg-emerald-50 text-emerald-600 font-extrabold text-xs flex items-center gap-1 rounded-full px-3 py-1 border border-emerald-100 shadow-sm">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            {totalPeriodClicks} Pedidos
          </div>
        </div>
      </div>
    </div>
  );
}
