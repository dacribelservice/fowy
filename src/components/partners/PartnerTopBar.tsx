"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/modules/notifications/components/NotificationBell";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function PartnerTopBar() {
  const pathname = usePathname();
  const [membershipAlert, setMembershipAlert] = React.useState<{ days: number; active: boolean } | null>(null);
  const supabase = createClient();

  React.useEffect(() => {
    const checkMembership = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('businesses')
        .select('payment_date')
        .eq('owner_id', user.id)
        .single();

      if (business?.payment_date) {
        const expiration = new Date(business.payment_date);
        const today = new Date();
        const diffTime = expiration.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7 && diffDays >= 0) {
          setMembershipAlert({ days: diffDays, active: true });
        }
      }
    };

    checkMembership();
  }, []);

  const getTitle = () => {
    if (pathname === "/business") return "Dashboard";
    if (pathname === "/business/orders") return "Pedidos en Vivo";
    if (pathname === "/business/menu") return "Gestión de Menú";
    if (pathname === "/business/perfil") return "Branding & Perfil";
    if (pathname === "/business/finanzas") return "Mi Plan & Pagos";
    if (pathname === "/business/modulos") return "Mis Módulos";
    if (pathname === "/business/expertos") return "Marketplace de Expertos";
    if (pathname.includes("/business/expert")) return "Panel de Experto";
    return "Mi Negocio";
  };

  const getSubtitle = () => {
    if (pathname === "/business") return "Resumen del rendimiento de tu negocio hoy.";
    if (pathname === "/business/orders") return "Gestiona tus pedidos entrantes en tiempo real.";
    if (pathname === "/business/expert") return "Haz seguimiento de tus trabajos y pagos en custodia.";
    return "Bienvenido al centro de control de FOWY.";
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {getTitle()}
          </h2>
          {pathname === "/business" && (
            <span className="bg-fowy-secondary/10 text-fowy-secondary text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-fowy-secondary/20 flex items-center gap-1">
              <Sparkles size={10} /> Live
            </span>
          )}
        </div>
        <p className="text-slate-500 text-sm font-medium mt-1">
          {getSubtitle()}
        </p>
      </motion.div>

      <div className="flex items-center gap-4 self-end md:self-center">
        {/* Membership Alert Indicator */}
        <AnimatePresence>
          {membershipAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700"
            >
              <AlertTriangle size={18} className="animate-pulse" />
              <div className="text-xs">
                <p className="font-black leading-none">Membresía por vencer</p>
                <p className="text-[10px] mt-0.5 opacity-80">Expira en {membershipAlert.days} {membershipAlert.days === 1 ? 'día' : 'días'}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contextual Notification Bell */}
        <div className="relative group">
          <NotificationBell />
          {/* Tooltip subtle */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
            Notificaciones
          </div>
        </div>
        
        {/* Profile Summary */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-black text-slate-800 leading-none">Socio FOWY</p>
            <p className="text-[10px] text-fowy-secondary font-black uppercase tracking-tighter mt-1">Premium Plan</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fowy-secondary to-fowy-purple p-[1px] shadow-premium"
          >
            <div className="w-full h-full rounded-[15px] bg-white flex items-center justify-center text-fowy-secondary font-black text-lg">
              S
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
