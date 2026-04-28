"use client";

import React from "react";
import { motion } from "framer-motion";

interface DashboardDistributionChartProps {
  totalBusinesses: number;
  premiumPercentage: number;
  proPercentage: number;
  standardPercentage: number;
}

export function DashboardDistributionChart({
  totalBusinesses,
  premiumPercentage,
  proPercentage,
  standardPercentage
}: DashboardDistributionChartProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-[40px] p-8 shadow-sm shadow-slate-200 border border-slate-50 flex flex-col"
    >
      <h3 className="text-xl font-bold text-slate-800 mb-2">Distribución</h3>
      <p className="text-slate-400 text-sm mb-8">Por tipo de suscripción</p>
      
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-56 h-56 relative flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Base Circle (Standard) */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="20"
              className="text-emerald-400"
            />
            {/* Pro Circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="20"
              strokeDasharray="502.65"
              strokeDashoffset={502.65 - (502.65 * (proPercentage + premiumPercentage)) / 100}
              className="text-blue-500 transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
            {/* Premium Circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="20"
              strokeDasharray="502.65"
              strokeDashoffset={502.65 - (502.65 * premiumPercentage) / 100}
              className="text-fowy-primary transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center z-10 bg-white w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-sm border border-slate-50">
            <p className="text-4xl font-black text-slate-800 leading-none">{totalBusinesses}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Total</p>
          </div>
        </div>
        
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-fowy-primary shadow-sm" />
              <span className="text-sm font-bold text-slate-600">Premium</span>
            </div>
            <span className="text-sm font-black text-slate-800">{premiumPercentage}%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" />
              <span className="text-sm font-bold text-slate-600">Pro</span>
            </div>
            <span className="text-sm font-black text-slate-800">{proPercentage}%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-sm font-bold text-slate-600">Standard</span>
            </div>
            <span className="text-sm font-black text-slate-800">{standardPercentage}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
