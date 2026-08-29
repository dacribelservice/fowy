"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clapperboard, Eye, ShoppingBag, TrendingUp, Trophy } from "lucide-react";
import { AdminReelsGlobalStats } from "@/types/reels";

export interface ReelsGlobalKPIsProps {
  stats: AdminReelsGlobalStats;
}

export function ReelsGlobalKPIs({ stats }: ReelsGlobalKPIsProps) {
  const cards = [
    {
      title: "Videos Activos",
      value: stats.totalActiveReels.toLocaleString(),
      subtext: "En catálogo activo",
      icon: <Clapperboard size={22} className="text-fowy-orange" />,
      bg: "bg-orange-50/70 border-orange-100/80",
    },
    {
      title: "Vistas Totales",
      value: stats.totalViews.toLocaleString(),
      subtext: "Global plataforma",
      icon: <Eye size={22} className="text-blue-500" />,
      bg: "bg-blue-50/70 border-blue-100/80",
    },
    {
      title: "Clics al Menú",
      value: stats.totalClicksToMenu.toLocaleString(),
      subtext: "Enviados a comprar",
      icon: <ShoppingBag size={22} className="text-emerald-500" />,
      bg: "bg-emerald-50/70 border-emerald-100/80",
    },
    {
      title: "Tasa de Conversión",
      value: `${stats.globalConversionRate}%`,
      subtext: "Vistas vs Clics Menú",
      icon: <TrendingUp size={22} className="text-purple-500" />,
      bg: "bg-purple-50/70 border-purple-100/80",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className={`p-5 rounded-[24px] border ${c.bg} backdrop-blur-sm shadow-sm flex items-center justify-between`}
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                {c.title}
              </span>
              <span className="text-2xl font-black text-slate-800 tracking-tight block">
                {c.value}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                {c.subtext}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white shadow-sm shrink-0">
              {c.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top 5 Ranking Bar */}
      {stats.topBusinesses && stats.topBusinesses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-sm shrink-0">
              <Trophy size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Top 5 Negocios con más Reproducciones:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {stats.topBusinesses.map((b, idx) => (
              <span
                key={b.businessId}
                className="px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5"
              >
                <span className="text-amber-400 font-mono">#{idx + 1}</span>
                <span className="truncate max-w-[120px]">{b.businessName}</span>
                <span className="text-[10px] text-slate-400 font-normal">({b.totalViews} 👁️)</span>
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
