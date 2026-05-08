"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Loader2 } from "lucide-react";
import { useFowySalesData, TimeFilter } from "./useFowySalesData";
import { FowyChartTooltip } from "./FowyChartTooltip";

const formatCurrency = (val: number) => `$${new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0 }).format(val)}`;

export function FowySalesChart({ businessId }: { businessId: string }) {
  const [filter, setFilter] = useState<TimeFilter>("D");
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { loading, points, totalPeriodSales, maxValue, pathD, areaD } = useFowySalesData({ businessId, filter });

  const [width, height, paddingLeft, paddingRight, paddingTop, paddingBottom] = [500, 180, 40, 20, 25, 25];
  const chartHeight = height - paddingTop - paddingBottom;

  if (loading) {
    return (
      <div className="h-[240px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <Loader2 className="w-6 h-6 text-fowy-orange animate-spin mb-2" />
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Procesando Ventas...</p>
      </div>
    );
  }

  return (
    <div className="w-full" ref={containerRef}>
      {/* Cabecera & Controles de Filtro */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-fowy-orange animate-pulse" />
          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">Tendencia de Ventas</h4>
        </div>
        <div className="bg-orange-50/60 border border-orange-100/50 rounded-full p-0.5 flex gap-0.5 shadow-sm">
          {(["D", "S", "M"] as TimeFilter[]).map((f) => {
            const labelMap = { D: "DÍA", S: "SEMANA", M: "MES" };
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => { setFilter(f); setActivePoint(null); }}
                className={`text-[9px] font-black px-3 py-1 rounded-full uppercase transition-all duration-300 relative ${
                  isActive 
                    ? "text-[#FF5A5F]" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span className="relative z-10">{labelMap[f]}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeFilterBg" 
                    className="absolute inset-0 bg-orange-100/70 rounded-full" 
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} 
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gráfico SVG */}
      <div className="relative bg-slate-50/40 rounded-2xl border border-slate-100/80 p-3 overflow-visible select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF5A5F" />
              <stop offset="100%" stopColor="#FF7A45" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5A5F" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FF5A5F" stopOpacity="0" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Líneas de Guía Horizontales Sutiles */}
          {[0, 0.5, 1].map((ratio, index) => {
            const y = paddingTop + ratio * chartHeight;
            const val = maxValue - ratio * maxValue;
            return (
              <g key={index} className="opacity-40">
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="fill-slate-400 font-bold text-[9px] font-sans">
                  {val >= 1000000 ? `$${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val.toFixed(0)}`}
                </text>
              </g>
            );
          })}

          {/* Trazados del Gráfico */}
          {points.length > 0 && (
            <>
              {/* Área Sombreada */}
              <motion.path d={areaD} fill="url(#areaGradient)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />

              {/* Efecto Glow Neumórfico (Duplicado difuminado) */}
              <motion.path d={pathD} fill="none" stroke="#FF5A5F" strokeWidth="4" filter="url(#glowFilter)" className="opacity-25" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} />

              {/* Línea Principal del Trazado */}
              <motion.path d={pathD} fill="none" stroke="url(#chartGradient)" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} />

              {/* Línea Detección de Hover Vertical */}
              {activePoint !== null && points[activePoint] && (
                <line x1={points[activePoint].x} y1={paddingTop} x2={points[activePoint].x} y2={height - paddingBottom} stroke="#FF5A5F" strokeWidth="1" strokeDasharray="2 2" className="opacity-60" />
              )}

              {/* Nodos del Trazado */}
              {points.map((p, i) => (
                <g key={i}>
                  {/* Punto Invisible más grande para facilitar interacción táctil */}
                  <circle cx={p.x} cy={p.y} r="12" fill="transparent" className="cursor-pointer" onMouseEnter={() => setActivePoint(i)} onMouseLeave={() => setActivePoint(null)} onTouchStart={() => setActivePoint(i)} />
                  {/* Nodo visual real */}
                  <circle cx={p.x} cy={p.y} r={activePoint === i ? "5" : "3.5"} fill="#FFFFFF" stroke="#FF5A5F" strokeWidth={activePoint === i ? "2.5" : "2"} className="transition-all duration-150 cursor-pointer pointer-events-none" />
                </g>
              ))}
            </>
          )}

          {/* Etiquetas del Eje X */}
          {points.map((p, i) => (
            <text key={i} x={p.x} y={height - paddingBottom + 14} textAnchor="middle" className={`fill-slate-400 font-bold text-[9px] font-sans transition-all duration-150 ${activePoint === i ? "fill-fowy-orange scale-105" : ""}`}>
              {p.label}
            </text>
          ))}
        </svg>

        {/* Tooltip Absoluto Flotante */}
        <FowyChartTooltip activePoint={activePoint} points={points} width={width} height={height} formatCurrency={formatCurrency} />
      </div>

      {/* Resumen del Período */}
      <div className="flex items-center justify-between mt-3 px-1 text-[10px]">
        <div className="text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Total del período
        </div>
        <div className="bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white font-black text-xs flex items-center gap-1 rounded-full px-3 py-1 shadow-md shadow-[#FF5A5F]/20 border border-white/10 transition-all duration-300 hover:scale-105 select-none">
          <TrendingUp className="w-3.5 h-3.5 text-white" />
          {formatCurrency(totalPeriodSales)}
        </div>
      </div>
    </div>
  );
}
