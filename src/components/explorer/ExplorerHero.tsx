"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";

export default function ExplorerHero() {
  return (
    <div className="relative pt-8 pb-12 px-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-fowy-orange/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-fowy-blue/5 blur-[120px] rounded-full" />

      <div className="max-w-xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fowy-orange/10 text-fowy-orange text-[10px] font-black uppercase tracking-widest mb-4">
            <MapPin size={12} />
            Tu Ciudad en un Click
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">
            ¿Qué quieres <br />
            <span className="text-fowy-red">disfrutar hoy?</span>
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Descubre los mejores negocios, pide directo <br className="hidden xs:block" />
            y apoya el comercio local.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <div className="relative flex items-center bg-white rounded-[28px] border border-slate-200 p-2 group-focus-within:border-fowy-red/50 group-focus-within:ring-4 group-focus-within:ring-fowy-red/5 transition-all duration-300 shadow-sm">
            <div className="pl-4 text-slate-300">
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Busca comida, servicios, tiendas..."
              className="flex-1 px-4 py-3 bg-transparent outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300"
            />
            <button className="bg-fowy-energy text-white px-6 py-3 rounded-[20px] text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md shadow-fowy-red/20">
              Buscar
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
