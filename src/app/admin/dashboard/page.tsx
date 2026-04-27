"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowUpRight,
  Bell,
  Search,
  Settings,
  Store,
  CheckCircle2,
  Calendar,
  TrendingDown,
  ArrowDownRight
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    activeBusinesses: 0,
    conversionRate: 0,
    upcomingExpirations: 0,
    totalSales: "$0.00",
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch businesses for stats
      const { data: businesses } = await supabase
        .from('businesses')
        .select('*');

      if (businesses) {
        const total = businesses.length;
        const activos = businesses.filter(b => b.status).length;
        
        // Expirations (Next 7 days)
        const hoy = new Date();
        const en7Dias = new Date();
        en7Dias.setDate(hoy.getDate() + 7);
        const vencimientos = businesses.filter(b => {
          if (!b.payment_date) return false;
          const fechaPago = new Date(b.payment_date);
          return fechaPago >= hoy && fechaPago <= en7Dias;
        }).length;

        // Conversion Rate (Mock logic based on created_at)
        const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const inicioMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const nuevosEsteMes = businesses.filter(b => new Date(b.created_at) >= inicioMesActual).length;
        const nuevosMesPasado = businesses.filter(b => {
          const d = new Date(b.created_at);
          return d >= inicioMesPasado && d < inicioMesActual;
        }).length;

        let diff = 0;
        if (nuevosMesPasado > 0) diff = ((nuevosEsteMes - nuevosMesPasado) / nuevosMesPasado) * 100;
        else if (nuevosEsteMes > 0) diff = 100;

        setStats(prev => ({
          ...prev,
          totalBusinesses: total,
          activeBusinesses: activos,
          upcomingExpirations: vencimientos,
          conversionRate: Math.round(diff)
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-fowy-purple/10 border-t-fowy-purple rounded-full animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs text-center px-4">Preparando el centro de mando...</p>
      </div>
    );
  }

  const kpis = [
    { 
      name: "Total Negocios", 
      value: stats.totalBusinesses.toString(), 
      icon: Store, 
      color: "bg-fowy-orange",
      detail: "Global establecimientos"
    },
    { 
      name: "Negocios Activos", 
      value: stats.activeBusinesses.toString(), 
      icon: CheckCircle2, 
      color: "bg-green-500",
      detail: "Operando actualmente"
    },
    { 
      name: "Tasa Conversión", 
      value: `${stats.conversionRate}%`, 
      icon: stats.conversionRate >= 0 ? TrendingUp : TrendingDown, 
      color: stats.conversionRate >= 0 ? "bg-fowy-blue" : "bg-red-500",
      trend: stats.conversionRate >= 0 ? "up" : "down",
      detail: "Vs. mes pasado"
    },
    { 
      name: "Vencimientos", 
      value: stats.upcomingExpirations.toString(), 
      icon: Calendar, 
      color: "bg-amber-500",
      detail: "Próximos 7 días",
      alert: stats.upcomingExpirations > 0
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
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
          <button className="p-3 sm:p-2.5 glass-morphism rounded-xl sm:rounded-fowy text-slate-600 hover:text-fowy-red transition-all shadow-sm">
            <Bell size={20} />
          </button>
          <button className="p-3 sm:p-2.5 glass-morphism rounded-xl sm:rounded-fowy text-slate-600 hover:text-fowy-purple transition-all shadow-sm">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[32px] shadow-sm shadow-slate-200 border border-slate-50 flex flex-col group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              {stat.trend && (
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {stat.trend === 'down' ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                  {Math.abs(stats.conversionRate)}%
                </div>
              )}
              {stat.alert && (
                <div className="animate-pulse flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">
                  CRÍTICO
                </div>
              )}
            </div>
            <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{stat.name}</h3>
            <p className="text-3xl font-black text-slate-800 mt-1">{stat.value}</p>
            <p className="text-slate-400 text-[10px] mt-2 font-medium">{stat.detail}</p>
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
             {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                 <div className="relative w-full h-full flex items-end justify-center">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-fowy-primary to-fowy-red rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity shadow-lg shadow-fowy-red/10"
                    />
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl">
                      {h}
                    </div>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">D{i+1}</span>
               </div>
             ))}
          </div>
        </motion.div>

        {/* Categorías / Resumen lateral */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[40px] p-8 shadow-sm shadow-slate-200 border border-slate-50 flex flex-col"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-2">Distribución</h3>
          <p className="text-slate-400 text-sm mb-8">Por tipo de suscripción</p>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="w-56 h-56 rounded-full border-[20px] border-slate-50 relative flex items-center justify-center shadow-inner">
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle
                   cx="50%"
                   cy="50%"
                   r="90"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="20"
                   strokeDasharray="565"
                   strokeDashoffset="400"
                   className="text-fowy-primary"
                   strokeLinecap="round"
                 />
               </svg>
               <div className="text-center z-10">
                 <p className="text-4xl font-black text-slate-800">28%</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Premium</p>
               </div>
            </div>
            
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-fowy-primary shadow-sm shadow-fowy-primary/40" />
                  <span className="text-sm font-bold text-slate-600">Premium</span>
                </div>
                <span className="text-sm font-black text-slate-800">28%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="text-sm font-bold text-slate-600">Básico</span>
                </div>
                <span className="text-sm font-black text-slate-800">72%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
