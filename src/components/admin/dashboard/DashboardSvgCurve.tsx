"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DashboardSvgCurveProps {
  chartData: {
    label: string;
    value: number;
    fullLabel: string;
    names?: string[];
  }[];
  isDynamic: boolean;
  viewMode?: "afiliados" | "visitas" | "clics";
}

export function DashboardSvgCurve({ chartData, isDynamic, viewMode = "afiliados" }: DashboardSvgCurveProps) {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const [width, height, paddingLeft, paddingRight, paddingTop, paddingBottom] = [500, 180, 40, 20, 25, 25];
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxValue = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.value), 0);
    return max === 0 ? 5 : max * 1.25; // 25% de holgura arriba
  }, [chartData]);

  const points = useMemo(() => {
    if (chartData.length === 0) return [];

    return chartData.map((d, i) => {
      const x = paddingLeft + (i * chartWidth) / (chartData.length - 1);
      const y = height - paddingBottom - (d.value / maxValue) * chartHeight;
      return { x, y, value: d.value, label: d.label, fullLabel: d.fullLabel, names: d.names };
    });
  }, [chartData, maxValue, chartWidth, chartHeight, height, paddingLeft, paddingBottom]);

  // Generar cadena SVG Path con curvas Bezier cúbicas suaves (mismo estilo neumórfico del negocio)
  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  // Path cerrado para el degradado de fondo
  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    return `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
  }, [points, pathD, height, paddingBottom]);

  return (
    <motion.div
      key="svg-chart"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full relative"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="growthChartGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF5A5F" />
            <stop offset="100%" stopColor="#FF7A45" />
          </linearGradient>
          <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5A5F" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF5A5F" stopOpacity="0" />
          </linearGradient>
          <filter id="growthGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Líneas de Guía Horizontales Sutiles */}
        {[0, 0.5, 1].map((ratio, index) => {
          const y = paddingTop + ratio * chartHeight;
          const val = Math.round(maxValue - ratio * maxValue);
          return (
            <g key={index} className="opacity-40">
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
              <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="fill-slate-400 font-bold text-[9px] font-sans">
                {val}
              </text>
            </g>
          );
        })}

        {/* Trazados del Gráfico */}
        {points.length > 0 && (
          <>
            {/* Área Sombreada */}
            <motion.path d={areaD} fill="url(#growthAreaGradient)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />

            {/* Efecto Glow Neumórfico */}
            <motion.path d={pathD} fill="none" stroke="#FF5A5F" strokeWidth="4" filter="url(#growthGlowFilter)" className="opacity-25" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} />

            {/* Línea Principal del Trazado */}
            <motion.path d={pathD} fill="none" stroke="url(#growthChartGradient)" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} />

            {/* Línea Detección de Hover Vertical */}
            {activePoint !== null && points[activePoint] && (
              <line x1={points[activePoint].x} y1={paddingTop} x2={points[activePoint].x} y2={height - paddingBottom} stroke="#FF5A5F" strokeWidth="1" strokeDasharray="2 2" className="opacity-60" />
            )}

            {/* Nodos del Trazado */}
            {points.map((p, i) => (
              <g key={i}>
                {/* Punto Invisible táctil/hover */}
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

      {/* Tooltip Absoluto Flotante Glassmorphic */}
      <AnimatePresence>
        {activePoint !== null && points[activePoint] && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute pointer-events-none bg-slate-900/95 backdrop-blur-md text-white rounded-xl py-2 px-3 shadow-lg shadow-slate-950/20 border border-white/10 flex flex-col items-center gap-1 text-center z-20"
            style={{
              left: `${(points[activePoint].x / width) * 100}%`,
              top: `${(points[activePoint].y / height) * 100 - 35}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <span className="text-[7.5px] font-black uppercase tracking-wider text-slate-400">
              {points[activePoint].fullLabel}
            </span>
            <span className="text-[10px] font-black text-white leading-none">
              {points[activePoint].value} {
                viewMode === "visitas" 
                  ? (points[activePoint].value === 1 ? 'visita' : 'visitas') 
                  : (points[activePoint].value === 1 ? 'afiliado' : 'afiliados')
              }
            </span>
            
            {/* Mostrar lista de nombres si es dinámico y hay nombres */}
            {isDynamic && points[activePoint].names && points[activePoint].names.length > 0 && (
              <div className="mt-1 flex flex-col items-center border-t border-white/10 pt-1 w-full gap-0.5">
                {points[activePoint].names.slice(0, 3).map((name: string, idx: number) => (
                  <span key={idx} className="text-[7.5px] font-semibold text-slate-300 max-w-[120px] truncate">
                    {name}
                  </span>
                ))}
                {points[activePoint].names.length > 3 && (
                  <span className="text-[7px] font-black text-slate-400 mt-0.5">
                    +{points[activePoint].names.length - 3} más
                  </span>
                )}
              </div>
            )}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 border-t-4 border-t-slate-900/95 border-x-4 border-x-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
