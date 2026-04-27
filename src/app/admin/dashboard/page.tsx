"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowUpRight,
  Bell,
  Search,
  Settings
} from "lucide-react";

const stats = [
  { name: "Ventas Totales", value: "$0.00", icon: DollarSign, trend: "+0%", color: "bg-fowy-red" },
  { name: "Pedidos Totales", value: "0", icon: ShoppingBag, trend: "+0%", color: "bg-fowy-orange" },
  { name: "Clientes Nuevos", value: "0", icon: Users, trend: "+0%", color: "bg-fowy-purple" },
  { name: "Ticket Promedio", value: "$0.00", icon: TrendingUp, trend: "+0%", color: "bg-fowy-blue" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-slate-800"
          >
            ¡Bienvenido de vuelta, Admin! 👋
          </motion.h2>
          <p className="text-slate-500 mt-1">Aquí tienes un resumen de la plataforma FOWY.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="pl-10 pr-4 py-2 bg-white/50 border border-white/20 rounded-fowy focus:outline-none focus:ring-2 focus:ring-fowy-red/20 transition-all w-64 shadow-sm"
            />
          </div>
          <button className="p-2.5 glass-morphism rounded-fowy text-slate-600 hover:text-fowy-red transition-all">
            <Bell size={20} />
          </button>
          <button className="p-2.5 glass-morphism rounded-fowy text-slate-600 hover:text-fowy-purple transition-all">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-morphism p-6 rounded-fowy shadow-glass flex flex-col group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-premium`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} />
                {stat.trend}
              </div>
            </div>
            <h3 className="text-slate-500 font-medium text-sm">{stat.name}</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area (Gráficas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfica de Ventas */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-morphism rounded-fowy p-8 shadow-glass min-h-[400px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Ventas por Período</h3>
            <select className="bg-white/50 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none shadow-sm">
              <option>Esta Semana</option>
              <option>Este Mes</option>
            </select>
          </div>
          <div className="flex-1 flex items-end justify-between gap-4 px-2">
             {/* Barras de ejemplo vacías pero estéticas */}
             {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                 <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                   className="w-full bg-gradient-primary rounded-t-lg opacity-40 group-hover:opacity-100 transition-opacity"
                 />
                 <span className="text-xs font-bold text-slate-400">Día {i+1}</span>
               </div>
             ))}
          </div>
        </motion.div>

        {/* Categorías / Resumen lateral */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-morphism rounded-fowy p-8 shadow-glass flex flex-col"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-8">Categorías</h3>
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-48 h-48 rounded-full border-[15px] border-slate-100 relative flex items-center justify-center">
               <div className="absolute inset-0 border-[15px] border-fowy-blue border-t-transparent border-l-transparent rounded-full rotate-45" />
               <div className="text-center">
                 <p className="text-3xl font-bold text-slate-800">0%</p>
                 <p className="text-xs text-slate-400 font-medium">Completado</p>
               </div>
            </div>
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-fowy-red" />
                  <span className="text-sm font-medium text-slate-600">Premium</span>
                </div>
                <span className="text-sm font-bold text-slate-800">0%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-fowy-purple" />
                  <span className="text-sm font-medium text-slate-600">Básico</span>
                </div>
                <span className="text-sm font-bold text-slate-800">0%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
