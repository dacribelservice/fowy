"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-normal text-white tracking-tight">
                    Políticas de Privacidad
                  </h3>
                  <p className="text-[10px] font-normal text-gray-400 uppercase tracking-wider mt-0.5">
                    FOWY PRIVACY SYSTEM • ACTUALIZADO MAYO 2026
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
              {/* 1. Recopilación de Datos de Ubicación */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    1
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    Recopilación de Datos de Ubicación
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal">
                  Nuestra plataforma requiere de forma obligatoria el acceso a la geolocalización exacta de su dispositivo única y exclusivamente con el fin operativo de posicionar de manera precisa el mapa interactivo y listar los comercios locales cercanos en tiempo real. FOWY procesa estos datos de forma estrictamente local en su navegador o aplicación móvil y no se recopilan, transfieren ni almacenan de forma histórica en nuestros servidores sin su previo consentimiento explícito.
                </p>
              </div>

              {/* 2. Recopilación de Datos de Contacto */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    2
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    Recopilación de Datos de Contacto
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal">
                  Con el fin de posibilitar el despacho y envío directo de pedidos a través del canal automatizado, FOWY solicita y captura de manera segura el número de teléfono celular (WhatsApp) y el nombre proporcionado por el usuario al momento de proceder con el checkout. Esta información es transmitida de forma automática y directa al comercio correspondiente para la exclusiva coordinación y entrega final del pedido.
                </p>
              </div>

              {/* 3. Blindaje de Datos y Seguridad */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    3
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    Blindaje de Datos y Seguridad (Supabase RLS)
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal">
                  En FOWY la seguridad es nuestra prioridad principal. Implementamos de forma estricta políticas de seguridad a nivel de fila (Row Level Security o RLS) en nuestras bases de datos estructuradas en Supabase, lo que asegura un aislamiento absoluto y blindado de los registros de datos basándose estrictamente en el rol autenticado del usuario (<code className="text-[#a58100] bg-black/30 px-1 py-0.5 rounded font-normal">explorer</code>, <code className="text-[#a58100] bg-black/30 px-1 py-0.5 rounded font-normal">partner</code>, <code className="text-[#a58100] bg-black/30 px-1 py-0.5 rounded font-normal">rider</code>, <code className="text-[#a58100] bg-black/30 px-1 py-0.5 rounded font-normal">admin</code>). FOWY garantiza la confidencialidad y prohíbe de forma absoluta e irrevocable la venta, renta, compartición o transferencia de cualquier información personal de contacto, identidad o consumo a terceras empresas o corporaciones externas con fines publicitarios o de marketing.
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
