"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Store, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";

interface DashboardStatsGridProps {
  stats: {
    totalBusinesses: number;
    activeBusinesses: number;
    conversionRate: number;
    upcomingExpirations: number;
  };
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const kpis: Array<{
    name: string;
    value: string;
    icon: any;
    color: string;
    detail: string;
    trend?: "up" | "down";
    alert?: boolean;
  }> = [
    { 
      name: "Total Negocios", 
      value: stats.totalBusinesses.toString(), 
      icon: Store, 
      color: "bg-blue-500",
      detail: "Global establecimientos"
    },
    { 
      name: "Negocios Activos", 
      value: stats.activeBusinesses.toString(), 
      icon: CheckCircle2, 
      color: "bg-fowy-secondary",
      detail: "Operando actualmente"
    },
    { 
      name: "Tasa Conversión", 
      value: `${stats.conversionRate}%`, 
      icon: stats.conversionRate >= 0 ? TrendingUp : TrendingDown, 
      color: stats.conversionRate >= 0 ? "bg-orange-500" : "bg-red-500",
      trend: stats.conversionRate >= 0 ? "up" : "down",
      detail: "Vs. mes pasado"
    },
    { 
      name: "Vencimientos", 
      value: stats.upcomingExpirations.toString(), 
      icon: Calendar, 
      color: "bg-green-500",
      detail: "Próximos 7 días",
      alert: stats.upcomingExpirations > 0
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((stat, i) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5 }}
          className="glass-morphism p-6 rounded-fowy shadow-glass hover:shadow-premium transition-all duration-300 group cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20`}>
              <stat.icon size={24} />
            </div>
            {stat.trend && (
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${stat.trend === 'down' ? 'bg-red-100/50 text-red-600' : 'bg-green-100/50 text-green-600'}`}>
                {stat.trend === 'down' ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                {Math.abs(stats.conversionRate)}%
              </div>
            )}
            {stat.alert && (
              <div className="animate-pulse flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100/60 text-amber-700">
                CRÍTICO
              </div>
            )}
          </div>
          <h3 className="text-slate-500 text-sm font-medium">{stat.name}</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          <p className="text-slate-400 text-xs font-medium mt-1">{stat.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}
