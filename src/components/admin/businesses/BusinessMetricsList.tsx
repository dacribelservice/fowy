"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Eye, ShoppingBag, Percent, Receipt, Share2, Clapperboard } from "lucide-react";
import { motion } from "framer-motion";

interface BusinessMetricsListProps {
  businessId: string;
}

interface MetricState {
  visits: number;
  orders: number;
  conversionRate: number;
  avgTicket: number;
  crossTrafficClicks: number;
  reelsClicks: number;
}

export function BusinessMetricsList({ businessId }: BusinessMetricsListProps) {
  const supabase = createClient();
  const [metrics, setMetrics] = useState<MetricState>({
    visits: 0,
    orders: 0,
    conversionRate: 0,
    avgTicket: 0,
    crossTrafficClicks: 0,
    reelsClicks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);

        // 1. Fetch visits count
        const { count: visitsCount, error: visitsError } = await supabase
          .from("analytics_visits")
          .select("*", { count: "exact", head: true })
          .eq("business_id", businessId);

        if (visitsError) throw visitsError;

        // Fetch cross traffic clicks
        const { data: businessData, error: businessError } = await supabase
          .from("businesses")
          .select("cross_traffic_clicks")
          .eq("id", businessId)
          .single();

        if (businessError) throw businessError;
        const crossTrafficClicks = businessData?.cross_traffic_clicks || 0;

        // Fetch reels clicks
        const { data: reelsData } = await supabase
          .from("business_reels")
          .select("clicks_to_menu_count")
          .eq("business_id", businessId);

        const reelsClicks = (reelsData || []).reduce((acc: number, r: any) => acc + (r.clicks_to_menu_count || 0), 0);

        // 2. Estadísticas de pedidos y ticket promedio desde 'orders'
        const { count: exactCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("business_id", businessId);
          
        const totalOrders = exactCount || 0;
        
        const { data: ordersData } = await supabase
          .from("orders")
          .select("total_amount")
          .eq("business_id", businessId);
          
        const totalAmount = (ordersData || []).reduce((sum: any, order: any) => sum + Number(order.total_amount || 0), 0);

        const totalVisits = visitsCount || 0;
        const conversion = totalVisits > 0 ? (totalOrders / totalVisits) * 100 : 0;
        const avgTicket = totalOrders > 0 ? totalAmount / totalOrders : 0;

        setMetrics({
          visits: totalVisits,
          orders: totalOrders,
          conversionRate: parseFloat(conversion.toFixed(1)),
          avgTicket: Math.round(avgTicket),
          crossTrafficClicks: crossTrafficClicks,
          reelsClicks: reelsClicks,
        });
      } catch (error) {
        console.error("Error fetching business metrics:", error);
      } finally {
        setLoading(false);
      }
    }

    if (businessId) {
      loadMetrics();
    }
  }, [businessId, supabase]);

  const items = [
    {
      label: "Visitas Totales",
      value: loading ? null : metrics.visits.toLocaleString(),
      icon: <Eye size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />,
    },
    {
      label: "Pedidos Recibidos",
      value: loading ? null : metrics.orders.toLocaleString(),
      icon: <ShoppingBag size={14} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />,
    },
    {
      label: "Tasa de Conversión",
      value: loading ? null : `${metrics.conversionRate}%`,
      icon: <Percent size={14} className="text-slate-400 group-hover:text-amber-500 transition-colors" />,
    },
    {
      label: "Ticket Promedio",
      value: loading ? null : `$${metrics.avgTicket.toLocaleString()}`,
      icon: <Receipt size={14} className="text-slate-400 group-hover:text-rose-500 transition-colors" />,
    },
    {
      label: "Clics de Tráfico Cruzado",
      value: loading ? null : metrics.crossTrafficClicks.toLocaleString(),
      icon: <Share2 size={14} className="text-slate-400 group-hover:text-fowy-orange transition-colors" />,
    },
    {
      label: "Clics desde Fowy Reels",
      value: loading ? null : metrics.reelsClicks.toLocaleString(),
      icon: <Clapperboard size={14} className="text-slate-400 group-hover:text-fowy-orange transition-colors" />,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-slate-50 animate-pulse" />
              <div className="w-24 h-3 bg-slate-50 rounded animate-pulse" />
            </div>
            <div className="w-12 h-4 bg-slate-50 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group flex justify-between items-center py-2.5 border-b border-slate-50 hover:bg-slate-50/30 px-2 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100/50">
              {item.icon}
            </div>
            <span className="text-slate-400 text-xs font-semibold tracking-wide transition-colors group-hover:text-slate-600">
              {item.label}
            </span>
          </div>
          <span className="text-slate-700 text-sm font-extrabold tracking-tight">
            {item.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
