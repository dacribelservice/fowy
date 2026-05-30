"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-normal text-white tracking-tight">
                    Términos y Condiciones
                  </h3>
                  <p className="text-[10px] font-normal text-gray-400 uppercase tracking-wider mt-0.5">
                    FOWY LEGAL SYSTEM • ACTUALIZADO MAYO 2026
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
            <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] space-y-6 custom-scrollbar text-gray-300">
              {/* 1. Naturaleza Jurídica */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    1
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    Naturaleza Jurídica y Rol de FOWY
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400">
                  FOWY es exclusivamente un facilitador tecnológico y proveedor de software como servicio (SaaS). Nuestra plataforma conecta de forma independiente a comercios locales, repartidores independientes (&ldquo;Moto-Fowy&rdquo;) y consumidores finales. FOWY no opera ni tiene control sobre la preparación de alimentos, venta de productos, ni agencias de mensajería/transporte. El contrato de compraventa y de entrega se celebra directamente entre las partes involucradas.
                </p>
              </div>

              {/* 2. Modelo de Suscripción Plana */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    2
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    Modelo de Suscripción Plana (Cero Comisiones)
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400">
                  En FOWY creemos en el comercio justo. Por ello, operamos bajo un modelo estricto de cero comisiones (0%) sobre las ventas de los negocios. Los comercios suscritos pagan únicamente una tarifa plana mensual fija por el uso de nuestro software, garantizando que el 100% de los ingresos de sus ventas permanezca bajo su propio control y beneficio comercial.
                </p>
              </div>

              {/* 3. Autonomía de los Repartidores */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    3
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    Autonomía de los Repartidores (Moto-Fowy)
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400">
                  La logística, despacho y transporte de pedidos es gestionada de manera autónoma por repartidores independientes asociados a la plataforma (Moto-Fowy) o por el propio personal de entrega del comercio. FOWY no mantiene ninguna relación laboral, de subordinación o de agencia con los repartidores, y no se responsabiliza de tiempos de entrega, retrasos, pérdidas, robos, daños o del estado final de los productos transportados.
                </p>
              </div>

              {/* 4. Integración y Despacho vía WhatsApp */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    4
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    Integración y Despacho vía WhatsApp
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400">
                  El flujo de checkout de FOWY funciona consolidando el carrito de compras seleccionado y transfiriendo dicha información de forma automatizada al número de WhatsApp del comercio para su coordinación directa y confirmación final. FOWY no procesa transacciones monetarias directas ni actúa como pasarela de pago en esta instancia. Cualquier reclamo, devolución, reembolso o disputa comercial deberá coordinarse y resolverse de manera directa y exclusiva entre el cliente y el comercio.
                </p>
              </div>

              {/* 5. Propiedad Intelectual */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    5
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    Propiedad Intelectual
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400">
                  FOWY es el titular exclusivo de todos los derechos de propiedad intelectual, industrial, derechos de autor, secretos comerciales, código fuente, algoritmos, diseños de interfaz, marcas registradas, logotipos y tecnología que componen la plataforma. Está estrictamente prohibida la reproducción, ingeniería inversa, modificación o explotación no autorizada del software o de cualquier elemento de marca de FOWY.
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
