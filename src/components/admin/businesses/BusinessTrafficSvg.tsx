"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrafficDataPoint } from "./useBusinessTrafficData";

export interface BusinessTrafficSvgProps {
  points: TrafficDataPoint[];
  maxVisits: number;
  maxClicks: number;
}

/**
 * Renderizado visual SVG vectorial con interacción:
 * - Curva suave Bezier Fowy (Visitas)
 * - Barras verticales verdes de WhatsApp (Pedidos/Clics)
 * - Tooltip flotante interactivo (Hover & Táctil)
 */
export function BusinessTrafficSvg({
  points,
  maxVisits,
  maxClicks,
}: BusinessTrafficSvgProps) {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  // Dimensiones fijas para escala SVG viewBox fluida (Responsive 500x180)
  const [width, height, paddingLeft, paddingRight, paddingTop, paddingBottom] = [500, 180, 40, 20, 25, 25];
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Cálculo de coordenadas (x, yVisits, yClicks) para cada punto vectorial
  const calculatedPoints = useMemo(() => {
    if (!points || points.length === 0) return [];

    return points.map((p, i) => {
      const x = paddingLeft + (i * chartWidth) / (points.length > 1 ? points.length - 1 : 1);
      const yVisits = height - paddingBottom - (p.visits / maxVisits) * chartHeight;
      // Escalar la barra verde de WhatsApp al 55% de la altura máxima para convivir bajo la curva
      const yClicks = height - paddingBottom - (p.clicks > 0 ? (p.clicks / maxClicks) * (chartHeight * 0.55) : 0);

      return {
        x,
        yVisits,
        yClicks,
        visits: p.visits,
        clicks: p.clicks,
        label: p.label,
        fullLabel: p.fullLabel,
      };
    });
  }, [points, maxVisits, maxClicks, chartWidth, chartHeight, height, paddingLeft, paddingBottom]);

  // Generar cadena SVG Path con curvas Bezier cúbicas suaves para Visitas
  const pathD = useMemo(() => {
    if (calculatedPoints.length === 0) return "";
    let d = `M ${calculatedPoints[0].x} ${calculatedPoints[0].yVisits}`;
    for (let i = 0; i < calculatedPoints.length - 1; i++) {
      const p0 = calculatedPoints[i];
      const p1 = calculatedPoints[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.yVisits;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.yVisits;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.yVisits}`;
    }
    return d;
  }, [calculatedPoints]);

  // Path cerrado para el degradado de fondo de la curva de visitas
  const areaD = useMemo(() => {
    if (calculatedPoints.length === 0) return "";
    return `${pathD} L ${calculatedPoints[calculatedPoints.length - 1].x} ${height - paddingBottom} L ${calculatedPoints[0].x} ${height - paddingBottom} Z`;
  }, [calculatedPoints, pathD, height, paddingBottom]);

  return (
    <motion.div
      key="svg-traffic-chart-render"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full relative"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="trafficCurveGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF5A5F" />
            <stop offset="100%" stopColor="#FF7A45" />
          </linearGradient>
          <linearGradient id="trafficAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5A5F" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF5A5F" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wppBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#25D366" />
            <stop offset="100%" stopColor="#128C7E" />
          </linearGradient>
          <filter id="trafficGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Líneas de Guía Horizontales Sutiles */}
        {[0, 0.5, 1].map((ratio, index) => {
          const y = paddingTop + ratio * chartHeight;
          const valVisits = Math.round(maxVisits - ratio * maxVisits);
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
                {valVisits}
              </text>
            </g>
          );
        })}

        {/* 1. Barras Verticales de Pedidos/Clics WhatsApp (Solo si p.clicks > 0) */}
        {calculatedPoints.map((p, i) => {
          if (p.clicks <= 0) return null;

          const barWidth = 16;
          const barHeight = Math.max(0, height - paddingBottom - p.yClicks);

          return (
            <motion.rect
              key={`wpp-bar-${i}`}
              x={p.x - barWidth / 2}
              y={p.yClicks}
              width={barWidth}
              height={barHeight}
              rx="4"
              fill="url(#wppBarGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: activePoint === i ? 1 : 0.85 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="transition-all duration-300"
            />
          );
        })}

        {/* 2. Trazado de Curva de Visitas con Gradiente Fowy */}
        {calculatedPoints.length > 0 && (
          <>
            {/* Área Sombreada */}
            <motion.path
              d={areaD}
              fill="url(#trafficAreaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Efecto Glow Neumórfico */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="#FF5A5F"
              strokeWidth="4"
              filter="url(#trafficGlowFilter)"
              className="opacity-25"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Línea Principal del Trazado */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="url(#trafficCurveGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Línea Detección Vertical en Hover */}
            {activePoint !== null && calculatedPoints[activePoint] && (
              <line
                x1={calculatedPoints[activePoint].x}
                y1={paddingTop}
                x2={calculatedPoints[activePoint].x}
                y2={height - paddingBottom}
                stroke="#FF5A5F"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="opacity-60"
              />
            )}

            {/* Nodos Visuales e Interacción Táctil/Hover */}
            {calculatedPoints.map((p, i) => (
              <g key={`node-group-${i}`}>
                {/* Zona de Interacción Invisible Táctil */}
                <circle
                  cx={p.x}
                  cy={Math.min(p.yVisits, p.yClicks)}
                  r="14"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActivePoint(i)}
                  onMouseLeave={() => setActivePoint(null)}
                  onTouchStart={() => setActivePoint(i)}
                />
                {/* Nodo visual real */}
                <circle
                  cx={p.x}
                  cy={p.yVisits}
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

        {/* Eje X (Etiquetas del Período) */}
        {calculatedPoints.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - paddingBottom + 14}
            textAnchor="middle"
            className={`fill-slate-400 font-bold text-[9px] font-sans transition-all duration-150 ${
              activePoint === i ? "fill-fowy-orange scale-105 font-black" : ""
            }`}
          >
            {p.label}
          </text>
        ))}
      </svg>

      {/* Tooltip Absoluto Flotante Glassmorphic Adaptativo */}
      <AnimatePresence>
        {activePoint !== null && calculatedPoints[activePoint] && (() => {
          const totalPts = calculatedPoints.length;
          const isRightEdge = activePoint >= totalPts - 2;
          const isLeftEdge = activePoint === 0;

          const translateX = isRightEdge ? "-92%" : isLeftEdge ? "-8%" : "-50%";
          const arrowLeft = isRightEdge ? "88%" : isLeftEdge ? "12%" : "50%";

          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none bg-slate-900/95 backdrop-blur-md text-white rounded-xl py-2 px-3 shadow-lg shadow-slate-950/20 border border-white/10 flex flex-col items-center gap-1 text-center z-20"
              style={{
                left: `${(calculatedPoints[activePoint].x / width) * 100}%`,
                top: `${(Math.min(calculatedPoints[activePoint].yVisits, calculatedPoints[activePoint].yClicks) / height) * 100 - 15}%`,
                transform: `translate(${translateX}, -100%)`,
              }}
            >
              <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                {calculatedPoints[activePoint].fullLabel}
              </span>
              <div className="flex flex-col gap-0.5 text-[9.5px] font-bold">
                <span className="text-orange-400 flex items-center gap-1 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  {calculatedPoints[activePoint].visits} {calculatedPoints[activePoint].visits === 1 ? "Visita" : "Visitas"}
                </span>
                <span className="text-emerald-400 flex items-center gap-1 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {calculatedPoints[activePoint].clicks} {calculatedPoints[activePoint].clicks === 1 ? "Pedido Wpp" : "Pedidos Wpp"}
                </span>
              </div>
              <div
                className="absolute bottom-0 w-2 h-2 border-t-4 border-t-slate-900/95 border-x-4 border-x-transparent"
                style={{
                  left: arrowLeft,
                  transform: "translateX(-50%) translateY(100%)",
                }}
              />
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </motion.div>
  );
}
