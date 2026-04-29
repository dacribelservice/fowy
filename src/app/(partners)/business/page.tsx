"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign 
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function BusinessDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { name: "Visitas Totales", value: "0", change: "0%", trend: "up", icon: Users, color: "bg-blue-500" },
    { name: "Pedidos Recibidos", value: "0", change: "0%", trend: "up", icon: ShoppingBag, color: "bg-fowy-secondary" },
    { name: "Tasa de Conversión", value: "0%", change: "0%", trend: "up", icon: TrendingUp, color: "bg-orange-500" },
    { name: "Ticket Promedio", value: "$0.00", change: "0%", trend: "up", icon: DollarSign, color: "bg-green-500" },
  ]);
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (business) {
        // Fetch Visits
        const { count: visitCount } = await supabase
          .from('analytics_visits')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', business.id);

        // Fetch Orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('business_id', business.id);

        const orderCount = ordersData?.length || 0;
        const totalSales = ordersData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;
        const avgTicket = orderCount > 0 ? totalSales / orderCount : 0;
        const conversionRate = visitCount && visitCount > 0 ? (orderCount / visitCount) * 100 : 0;

        // Fetch Recent Visits
        const { data: latestVisits } = await supabase
          .from('analytics_visits')
          .select('*')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setStats([
          { ...stats[0], value: (visitCount || 0).toLocaleString() },
          { ...stats[1], value: orderCount.toLocaleString() },
          { ...stats[2], value: `${conversionRate.toFixed(1)}%` },
          { ...stats[3], value: `$${avgTicket.toFixed(2)}` },
        ]);
        
        if (latestVisits) setRecentVisits(latestVisits);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          ¡Hola de nuevo! 👋
        </h2>
        <p className="text-slate-500 mt-2">
          Aquí tienes un resumen del rendimiento de tu negocio hoy.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism p-6 rounded-fowy shadow-glass hover:shadow-premium transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.trend === "up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">{loading ? "..." : stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts / Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-morphism p-8 rounded-fowy min-h-[400px] flex flex-col items-center justify-center text-slate-400">
          <TrendingUp size={48} className="mb-4 opacity-20" />
          <p className="font-medium text-lg">Gráfico de Ventas Semanales</p>
          <p className="text-sm">Próximamente: Visualiza el crecimiento de tu negocio.</p>
        </div>

        <div className="glass-morphism p-8 rounded-fowy min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Últimas Visitas</h3>
          <div className="space-y-6">
            {recentVisits.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center p-4">
                <Users size={40} className="mb-2 opacity-20" />
                <p className="text-sm">No hay visitas registradas todavía.</p>
              </div>
            ) : (
              recentVisits.map((visit, i) => (
                <div key={visit.id} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-fowy-blue" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Usuario anónimo</p>
                    <p className="text-xs text-slate-400">
                      {new Date(visit.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 italic">Menu View</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
