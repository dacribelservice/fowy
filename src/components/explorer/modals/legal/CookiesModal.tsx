"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

interface CookiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CookiesModal({ isOpen, onClose }: CookiesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl bg-[#1e1e1e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Decorative top accent line in gold */}
            <div className="h-1.5 w-full bg-[#a58100]" />

            {/* Header */}
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#a58100]/10 flex items-center justify-center text-[#a58100] border border-[#a58100]/20">
                  <Cookie size={20} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-normal text-white tracking-tight">
                    Políticas de Cookies
                  </h3>
                  <p className="text-[10px] font-normal text-gray-400 uppercase tracking-wider mt-0.5">
                    FOWY COOKIE SYSTEM • ACTUALIZADO MAYO 2026
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer group"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Content (Scroll Interno) */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] space-y-6 custom-scrollbar text-gray-300 font-sans">
              {/* 1. Propósito Operativo */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    1
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    Propósito Operativo
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal">
                  Nuestra plataforma utiliza única y exclusivamente cookies esenciales de carácter estrictamente técnico y operativo. Estas cookies son indispensables para posibilitar funciones básicas y necesarias, tales como la persistencia temporal de los productos en su carrito de compras mientras explora diferentes menús de comercios, el mantenimiento de sesiones de usuario activas y seguras, y la optimización del rendimiento y tiempos de carga del mapa explorador interactivo impulsado por Leaflet.
                </p>
              </div>

              {/* 2. Privacidad de Cookies */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    2
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    Privacidad de Cookies (Cero Rastreo de Terceros)
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal">
                  FOWY mantiene un compromiso inquebrantable con su privacidad y seguridad digital. Declaramos de forma explícita e irrevocable la prohibición absoluta del uso de cookies de rastreo o seguimiento de terceros (third-party tracking cookies) destinadas a fines publicitarios, marketing invasivo, o la recopilación cruzada de su comportamiento de navegación fuera de nuestra plataforma.
                </p>
              </div>
            </div>

            {/* Footer Button in gold */}
            <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#a58100] hover:bg-[#8e6f00] text-white rounded-xl text-xs font-normal tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Entendido y Acepto
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
