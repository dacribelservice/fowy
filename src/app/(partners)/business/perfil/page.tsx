"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Save, 
  Store, 
  Smartphone,
  Clock,
  AlertCircle,
  Loader2,
  MapPin,
  Sparkles,
  ChevronRight,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

export default function BusinessProfilePage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchBusinessData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch Business
      const { data: bizData, error: bizError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (bizError && bizError.code !== 'PGRST116') {
        console.error("Error fetching business:", bizError);
        toast.error("Error al obtener los datos del negocio");
      }

      if (bizData) {
        setBusiness(bizData);
      }
    } catch (error) {
      console.error("Critical error in fetchBusinessData:", error);
      toast.error("Error al cargar los datos del perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('businesses')
      .update({
        name: business.name,
        phone: business.phone,
        city: business.city,
        schedules: business.schedules
      })
      .eq('id', business.id);

    if (!error) {
      toast.success("Perfil actualizado con éxito");
    } else {
      toast.error("Error al actualizar el perfil");
    }
    setSaving(false);
  };

  const unconfiguredDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].filter(
    (dia) => !business?.schedules?.[dia]
  );
  const hasUnconfiguredDays = unconfiguredDays.length > 0;

  const handleToggleDay = (dia: string) => {
    const newSchedules = { ...business.schedules };
    const daySchedule = newSchedules[dia];
    
    if (!daySchedule) {
      newSchedules[dia] = {
        active: true,
        open: "09:00",
        close: "22:00"
      };
      toast.info(`Configuraste el horario para el ${dia}. ¡No olvides guardar cambios!`);
    } else {
      newSchedules[dia] = {
        ...daySchedule,
        active: !daySchedule.active
      };
    }
    
    setBusiness({ ...business, schedules: newSchedules });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 size={40} className="text-slate-900 animate-spin" />
      <p className="text-slate-500 font-bold">Cargando perfil...</p>
    </div>
  );

  if (!business) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
        <AlertCircle size={40} />
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-800">No se encontró el negocio</h3>
        <p className="text-slate-500 mt-2 max-w-md">
          Parece que no tienes un negocio vinculado a tu cuenta.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            Configuración General
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Gestiona la información operativa y horarios de tu negocio.
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-4 bg-fowy-energy text-white rounded-2xl font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 shadow-lg shadow-fowy-red/20"
        >
          {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
          Guardar Cambios
        </button>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 space-y-8 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <Store size={24} className="text-slate-900" />
            Datos del Establecimiento
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nombre Comercial</label>
              <input 
                type="text" 
                value={business?.name || ""}
                onChange={(e) => setBusiness({...business, name: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fowy-secondary/10 font-bold transition-all"
                placeholder="Ej. Burger Master"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">WhatsApp de Pedidos</label>
              <div className="relative">
                <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  value={business?.phone || ""}
                  onChange={(e) => setBusiness({...business, phone: e.target.value})}
                  className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fowy-secondary/10 font-bold transition-all"
                  placeholder="+57 300..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ciudad</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  value={business?.city || ""}
                  onChange={(e) => setBusiness({...business, city: e.target.value})}
                  className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fowy-secondary/10 font-bold transition-all"
                  placeholder="Ej. Medellín"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Schedules */}
        <div className="bg-white/70 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-slate-100/80 shadow-lg relative overflow-hidden">
          {/* Ambient lights for glassmorphism styling */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-fowy-secondary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100/80 pb-6">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Horarios de Atención</h3>
                <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mt-1">Configura la disponibilidad semanal de tu local</p>
              </div>
            </div>

            {hasUnconfiguredDays && (
              <div className="flex items-start gap-4 p-5 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-amber-700">
                <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={20} />
                <div className="space-y-1">
                  <h4 className="font-black text-sm tracking-wide uppercase">Horarios Pendientes</h4>
                  <p className="text-xs font-bold leading-relaxed text-amber-600">
                    Tienes {unconfiguredDays.length} {unconfiguredDays.length === 1 ? 'día' : 'días'} sin configurar ({unconfiguredDays.join(', ')}). 
                    Activa el interruptor de los días que laboras para establecer tus horas de atención. Los días no configurados no operarán automáticamente.
                  </p>
                </div>
              </div>
            )}

            <motion.div 
              className="grid gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => {
                const daySchedule = business?.schedules?.[dia];
                const isConfigured = !!daySchedule;
                const isActive = isConfigured ? !!daySchedule.active : false;
                
                return (
                  <motion.div 
                    key={dia} 
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.01, translateY: -2 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-5 sm:p-6 rounded-[2rem] border transition-all duration-300 gap-4 group relative ${
                      !isConfigured
                        ? 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20 shadow-sm'
                        : isActive 
                          ? 'bg-white/90 border-slate-100/80 hover:border-emerald-500/20 shadow-sm hover:shadow-[0_12px_30px_rgba(16,185,129,0.06)]' 
                          : 'bg-slate-50/40 border-slate-100/20 opacity-60'
                    }`}
                  >
                    {/* Left side: Day title & Icon */}
                    <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                          !isConfigured
                            ? 'bg-amber-50 text-amber-500 ring-4 ring-amber-500/5'
                            : isActive 
                              ? 'bg-emerald-50 text-emerald-500 ring-4 ring-emerald-500/5' 
                              : 'bg-slate-100 text-slate-400'
                        }`}>
                          <Calendar size={18} />
                        </div>
                        <div>
                          <span className={`text-base font-black transition-colors duration-300 ${
                            !isConfigured
                              ? 'text-slate-600 group-hover:text-amber-600'
                              : isActive 
                                ? 'text-slate-800 group-hover:text-emerald-600' 
                                : 'text-slate-400'
                          }`}>
                            {dia}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              !isConfigured 
                                ? 'bg-amber-500 animate-pulse' 
                                : isActive 
                                  ? 'bg-emerald-500 animate-pulse' 
                                  : 'bg-slate-300'
                            }`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              !isConfigured 
                                ? 'text-amber-500' 
                                : 'text-slate-400'
                            }`}>
                              {!isConfigured ? 'Sin configurar' : isActive ? 'Abierto' : 'Cerrado'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Switch (Mobile only) */}
                      <div className="md:hidden flex items-center">
                        <div 
                          onClick={() => handleToggleDay(dia)}
                          className={`relative w-14 h-8 rounded-full cursor-pointer p-1 transition-all duration-300 select-none ${
                            isActive 
                              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]' 
                              : 'bg-slate-200'
                          }`}
                        >
                          <motion.div 
                            layout
                            className="w-6 h-6 bg-white rounded-full shadow-md"
                            animate={{ x: isActive ? 24 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Middle side: Time Pickers */}
                    <div className={`grid grid-cols-2 md:flex md:items-center gap-3 w-full md:w-auto ${
                      isActive ? 'opacity-100' : 'opacity-40 pointer-events-none'
                    } transition-all duration-300`}>
                      {/* Open Time */}
                      <div className="relative flex items-center">
                        <Clock size={14} className={`absolute left-4 transition-colors z-10 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <div className="w-full relative">
                          <input 
                            type="time" 
                            value={business?.schedules?.[dia]?.open || ""}
                            onChange={(e) => {
                              const newSchedules = { ...business.schedules };
                              if (!newSchedules[dia]) newSchedules[dia] = {};
                              newSchedules[dia].open = e.target.value;
                              setBusiness({...business, schedules: newSchedules});
                            }}
                            disabled={!isActive}
                            className="w-full md:w-36 pl-10 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-black text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all shadow-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="hidden md:flex text-slate-300 font-extrabold text-xs">—</div>

                      {/* Close Time */}
                      <div className="relative flex items-center">
                        <Clock size={14} className={`absolute left-4 transition-colors z-10 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <div className="w-full relative">
                          <input 
                            type="time" 
                            value={business?.schedules?.[dia]?.close || ""}
                            onChange={(e) => {
                              const newSchedules = { ...business.schedules };
                              if (!newSchedules[dia]) newSchedules[dia] = {};
                              newSchedules[dia].close = e.target.value;
                              setBusiness({...business, schedules: newSchedules});
                            }}
                            disabled={!isActive}
                            className="w-full md:w-36 pl-10 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-black text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right side: Switch (Desktop only) */}
                    <div className="hidden md:flex items-center">
                      <div 
                        onClick={() => handleToggleDay(dia)}
                        className={`relative w-14 h-8 rounded-full cursor-pointer p-1 transition-all duration-300 select-none ${
                          isActive 
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]' 
                            : 'bg-slate-200'
                        }`}
                      >
                        <motion.div 
                          layout
                          className="w-6 h-6 bg-white rounded-full shadow-md"
                          animate={{ x: isActive ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
