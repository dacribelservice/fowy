"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign,
  Search,
  Sparkles,
  Link,
  MessageCircle,
  Globe
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { FowySalesChart } from "@/components/admin/businesses/FowySalesChart";
import { parseSafeDate } from "@/utils/bogotaTimeUtils";
import { useMounted } from "@/hooks/useMounted";



// Custom Instagram icon compatible with Lucide v1
const Instagram = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function BusinessDashboard() {
  const [loading, setLoading] = useState(true);
  const mounted = useMounted();

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { name: "Visitas Totales", value: "0", change: "0%", trend: "up", icon: Users, color: "bg-blue-500" },
    { name: "Pedidos Recibidos", value: "0", change: "0%", trend: "up", icon: ShoppingBag, color: "bg-fowy-secondary" },
    { name: "Tasa de Conversión", value: "0%", change: "0%", trend: "up", icon: TrendingUp, color: "bg-orange-500" },
    { name: "Ticket Promedio", value: "$0", change: "0%", trend: "up", icon: DollarSign, color: "bg-green-500" },
  ]);
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const [trafficStats, setTrafficStats] = useState({
    google: 0,
    ia: 0,
    direct: 0
  });
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
        setBusinessId(business.id);
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
        const totalSales = ordersData?.reduce((acc: any, curr: any) => acc + Number(curr.total_amount), 0) || 0;
        const avgTicket = orderCount > 0 ? Math.round(totalSales / orderCount) : 0;
        const conversionRate = visitCount && visitCount > 0 ? (orderCount / visitCount) * 100 : 0;

        // Fetch Recent Visits
        const { data: latestVisits } = await supabase
          .from('analytics_visits')
          .select('*')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch All Referrers for traffic statistics (Paso 4.2)
        const { data: visitsReferrers } = await supabase
          .from('analytics_visits')
          .select('referrer')
          .eq('business_id', business.id);

        let googleCount = 0;
        let iaCount = 0;
        let directCount = 0;

        if (visitsReferrers && visitsReferrers.length > 0) {
          visitsReferrers.forEach((v: any) => {
            const ref = (v.referrer || "direct").toLowerCase();
            if (ref.includes("google.com") || ref.includes("bing.com")) {
              googleCount++;
            } else if (
              ref.includes("perplexity.ai") ||
              ref.includes("chatgpt.com") ||
              ref.includes("claude.ai") ||
              ref.includes("gemini") ||
              ref.includes("openai")
            ) {
              iaCount++;
            } else {
              directCount++;
            }
          });

          const total = visitsReferrers.length;
          setTrafficStats({
            google: Math.round((googleCount / total) * 100),
            ia: Math.round((iaCount / total) * 100),
            direct: Math.round((directCount / total) * 100),
          });
        }

        setStats([
          { ...stats[0], value: (visitCount || 0).toLocaleString() },
          { ...stats[1], value: orderCount.toLocaleString() },
          { ...stats[2], value: `${conversionRate.toFixed(1)}%` },
          { ...stats[3], value: `$${new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(avgTicket)}` },
        ]);
        
        if (latestVisits) setRecentVisits(latestVisits);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
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
        <div className="lg:col-span-2 glass-morphism p-6 rounded-fowy min-h-[400px] flex flex-col justify-center">
          {loading || !businessId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <TrendingUp size={48} className="mb-4 opacity-20 animate-pulse" />
              <p className="font-medium text-lg">Gráfico de Ventas</p>
              <p className="text-sm">Cargando datos del negocio...</p>
            </div>
          ) : (
            <FowySalesChart businessId={businessId} />
          )}
        </div>

        <div className="glass-morphism p-8 rounded-fowy min-h-[400px] flex flex-col">
          <div className="flex flex-col mb-6">
            <h3 className="text-lg font-bold text-slate-800">Últimas Visitas</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="bg-slate-100/70 border border-slate-200/30 text-slate-700 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-slate-100/95">
                <Search size={12} className="text-slate-500" />
                Google • {loading ? "..." : `${trafficStats.google}%`}
              </div>
              <div className="bg-purple-100/40 border border-purple-200/30 text-purple-700 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-sm shadow-[0_0_12px_rgba(139,92,246,0.06)] transition-all duration-300 hover:bg-purple-100/60">
                <Sparkles size={12} className="text-purple-500" />
                IA Search • {loading ? "..." : `${trafficStats.ia}%`}
              </div>
              <div className="bg-orange-100/40 border border-orange-200/30 text-orange-700 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-sm shadow-[0_0_12px_rgba(249,115,22,0.06)] transition-all duration-300 hover:bg-orange-100/60">
                <Link size={12} className="text-orange-500" />
                Directo • {loading ? "..." : `${trafficStats.direct}%`}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {recentVisits.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center p-4">
                <Users size={40} className="mb-2 opacity-20" />
                <p className="text-sm">No hay visitas registradas todavía.</p>
              </div>
            ) : (
              recentVisits.map((visit, i) => {
                const renderTrafficBadge = (referrer: string) => {
                  const ref = (referrer || "direct").toLowerCase();

                  if (ref.includes("google.com") || ref.includes("bing.com")) {
                    return (
                      <span className="bg-slate-100/80 border border-slate-200/50 text-slate-700 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-300 hover:scale-105">
                        <Search size={11} className="text-slate-500" />
                        Google
                      </span>
                    );
                  }

                  if (
                    ref.includes("perplexity.ai") ||
                    ref.includes("chatgpt.com") ||
                    ref.includes("claude.ai") ||
                    ref.includes("gemini") ||
                    ref.includes("openai")
                  ) {
                    let name = "IA Search";
                    if (ref.includes("perplexity.ai")) name = "Perplexity";
                    else if (ref.includes("chatgpt.com") || ref.includes("openai")) name = "ChatGPT";
                    else if (ref.includes("claude.ai")) name = "Claude";
                    else if (ref.includes("gemini")) name = "Gemini";

                    return (
                      <span className="bg-gradient-to-r from-[#7B61FF]/10 to-[#4D8BFF]/10 text-violet-700 border border-violet-200/40 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(123,97,255,0.08)] transition-all duration-300 hover:scale-105">
                        <Sparkles size={11} className="text-violet-500" />
                        {name}
                      </span>
                    );
                  }

                  if (ref.includes("whatsapp.com") || ref.includes("wa.me")) {
                    return (
                      <span className="bg-green-50/80 border border-green-100/50 text-green-600 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-300 hover:scale-105">
                        <MessageCircle size={11} className="text-green-500" />
                        WhatsApp
                      </span>
                    );
                  }

                  if (ref.includes("instagram.com")) {
                    return (
                      <span className="bg-pink-50/80 border border-pink-100/50 text-pink-600 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-300 hover:scale-105">
                        <Instagram size={11} className="text-pink-500" />
                        Instagram
                      </span>
                    );
                  }

                  if (ref.includes("t.co") || ref.includes("twitter.com") || ref.includes("x.com")) {
                    return (
                      <span className="bg-sky-50/80 border border-sky-100/50 text-sky-600 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-300 hover:scale-105">
                        <Globe size={11} className="text-sky-500" />
                        X / Twitter
                      </span>
                    );
                  }

                  return (
                    <span className="bg-slate-50/80 border border-slate-200/50 text-slate-600 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-300 hover:scale-105">
                      <Link size={11} className="text-slate-400" />
                      Directo
                    </span>
                  );
                };

                return (
                  <div key={visit.id} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-fowy-blue" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">Usuario anónimo</p>
                      <p className="text-xs text-slate-400" suppressHydrationWarning>
                        {mounted ? parseSafeDate(visit.created_at).toLocaleTimeString() : ""}
                      </p>
                    </div>
                    {renderTrafficBadge(visit.referrer)}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
