"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Calendar, Loader2, DollarSign } from "lucide-react";

interface FowySalesChartProps {
  businessId: string;
}

type TimeFilter = "D" | "S" | "M";

interface ChartPoint {
  label: string;
  value: number;
  fullLabel: string;
}

const formatCurrency = (val: number) => {
  const formatted = new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
  }).format(val);
  return `$${formatted}`;
};

export function FowySalesChart({ businessId }: FowySalesChartProps) {
  const [filter, setFilter] = useState<TimeFilter>("D");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchSalesData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("total_amount, created_at, status")
          .eq("business_id", businessId)
          .eq("status", "completed")
          .order("created_at", { ascending: true });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching sales data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (businessId) {
      fetchSalesData();
    }
  }, [businessId, supabase]);

  // Procesamiento de datos según el filtro seleccionado
  const chartData = useMemo<ChartPoint[]>(() => {
    if (loading) return [];

    const now = new Date();

    if (filter === "D") {
      // Últimos 7 días
      const days: ChartPoint[] = [];
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
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dayStr = d.toISOString().split("T")[0];

        // Sumar ventas de este día de manera segura
        const totalSales = orders
          .filter((o) => o.created_at && o.created_at.startsWith(dayStr))
          .reduce((sum, o) => sum + (o.total_amount || 0), 0);

        days.push({
          label: dayNames[d.getDay()],
          value: totalSales,
          fullLabel: `${fullDayNames[d.getDay()]} ${d.getDate()}`,
        });
      }
      return days;
    }

    if (filter === "S") {
      // Últimas 6 semanas
      const weeks: ChartPoint[] = [];
      for (let i = 5; i >= 0; i--) {
        const start = new Date();
        start.setDate(now.getDate() - (i + 1) * 7);
        const end = new Date();
        end.setDate(now.getDate() - i * 7);

        const totalSales = orders
          .filter((o) => {
            if (!o.created_at) return false;
            const orderDate = new Date(o.created_at);
            return orderDate >= start && orderDate < end;
          })
          .reduce((sum, o) => sum + (o.total_amount || 0), 0);

        const label = i === 0 ? "Act" : `S-${i}`;
        weeks.push({
          label,
          value: totalSales,
          fullLabel: `Semana del ${start.getDate()}/${start.getMonth() + 1} al ${end.getDate()}/${end.getMonth() + 1}`,
        });
      }
      return weeks;
    }

    if (filter === "M") {
      // Últimos 6 meses
      const months: ChartPoint[] = [];
      const monthNames = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      const fullMonthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(1); // Prevenir bug de fin de mes (e.g. 31 de mayo desbordando a marzo al restar 3 meses)
        d.setMonth(now.getMonth() - i);
        const year = d.getFullYear();
        const monthIndex = d.getMonth();

        const totalSales = orders
          .filter((o) => {
            if (!o.created_at) return false;
            const orderDate = new Date(o.created_at);
            return (
              orderDate.getFullYear() === year &&
              orderDate.getMonth() === monthIndex
            );
          })
          .reduce((sum, o) => sum + (o.total_amount || 0), 0);

        months.push({
          label: monthNames[monthIndex],
          value: totalSales,
          fullLabel: `${fullMonthNames[monthIndex]} ${year}`,
        });
      }
      return months;
    }

    return [];
  }, [orders, filter, loading]);

  const totalPeriodSales = useMemo(() => {
    return chartData.reduce((sum, p) => sum + p.value, 0);
  }, [chartData]);

  // Configuración de dimensiones del SVG
  const width = 500;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxValue = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.value), 0);
    return max === 0 ? 10000 : max * 1.15; // Añadir un margen del 15% arriba
  }, [chartData]);

  const points = useMemo(() => {
    if (chartData.length === 0) return [];

    return chartData.map((d, i) => {
      const x = paddingLeft + (i * chartWidth) / (chartData.length - 1);
      const y = height - paddingBottom - (d.value / maxValue) * chartHeight;
      return { x, y, value: d.value, label: d.label, fullLabel: d.fullLabel };
    });
  }, [chartData, maxValue, chartWidth, chartHeight, height, maxValue]);

  // Generar cadena SVG Path con curvas Bezier cúbicas suaves
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

  // Generar el path cerrado para el degradado de fondo
  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    return `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
  }, [points, pathD, height]);

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
          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
            Tendencia de Ventas
          </h4>
        </div>

        {/* Filtros de Tiempo Cilíndricos */}
        <div className="bg-slate-100 rounded-full p-0.5 flex gap-0.5">
          {(["D", "S", "M"] as TimeFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setActivePoint(null);
              }}
              className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase transition-all duration-300 relative ${
                filter === f ? "text-white" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="relative z-10">{f}</span>
              {filter === f && (
                <motion.div
                  layoutId="activeFilterBg"
                  className="absolute inset-0 bg-fowy-orange rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico SVG */}
      <div className="relative bg-slate-50/40 rounded-2xl border border-slate-100/80 p-3 overflow-visible select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Degradado para la curva */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF5A5F" />
              <stop offset="100%" stopColor="#FF7A45" />
            </linearGradient>

            {/* Degradado de área sombreada */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5A5F" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FF5A5F" stopOpacity="0" />
            </linearGradient>

            {/* Filtro Glow para dar brillo premium */}
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
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 font-bold text-[9px] font-sans"
                >
                  {val >= 1000000
                    ? `$${(val / 1000000).toFixed(1)}M`
                    : val >= 1000
                    ? `$${(val / 1000).toFixed(0)}k`
                    : `$${val.toFixed(0)}`}
                </text>
              </g>
            );
          })}

          {/* Trazados del Gráfico */}
          {points.length > 0 && (
            <>
              {/* Área Sombreada */}
              <motion.path
                d={areaD}
                fill="url(#areaGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Efecto Glow Neumórfico (Duplicado difuminado) */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="#FF5A5F"
                strokeWidth="4"
                filter="url(#glowFilter)"
                className="opacity-25"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* Línea Principal del Trazado */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#chartGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* Línea Detección de Hover Vertical */}
              {activePoint !== null && (
                <line
                  x1={points[activePoint].x}
                  y1={paddingTop}
                  x2={points[activePoint].x}
                  y2={height - paddingBottom}
                  stroke="#FF5A5F"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  className="opacity-60"
                />
              )}

              {/* Nodos del Trazado */}
              {points.map((p, i) => (
                <g key={i}>
                  {/* Punto Invisible más grande para facilitar interacción táctil */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="12"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setActivePoint(i)}
                    onMouseLeave={() => setActivePoint(null)}
                    onTouchStart={() => setActivePoint(i)}
                  />

                  {/* Nodo visual real */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={activePoint === i ? "5" : "3.5"}
                    fill="#FFFFFF"
                    stroke="#FF5A5F"
                    strokeWidth={activePoint === i ? "2.5" : "2"}
                    className="transition-all duration-150 cursor-pointer pointer-events-none"
                  />
                </g>
              ))}
            </>
          )}

          {/* Etiquetas del Eje X */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - paddingBottom + 14}
              textAnchor="middle"
              className={`fill-slate-400 font-bold text-[9px] font-sans transition-all duration-150 ${
                activePoint === i ? "fill-fowy-orange scale-105" : ""
              }`}
            >
              {p.label}
            </text>
          ))}
        </svg>

        {/* Tooltip Absoluto Flotante */}
        <AnimatePresence>
          {activePoint !== null && points[activePoint] && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none bg-slate-900/95 backdrop-blur-md text-white rounded-xl py-1.5 px-3 shadow-lg shadow-slate-950/20 border border-white/10 flex flex-col items-center gap-0.5 text-center"
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
                {formatCurrency(points[activePoint].value)}
              </span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 border-t-4 border-t-slate-900/95 border-x-4 border-x-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resumen del Período */}
      <div className="flex items-center justify-between mt-3 px-1 text-[10px]">
        <div className="text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Total del período
        </div>
        <div className="text-slate-700 font-black text-xs flex items-center gap-0.5 bg-slate-100 rounded-lg px-2 py-0.5">
          <TrendingUp className="w-3 h-3 text-fowy-orange" />
          {formatCurrency(totalPeriodSales)}
        </div>
      </div>
    </div>
  );
}
