"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/modules/notifications/components/NotificationBell";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, Calendar, Clock, Loader2, Store } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useBusinessSchedule } from "@/components/admin/businesses/hooks/useBusinessSchedule";
import { toast } from "sonner";

export default function PartnerTopBar() {
  const pathname = usePathname();
  const [membershipAlert, setMembershipAlert] = React.useState<{ days: number; active: boolean } | null>(null);
  const [businessName, setBusinessName] = React.useState<string | null>(null);
  const [businessPlan, setBusinessPlan] = React.useState<string | null>(null);
  const [businessId, setBusinessId] = React.useState<string | null>(null);
  const [schedules, setSchedules] = React.useState<any>(null);
  const [businessStatus, setBusinessStatus] = React.useState<boolean>(false);
  const [toggling, setToggling] = React.useState<boolean>(false);
  
  const supabase = createClient();

  React.useEffect(() => {
    const fetchBusinessData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('businesses')
        .select('id, payment_date, name, plan, status, schedules')
        .eq('owner_id', user.id)
        .single();

      if (business) {
        if (business.id) setBusinessId(business.id);
        if (business.name) setBusinessName(business.name);
        if (business.plan) setBusinessPlan(business.plan);
        if (business.status !== undefined) setBusinessStatus(business.status);
        if (business.schedules) setSchedules(business.schedules);

        if (business.payment_date) {
          const cleanedDate = business.payment_date.replace(" ", "T");
          const expiration = new Date(cleanedDate);
          const today = new Date();
          const diffTime = expiration.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 7 && diffDays >= 0) {
            setMembershipAlert({ days: diffDays, active: true });
          }
        }
      }
    };

    fetchBusinessData();
  }, []);

  // Hook reactivo de control de horarios de Bogotá sincronizado (GMT-5) con transiciones exactas
  const { currentTimeStr } = useBusinessSchedule({
    businessId,
    schedules,
    currentStatus: businessStatus,
    onStatusChange: (newStatus) => {
      setBusinessStatus(newStatus);
    }
  });

  const handleToggleStatus = async () => {
    if (!businessId || toggling) return;
    setToggling(true);
    const nextStatus = !businessStatus;
    
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ status: nextStatus })
        .eq('id', businessId);

      if (!error) {
        setBusinessStatus(nextStatus);
        toast.success(nextStatus ? "🟢 Establecimiento Abierto" : "🔴 Establecimiento Cerrado", {
          description: `Has cambiado manualmente el estado a ${nextStatus ? 'Abierto' : 'Cerrado'}.`,
        });
      } else {
        toast.error("Error al cambiar el estado del negocio");
        console.error("Supabase update error:", error);
      }
    } catch (err) {
      toast.error("Error de conexión al cambiar el estado");
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

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
      {pathname !== "/business/orders" && pathname !== "/business/perfil" ? (
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
      ) : (
        <div />
      )}

      <div className="flex flex-wrap items-center gap-4 self-end md:self-center">
        {/* Widget de Horario & Switch Inteligente (Fase 21.4.1) */}
        {businessId && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 px-5 py-2.5 bg-white/90 border border-slate-100/80 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-premium transition-all duration-300 backdrop-blur-md"
          >
            {/* Reloj y Sello de Sincronización */}
            <div className="hidden sm:flex flex-col items-start pr-4 border-r border-slate-100/80">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <Clock size={14} className="text-fowy-secondary animate-pulse" />
                <span className="text-xs font-mono tracking-wider font-extrabold">{currentTimeStr}</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                Bogotá (GMT-5)
              </span>
            </div>

            {/* Badge de Auto-cierre Activo */}
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Sincronizado • Auto-cierre activo
            </div>

            {/* Control del Switch Premium con Framer Motion (Modo Automático/Lectura) */}
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-black uppercase tracking-widest transition-colors duration-300 flex items-center gap-1.5 ${
                businessStatus ? "text-emerald-500" : "text-red-500"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  businessStatus ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                }`} />
                {businessStatus ? "Automático • Abierto" : "Automático • Cerrado"}
              </span>

              <div 
                className={`relative w-14 h-8 rounded-full cursor-default p-1 transition-all duration-300 select-none ${
                  businessStatus 
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]' 
                    : 'bg-gradient-to-r from-red-400 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                }`}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                  animate={{ x: businessStatus ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
          </motion.div>
        )}

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
        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-black text-slate-800 leading-none">
              {businessName ?? 'Socio FOWY'}
            </p>
            <p className="text-[10px] text-fowy-secondary font-black uppercase tracking-tighter mt-1">
              {businessPlan ? `Plan ${businessPlan}` : 'Plan FOWY'}
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fowy-secondary to-fowy-purple p-[1px] shadow-premium"
          >
            <div className="w-full h-full rounded-[15px] bg-white flex items-center justify-center text-fowy-secondary font-black text-lg">
              {businessName ? businessName.charAt(0).toUpperCase() : 'S'}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
