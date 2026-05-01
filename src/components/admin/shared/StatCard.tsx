"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  bgColor: string;
  percentage?: string;
  trend?: "up" | "down";
  alert?: boolean;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  bgColor, 
  percentage, 
  trend, 
  alert 
}: StatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] shadow-sm shadow-slate-200 border border-slate-50 flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${bgColor}`}>
          {React.cloneElement(icon, { size: 18 } as any)}
        </div>
        {percentage && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black ${trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {trend === 'down' ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
            {percentage}
          </div>
        )}
        {alert && (
          <div className="animate-pulse flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black bg-amber-100 text-amber-700">¡Hoy!</div>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">{title}</p>
        <h4 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{value}</h4>
      </div>
    </motion.div>
  );
}
