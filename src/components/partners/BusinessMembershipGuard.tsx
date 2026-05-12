"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getBogotaDate, parseSafeDate } from "@/utils/bogotaTimeUtils";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CreditCard, AlertTriangle, ArrowRight, X, Sparkles, CheckCircle2, Clock } from "lucide-react";

export default function BusinessMembershipGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Estados de carga y datos del negocio
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState<{
    id: string;
    name: string;
    plan: string;
    payment_date: string | null;
  } | null>(null);

  // Estado de postergación de alerta flexible (Session based)
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Sincronizar el estado de descarte inicial con sessionStorage
    const dismissed = sessionStorage.getItem("fowy_membership_dismissed") === "true";
    setIsDismissed(dismissed);

    const checkMembership = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: business, error } = await supabase
          .from("businesses")
          .select("id, name, plan, payment_date")
          .eq("owner_id", user.id)
          .single();

        if (error) {
          console.error("Error cargando membresía del negocio:", error);
        } else if (business) {
          setBusinessData(business);
        }
      } catch (err) {
        console.error("Fallo crítico en el guardián de membresía:", err);
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, []);

  // Si está cargando o no hay negocio/fecha de pago, no bloquear nada
  if (loading || !businessData || !businessData.payment_date) {
    return null;
  }

  // Omitir validación de expiración para planes no restrictivos (ej. trial activo, gratis, etc.)
  const normalizedPlan = businessData.plan?.toLowerCase() || "";
  if (normalizedPlan === "trial" || normalizedPlan === "gratis" || normalizedPlan === "dev") {
    return null;
  }

  // Helper local para obtener la medianoche en Bogotá evitando desfases de huso horario o formato (ej. Safari/iOS WebKit)
  const getBogotaMidnight = (dateInput: string | null | undefined): Date => {
    if (!dateInput) return new Date();
    
    // Si es un formato solo fecha YYYY-MM-DD, extraer directamente año, mes y día para evitar desfase UTC
    const match = dateInput.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      return new Date(year, month, day, 0, 0, 0, 0);
    }
    
    // Fallback usando parseSafeDate para otros formatos (ej. ISO con zona horaria)
    const date = parseSafeDate(dateInput);
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const formatted = formatter.format(date);
      const parts = formatted.match(/(\d+)\/(\d+)\/(\d+)/);
      if (parts) {
        const [, m, d, y] = parts;
        return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), 0, 0, 0, 0);
      }
    } catch (e) {
      console.error("Error al formatear medianoche de Bogotá:", e);
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  };

  // Cálculos de tiempo con sincronización a la hora de Bogotá GMT-5
  const today = getBogotaDate();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const expirationMidnight = getBogotaMidnight(businessData.payment_date);
  const expiration = expirationMidnight;

  // Calcular diferencia exacta en días de mora calendarios limpios (desde medianoche)
  const diffTimeMidnight = todayMidnight.getTime() - expirationMidnight.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round(diffTimeMidnight / oneDay);

  // Clasificación de etapas de membresía
  if (diffDays < 0) {
    return null; // Membresía al día (no mostrar alertas ni bloqueos)
  }

  // Clasificación de etapas de mora
  const isStage1 = diffDays <= 7; // Alerta Flexible (Días 0 a 7)
  const isStage2 = diffDays > 7;  // Bloqueo Total (Días 8 en adelante)

  // Manejador para posponer la alerta flexible
  const handleDismiss = () => {
    sessionStorage.setItem("fowy_membership_dismissed", "true");
    setIsDismissed(true);
  };

  // Redirección segura a la vista de finanzas
  const handleGoToFinances = () => {
    router.push("/business/finanzas");
  };

  // Estamos actualmente en la vista de finanzas
  const isFinancesPage = pathname === "/business/finanzas";

  // RENDER: EXCEPCIÓN DE LA PÁGINA DE FINANZAS
  // Si estamos en finanzas, liberamos la pantalla para permitir la subida del comprobante,
  // pero mostramos un banner cilíndrico estético para recordar el estado de mora.
  if (isFinancesPage) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed bottom-6 left-6 right-6 xl:left-80 xl:right-10 z-50 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto pointer-events-auto bg-white/95 backdrop-blur-xl border-2 border-[#FF5A5F]/30 shadow-[0_20px_40px_rgba(255,90,95,0.15)] rounded-[30px] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FF5A5F]/10 flex items-center justify-center text-[#FF5A5F] shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  Membresía Vencida {isStage2 ? "❌ (Panel Restringido)" : "⚠️ (Periodo de Gracia)"}
                </h4>
                <p className="text-slate-600 text-sm mt-0.5">
                  {isStage2 
                    ? `Tu panel operativo se encuentra bloqueado debido a un retraso de ${diffDays} días. Sube tu comprobante de pago para reactivar.`
                    : `Estás en tu día de gracia ${diffDays}/7. Sube tu comprobante de pago antes de que tu panel sea bloqueado totalmente.`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                Venció el: {expiration.toLocaleDateString("es-CO", { day: "numeric", month: "long" })}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // RENDER: PANTALLA COMPLETA - ETAPA 2 (BLOQUEO TOTAL ABSOLUTO - DÍA 8+)
  if (isStage2) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white border-2 border-[#FF5A5F] shadow-[0_30px_70px_rgba(255,90,95,0.25)] rounded-[45px] max-w-xl w-full p-8 md:p-12 text-center relative"
        >
          {/* Círculos decorativos en el fondo de la tarjeta */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-[#FF5A5F]/10 to-transparent blur-2xl rounded-full -z-10" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tr from-[#FF9A3D]/10 to-transparent blur-2xl rounded-full -z-10" />

          {/* Icono de Candado Animado */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF5A5F] to-[#FF9A3D] p-0.5 shadow-[0_10px_25px_rgba(255,90,95,0.3)] flex items-center justify-center mb-8">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#FF5A5F]">
              <Lock className="w-10 h-10 animate-bounce" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Panel Restringido 💳
          </h2>
          
          <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto">
            Estimado socio de <span className="font-semibold text-slate-900">{businessData.name}</span>, su membresía mensual registra <span className="font-bold text-[#FF5A5F]">{diffDays} días de retraso</span>. 
            El panel de administración operativa ha sido bloqueado preventivamente.
          </p>

          <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-4 mb-8 flex items-center justify-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <span className="text-slate-700 text-sm font-medium">
              Sube tu comprobante de pago en el módulo de Finanzas para reactivar tu cuenta.
            </span>
          </div>

          {/* Botón Cilíndrico de Acción Única */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoToFinances}
            className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white font-bold text-lg shadow-[0_12px_30px_rgba(255,90,95,0.35)] hover:shadow-[0_15px_35px_rgba(255,90,95,0.5)] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span>Pagar Membresía ahora</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // RENDER: ETAPA 1 (ALERTA FLEXIBLE - DÍAS 0 A 7)
  // Sub-caso A: El usuario ya lo descartó en esta sesión -> Renderizar únicamente la mini-cápsula persistente titilante
  if (isDismissed) {
    return (
      <div className="fixed bottom-6 right-6 z-[99] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="pointer-events-auto cursor-pointer"
          onClick={handleGoToFinances}
        >
          {/* Mini-cápsula persistente, discreta, cilíndrica y titilante */}
          <div className="bg-white/95 backdrop-blur-xl border border-[#FF5A5F]/30 shadow-[0_10px_30px_rgba(255,90,95,0.15)] rounded-full pl-3 pr-5 py-2 flex items-center gap-3">
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5A5F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF5A5F]"></span>
            </div>
            <span className="text-slate-800 text-xs font-bold tracking-wide flex items-center gap-1.5">
              Pago Pendiente <span className="text-slate-400">|</span> <span className="text-[#FF5A5F] font-semibold">Día {diffDays}/7</span>
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Sub-caso B: No lo ha descartado aún -> Intersticial de pantalla completa flexible con 2 botones
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="bg-white/95 backdrop-blur-2xl border border-white shadow-[0_25px_60px_rgba(255,90,95,0.2)] rounded-[40px] max-w-lg w-full p-8 md:p-10 text-center relative"
      >
        {/* Botón de escape (X) superior derecho, igual que "Hacerlo más tarde" */}
        <button 
          onClick={handleDismiss}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-16 h-16 rounded-full bg-[#FF5A5F]/10 flex items-center justify-center text-[#FF5A5F] mb-6">
          <CreditCard className="w-8 h-8 animate-pulse" />
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-3">
          Membresía Pendiente 💳
        </h3>
        
        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 max-w-sm mx-auto">
          Tu fecha límite de pago para el negocio <span className="font-semibold text-slate-800">{businessData.name}</span> venció el <span className="font-semibold text-slate-900">{expiration.toLocaleDateString("es-CO", { day: "numeric", month: "long" })}</span>. 
          Cuentas con un periodo de gracia para mantener tus operaciones activas.
        </p>

        <div className="bg-[#FF9A3D]/5 border border-[#FF9A3D]/20 rounded-[20px] p-4 mb-8 text-center">
          <p className="text-xs font-semibold text-amber-800 flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-[#FF9A3D]" />
            Días de gracia restantes: <span className="text-[#FF5A5F] text-sm font-extrabold">{7 - diffDays} días</span>
          </p>
        </div>

        {/* Botonera de Doble Acción */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoToFinances}
            className="w-full sm:flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white font-bold text-sm shadow-[0_10px_25px_rgba(255,90,95,0.25)] hover:shadow-[0_12px_25px_rgba(255,90,95,0.4)] transition-all duration-300"
          >
            Pagar Ahora
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDismiss}
            className="w-full sm:flex-1 py-3 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all duration-300"
          >
            Hacerlo más tarde
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
