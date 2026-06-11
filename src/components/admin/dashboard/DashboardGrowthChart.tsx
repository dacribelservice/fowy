"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Calendar, Loader2 } from "lucide-react";
import { DashboardRankingsList } from "./DashboardRankingsList";

interface DashboardGrowthChartProps {
  businesses?: any[];
  growthData?: number[];
  growthPercentages?: number[];
  growthNames?: string[][];
  title?: string;
  subtitle?: string;
  rankings?: {
    top_visits: any[];
    top_clicks: any[];
    visits_daily: any[];
    visits_weekly: any[];
    visits_monthly: any[];
  };
}

export function DashboardGrowthChart({ 
  businesses,
  growthData, 
  growthPercentages, 
  growthNames,
  title = "Crecimiento de la Red",
  subtitle = "Negocios afiliados por semana",
  rankings
}: DashboardGrowthChartProps) {
  const [filter, setFilter] = useState<"D" | "S" | "M">("D");
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"afiliados" | "visitas" | "clics">("afiliados");
  const containerRef = useRef<HTMLDivElement>(null);

  // Determinar si es dinámico (Dashboard Admin) o estático heredado (Finanzas)
  const isDynamic = !!businesses;

  // Procesamiento de datos de negocios según el filtro seleccionado
  const chartData = useMemo(() => {
    // LÓGICA PARA VISITAS: Inyectar los datos del RPC
    if (viewMode === "visitas" && rankings) {
      const sourceData = 
        filter === "D" ? rankings.visits_daily :
        filter === "S" ? rankings.visits_weekly :
        rankings.visits_monthly;

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return (sourceData || []).map((item: any, i: number, arr: any[]) => {
        let finalLabel = item.label;
        
        // Formateamos las etiquetas en español localmente para evitar bugs de idioma en SQL
        if (filter === "D") {
          const daysAgo = arr.length - 1 - i;
          const d = new Date(now);
          d.setDate(now.getDate() - daysAgo);
          const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
          finalLabel = dayNames[d.getDay()];
        } else if (filter === "S") {
          const weeksAgo = arr.length - 1 - i;
          finalLabel = weeksAgo === 0 ? "Act" : `S-${weeksAgo}`;
        } else if (filter === "M") {
          const monthsAgo = arr.length - 1 - i;
          const d = new Date(now);
          d.setDate(1);
          d.setMonth(now.getMonth() - monthsAgo);
          const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
          finalLabel = monthNames[d.getMonth()];
        }

        return {
          label: finalLabel,
          value: item.value || 0,
          fullLabel: item.full_label || finalLabel,
          names: []
        };
      });
    }

    if (isDynamic && businesses) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (filter === "D") {
        // Últimos 7 días con rellenado de 0 afiliaciones si no hay registros
        const days = [];
        const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        const fullDayNames = [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ];

        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          
          const year = d.getFullYear();
          const month = d.getMonth();
          const date = d.getDate();

          const filtered = businesses.filter((b: any) => {
            if (!b.created_at) return false;
            const bDate = new Date(b.created_at);
            return (
              bDate.getFullYear() === year &&
              bDate.getMonth() === month &&
              bDate.getDate() === date
            );
          });

          days.push({
            label: dayNames[d.getDay()],
            value: filtered.length,
            fullLabel: `${fullDayNames[d.getDay()]} ${d.getDate()}`,
            names: filtered.map((b: any) => b.name || "Negocio sin nombre"),
          });
        }
        return days;
      }

      if (filter === "S") {
        // Últimas 6 semanas con rellenado de 0
        const weeks = [];
        for (let i = 5; i >= 0; i--) {
          const start = new Date(now);
          start.setDate(now.getDate() - (i + 1) * 7);
          const end = new Date(now);
          end.setDate(now.getDate() - i * 7);

          const filtered = businesses.filter((b: any) => {
            if (!b.created_at) return false;
            const bDate = new Date(b.created_at);
            return bDate >= start && bDate < end;
          });

          const label = i === 0 ? "Act" : `S-${i}`;
          weeks.push({
            label,
            value: filtered.length,
            fullLabel: `Semana del ${start.getDate()}/${start.getMonth() + 1} al ${end.getDate()}/${end.getMonth() + 1}`,
            names: filtered.map((b: any) => b.name || "Negocio sin nombre"),
          });
        }
        return weeks;
      }

      if (filter === "M") {
        // Últimos 6 meses con rellenado de 0
        const months = [];
        const monthNames = [
          "Ene", "Feb", "Mar", "Abr", "May", "Jun",
          "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
        ];
        const fullMonthNames = [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        for (let i = 5; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(1); // Prevenir bug de fin de mes
          d.setMonth(now.getMonth() - i);
          const year = d.getFullYear();
          const monthIndex = d.getMonth();

          const filtered = businesses.filter((b: any) => {
            if (!b.created_at) return false;
            const bDate = new Date(b.created_at);
            return (
              bDate.getFullYear() === year &&
              bDate.getMonth() === monthIndex
            );
          });

          months.push({
            label: monthNames[monthIndex],
            value: filtered.length,
            fullLabel: `${fullMonthNames[monthIndex]} ${year}`,
            names: filtered.map((b: any) => b.name || "Negocio sin nombre"),
          });
        }
        return months;
      }
    }

    // Fallback de compatibilidad (e.g. Datos fijos pasados desde la sección de Finanzas)
    if (growthData) {
      return growthData.map((val, i) => {
        const label = (growthNames && growthNames[i] && growthNames[i][0]) || `P-${i+1}`;
        return {
          label,
          value: val,
          fullLabel: label,
          names: (growthNames && growthNames[i]) || [],
        };
      });
    }

    return [];
  }, [businesses, growthData, growthNames, filter, isDynamic, viewMode, rankings]);

  const totalPeriodValue = useMemo(() => {
    return chartData.reduce((sum, p) => sum + p.value, 0);
  }, [chartData]);

  // Dimensiones del SVG (consistencia visual idéntica al gráfico del negocio)
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
  }, [chartData, maxValue, chartWidth, chartHeight, height]);

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
  }, [points, pathD, height]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-2 glass-morphism p-6 rounded-fowy shadow-glass hover:shadow-premium transition-all duration-300 flex flex-col justify-between min-h-[400px]"
      ref={containerRef}
    >
      {/* Cabecera & Controles de Filtro */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-slate-400 text-xs font-medium">
              {isDynamic 
                ? (filter === "D" ? "Negocios afiliados por día" : filter === "S" ? "Negocios afiliados por semanas" : "Negocios afiliados por mes")
                : subtitle}
            </p>
          </div>

          {/* Selector de Modos (Pill Toggle) */}
          {isDynamic && (
            <div className="flex bg-slate-100 p-1 rounded-full relative shadow-inner w-fit">
              {(["afiliados", "visitas", "clics"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => { setViewMode(mode); setActivePoint(null); }}
                  className={`relative px-4 py-1.5 text-[10px] font-black uppercase rounded-full transition-colors z-10 ${
                    viewMode === mode ? "text-white" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {viewMode === mode && (
                    <motion.div
                      layoutId="pill-background"
                      className="absolute inset-0 bg-green-400 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  {mode === "clics" ? "WhatsApp" : mode === "afiliados" ? "Afiliaciones" : mode}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Solo mostrar filtros interactivos si es el Dashboard dinámico */}
        {isDynamic && (
          <div className="bg-orange-50/60 border border-orange-100/50 rounded-full p-0.5 flex gap-0.5 shadow-sm">
            {(["D", "S", "M"] as const).map((f) => {
              const labelMap = { D: "DÍA", S: "SEMANA", M: "MES" };
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setActivePoint(null); }}
                  className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase transition-all duration-300 relative ${
                    isActive 
                      ? "text-[#FF5A5F]" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span className="relative z-10">{labelMap[f]}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeGrowthFilterBg" 
                      className="absolute inset-0 bg-orange-100/70 rounded-full" 
                      transition={{ type: "spring", stiffness: 380, damping: 30 }} 
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Contenido Dinámico según ViewMode */}
      <div className="relative bg-slate-50/40 rounded-2xl border border-slate-100/80 p-3 overflow-hidden select-none flex-1 flex flex-col justify-center min-h-[250px]">
        <AnimatePresence mode="wait">
          {viewMode !== "clics" && (
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
                {points[activePoint].value} {points[activePoint].value === 1 ? 'afiliado' : 'afiliados'}
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
          )}

          {viewMode === "clics" && (
            <motion.div
              key="clics-chart"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full min-h-[300px] flex items-center justify-center bg-slate-900 rounded-xl p-4"
            >
              <DashboardRankingsList rankings={rankings} activeMetric="whatsapp" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subcomponente de Visitas (Top 10 Leaderboard) debajo de la gráfica */}
        <AnimatePresence>
          {viewMode === "visitas" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-slate-200/50"
            >
              <DashboardRankingsList rankings={rankings} activeMetric="visitas" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resumen del Período */}
      <div className="flex items-center justify-between mt-4 px-1 text-[10px]">
        <div className="text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {isDynamic ? "Total afiliados en el período" : "Total del período"}
        </div>
        <div className="bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white font-black text-xs flex items-center gap-1 rounded-full px-3 py-1 shadow-md shadow-[#FF5A5F]/20 border border-white/10 transition-all duration-300 hover:scale-105 select-none">
          <TrendingUp className="w-3.5 h-3.5 text-white" />
          {totalPeriodValue} {isDynamic ? (totalPeriodValue === 1 ? "Negocio" : "Negocios") : "Unidades"}
        </div>
      </div>
    </motion.div>
  );
}
