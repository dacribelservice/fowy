"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight"
        >
          ¡Bienvenido de vuelta, Admin! 👋
        </motion.h2>
        <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">Aquí tienes un resumen de la plataforma FOWY.</p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full sm:w-64 pl-10 pr-4 py-3 sm:py-2 bg-white/50 border border-white/20 rounded-[15px] sm:rounded-fowy focus:outline-none focus:ring-2 focus:ring-fowy-red/20 transition-all shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
