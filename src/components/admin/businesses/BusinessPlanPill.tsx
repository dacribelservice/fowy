"use client";

import React from "react";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

interface BusinessPlanPillProps {
  plan: string;
  paymentDate: string | Date | null | undefined;
}

export function BusinessPlanPill({ plan, paymentDate }: BusinessPlanPillProps) {
  const formatPaymentDate = (date: string | Date | null | undefined) => {
    if (!date) return "No definido";
    try {
      const dateString = typeof date === 'string' ? date : date.toISOString();
      const parts = dateString.split('T')[0].split('-');
      if (parts.length < 3) return dateString.split('T')[0];
      const [year, month, day] = parts;
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      const monthName = months[parseInt(month, 10) - 1];
      if (!day || !monthName || !year) return dateString.split('T')[0];
      return `${day}/${monthName}/${year}`;
    } catch (e) {
      return String(date);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900 border border-slate-800/80 shadow-md shadow-slate-900/10 text-white text-[11px] font-medium tracking-wide mx-auto w-fit"
    >
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-fowy-red to-fowy-orange text-white">
        <Zap size={10} fill="currentColor" className="animate-pulse" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-bold uppercase tracking-wider text-[10px] text-fowy-orange">
          Plan {plan || "Standard"}
        </span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-300">
          Próximo pago: {formatPaymentDate(paymentDate)}
        </span>
      </div>
    </motion.div>
  );
}
