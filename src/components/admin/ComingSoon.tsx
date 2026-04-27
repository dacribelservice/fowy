"use client";

import React from "react";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[70vh] flex flex-col items-center justify-center text-center p-10 glass-morphism rounded-fowy shadow-glass"
    >
      <div className="w-20 h-20 bg-fowy-orange/10 rounded-full flex items-center justify-center mb-6">
        <Construction size={40} className="text-fowy-orange" />
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mb-4">{title}</h2>
      <p className="text-slate-500 max-w-md text-lg">
        Estamos trabajando para construir esta sección. Estará disponible próximamente para gestionar tu ecosistema FOWY.
      </p>
    </motion.div>
  );
}
