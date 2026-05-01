"use client";

import React from "react";
import { 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useFinanceManager } from "@/hooks/useFinanceManager";
import StatCard from "@/components/admin/shared/StatCard";
import { DashboardGrowthChart } from "@/components/admin/dashboard/DashboardGrowthChart";

export default function AdminFinancePage() {
  const { stats, chartData, orders, loading } = useFinanceManager('admin');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-fowy-purple/10 border-t-fowy-purple rounded-full animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Cargando tesorería...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Gestión Financiera 💰</h2>
          <p className="text-slate-500 mt-1">Control de ingresos, comisiones y custodia de fondos de la plataforma.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Calendar size={18} />
            Este Mes
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Volumen Total (GMV)" 
          value={`$${stats?.totalVolume.toFixed(2)}`}
          icon={<TrendingUp size={20} />}
          bgColor="bg-blue-50 text-blue-600"
          percentage="+12%"
          trend="up"
        />
        <StatCard 
          title="Ingresos FOWY" 
          value={`$${stats?.totalCommissions.toFixed(2)}`}
          icon={<DollarSign size={20} />}
          bgColor="bg-purple-50 text-purple-600"
          percentage="+8%"
          trend="up"
        />
        <StatCard 
          title="En Custodia (Escrow)" 
          value={`$${stats?.pendingEscrow.toFixed(2)}`}
          icon={<ShieldCheck size={20} />}
          bgColor="bg-amber-50 text-amber-600"
          alert={true}
        />
        <StatCard 
          title="Fondos Pagados" 
          value={`$${stats?.releasedFunds.toFixed(2)}`}
          icon={<CheckCircle2 size={20} />}
          bgColor="bg-green-50 text-green-600"
          trend="up"
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          {chartData && (
            <DashboardGrowthChart 
              growthData={chartData.data}
              growthPercentages={chartData.data.map(v => Math.min(100, (v / (Math.max(...chartData.data) || 1)) * 100))}
              growthNames={chartData.labels.map(l => [l])}
            />
          )}
        </div>

        {/* Recent Transactions List */}
        <div className="glass-morphism p-8 rounded-fowy shadow-glass">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Últimas Transacciones
          </h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-white/50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    order.status === 'funds_released' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {order.status === 'funds_released' ? <ArrowUpRight size={16} /> : <Clock size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{order.businesses?.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black">{order.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-800">${order.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-fowy-purple font-bold">Com: ${order.fowy_commission.toFixed(2)}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-slate-400 py-8 italic">No hay transacciones recientes</p>
            )}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-bold text-slate-500 border border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
            Ver todo el historial
          </button>
        </div>
      </div>
    </div>
  );
}
