"use client";

import React from "react";
import { motion } from "framer-motion";

interface DashboardGrowthChartProps {
  growthData: number[];
  growthPercentages: number[];
  growthNames: string[][];
}

export function DashboardGrowthChart({ 
  growthData, 
  growthPercentages, 
  growthNames 
}: DashboardGrowthChartProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-sm shadow-slate-200 border border-slate-50 min-h-[400px] flex flex-col"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Crecimiento de la Red</h3>
          <p className="text-slate-400 text-sm">Negocios afiliados por semana</p>
        </div>
        <select className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 focus:outline-none shadow-sm cursor-pointer hover:bg-slate-100 transition-colors">
          <option>Esta Semana</option>
          <option>Este Mes</option>
        </select>
      </div>
      <div className="flex-1 flex items-end justify-between gap-3 sm:gap-6 px-2">
        {growthPercentages.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
            <div className="relative w-full h-48 sm:h-64 flex items-end justify-center">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(h, 2)}%` }}
                transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                className="w-full max-w-[40px] bg-gradient-to-t from-fowy-primary to-fowy-red rounded-xl opacity-80 group-hover:opacity-100 transition-opacity shadow-lg shadow-fowy-red/20"
              />
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-3 py-2 rounded-xl shadow-xl z-20 flex flex-col items-center min-w-max pointer-events-none">
                <span className="text-fowy-orange">
                  {growthData[i]} {growthData[i] === 1 ? 'negocio' : 'negocios'}
                </span>
                {growthNames && growthNames[i] && growthNames[i].slice(0, 3).map((name, idx) => (
                  <span key={idx} className="text-slate-300 font-medium text-[9px] mt-0.5">{name}</span>
                ))}
                {growthNames && growthNames[i] && growthNames[i].length > 3 && (
                  <span className="text-slate-400 font-medium text-[9px] mt-0.5">+{growthNames[i].length - 3} más</span>
                )}
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">D{i+1}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
