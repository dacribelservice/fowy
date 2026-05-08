"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChartPointCoordinate {
  x: number;
  y: number;
  value: number;
  label: string;
  fullLabel: string;
}

interface FowyChartTooltipProps {
  activePoint: number | null;
  points: ChartPointCoordinate[];
  width?: number;
  height?: number;
  formatCurrency: (val: number) => string;
}

export function FowyChartTooltip({
  activePoint,
  points,
  width = 500,
  height = 180,
  formatCurrency,
}: FowyChartTooltipProps) {
  const activeData =
    activePoint !== null && points[activePoint] ? points[activePoint] : null;

  return (
    <AnimatePresence>
      {activeData && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute pointer-events-none bg-slate-900/95 backdrop-blur-md text-white rounded-xl py-1.5 px-3 shadow-lg shadow-slate-950/20 border border-white/10 flex flex-col items-center gap-0.5 text-center z-20"
          style={{
            left: `${(activeData.x / width) * 100}%`,
            top: `${(activeData.y / height) * 100 - 35}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <span className="text-[7.5px] font-black uppercase tracking-wider text-slate-400">
            {activeData.fullLabel}
          </span>
          <span className="text-[10px] font-black text-white leading-none">
            {formatCurrency(activeData.value)}
          </span>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 border-t-4 border-t-slate-900/95 border-x-4 border-x-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
