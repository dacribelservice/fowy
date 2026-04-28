"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { DashboardStatsGrid } from "@/components/admin/dashboard/DashboardStatsGrid";
import { DashboardGrowthChart } from "@/components/admin/dashboard/DashboardGrowthChart";
import { DashboardDistributionChart } from "@/components/admin/dashboard/DashboardDistributionChart";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalSales: "$0.00",
    totalOrders: 0,
    premiumPercentage: 0,
    proPercentage: 0,
    standardPercentage: 0,
    growthData: [0,0,0,0,0,0,0],
    growthPercentages: [0,0,0,0,0,0,0],
    growthNames: [[],[],[],[],[],[],[]] as string[][],
    conversionRate: 0,
    upcomingExpirations: 0
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
        const activos = businesses.filter(b => b.status === true || b.status === 'true' || b.status === 'active' || b.status === 'activo').length;
        
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

        // Distribucion
        const premiumCount = businesses.filter(b => (b.plan || '').toLowerCase().trim() === 'premium').length;
        const proCount = businesses.filter(b => (b.plan || '').toLowerCase().trim() === 'pro').length;
        const standardCount = total - premiumCount - proCount;

        const premiumPercentage = total > 0 ? Math.round((premiumCount / total) * 100) : 0;
        const proPercentage = total > 0 ? Math.round((proCount / total) * 100) : 0;
        const standardPercentage = total > 0 ? Math.round((standardCount / total) * 100) : 0;

        // Crecimiento últimos 7 días
        const last7Days = Array.from({length: 7}).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          d.setHours(0,0,0,0);
          return d;
        });

        const growthData = last7Days.map(day => {
          const nextDay = new Date(day);
          nextDay.setDate(nextDay.getDate() + 1);
          return businesses.filter(b => {
            if (!b.created_at) return false;
            const bDate = new Date(b.created_at);
            return bDate >= day && bDate < nextDay;
          }).length;
        });

        const maxGrowth = Math.max(...growthData, 1);
        const growthPercentages = growthData.map(count => Math.round((count / maxGrowth) * 100));

        const growthNames = last7Days.map(day => {
          const nextDay = new Date(day);
          nextDay.setDate(nextDay.getDate() + 1);
          return businesses.filter(b => {
            if (!b.created_at) return false;
            const bDate = new Date(b.created_at);
            return bDate >= day && bDate < nextDay;
          }).map(b => b.name);
        });

        setStats(prev => ({
          ...prev,
          totalBusinesses: total,
          activeBusinesses: activos,
          upcomingExpirations: vencimientos,
          conversionRate: Math.round(diff),
          premiumPercentage,
          proPercentage,
          standardPercentage,
          growthData,
          growthPercentages,
          growthNames
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

  return (
    <div className="p-8 space-y-8">
      <DashboardHeader />
      <DashboardStatsGrid stats={stats} />

      {/* Main Content Area (Gráficas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DashboardGrowthChart 
          growthData={stats.growthData}
          growthPercentages={stats.growthPercentages}
          growthNames={stats.growthNames}
        />

        <DashboardDistributionChart 
          totalBusinesses={stats.totalBusinesses}
          premiumPercentage={stats.premiumPercentage}
          proPercentage={stats.proPercentage}
          standardPercentage={stats.standardPercentage}
        />
      </div>
    </div>
  );
}
