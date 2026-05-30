"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X } from "lucide-react";

interface VisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisionModal({ isOpen, onClose }: VisionModalProps) {
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
                  <Eye size={20} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-normal text-white tracking-tight">
                    Nuestra Visión
                  </h3>
                  <p className="text-[10px] font-normal text-gray-400 uppercase tracking-wider mt-0.5">
                    FOWY VISION SYSTEM • CONEXIÓN LOCAL Y TRATO JUSTO
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
            <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] space-y-8 custom-scrollbar text-gray-300 font-sans">
              {/* 1. El Dolor */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    1
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    ¿Vendes mucho pero al final te queda poco?
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal">
                  Imagina ese momento al final del mes cuando te sientas a revisar las cuentas. Vendiste muchísimo gracias a las aplicaciones de entrega, pero al ver el dinero real que te quedó en el bolsillo, sientes un vacío. Te das cuenta de que trabajaste casi de gratis para pagarle hasta un 30% de comisión a una plataforma extranjera. A esto súmale la frustración del día a día: un cliente nuevo te escribe por WhatsApp pidiendo ver qué ofreces, y terminas mandándole una foto borrosa de un menú de papel o un documento pesado que la gente a veces ni quiere descargar.
                </p>
              </div>

              {/* 2. Agitando el Dolor */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    2
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    La frustración de trabajar para las aplicaciones
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal">
                  Es agotador, ¿verdad? Esa sensación de asfixia financiera es real. Mientras tú pones el local, los ingredientes, el pago de los servicios y el sudor de tu trabajo diario, esas plataformas se llevan tu ganancia neta. Y lo peor de todo es que te mantienen escondido. Para ellos, eres solo una isla solitaria; si un día dejas de pagarles o de dar descuentos agresivos, te vuelves invisible y nadie te encuentra.
                </p>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal mt-3">
                  Además, diriges un negocio real, lo que significa que a veces necesitas ayuda para crecer: alguien que te lleve la contabilidad, que te diseñe una buena promoción o que te mejore la imagen del local. Pero buscar a alguien de confianza toma tiempo que no tienes, y contratar agencias costosas simplemente no es una opción. Sientes que tu negocio, que nació con tanta ilusión, se ha convertido en una máquina de hacerle dinero a otros mientras tú apenas sobrevives.
                </p>
              </div>

              {/* 3. La Solución */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#a58100]/20 text-[#a58100] text-xs font-normal shrink-0">
                    3
                  </span>
                  <h4 className="text-sm font-normal text-white uppercase tracking-wider">
                    Recupera tu independencia y el 100% de tus ganancias
                  </h4>
                </div>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal">
                  Aquí es donde las reglas del juego cambian para ti. FOWY nace para devolverte el control.
                </p>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal mt-3">
                  Con FOWY, cortamos de raíz el castigo por vender. En lugar de cobrarte una comisión abusiva por cada pedido que sale de tu puerta, simplemente pagas una tarifa fija mensual. Es decir: vendas 10 pedidos o vendas 1,000, tus gastos no cambian y tu ganancia se queda completa en tu bolsillo.
                </p>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal mt-3">
                  Olvídate de las fotos borrosas por chat. Ahora tendrás un catálogo digital de primer nivel, elegante y abierto las 24 horas, donde tus clientes pueden ver tus productos y comprarte de forma directa y sencilla.
                </p>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal mt-3">
                  Pero la verdadera magia ocurre con tus vecinos. En FOWY nunca más serás una isla invisible. Formas parte de un mapa vivo de tu barrio. Funciona así: si un vecino entra a la aplicación para pedir algo en la pizzería de la otra cuadra, el sistema automáticamente le mostrará tu negocio a la vuelta de la esquina. Los negocios locales dejan de competir y empiezan a enviarse clientes entre sí, atrayendo ventas de forma completamente natural.
                </p>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal mt-3">
                  ¿Y si necesitas ayuda profesional? Dentro de la misma plataforma tienes a la mano un directorio para conectar con profesionales de tu misma zona (como contadores, diseñadores o personal de apoyo), listos para ayudarte a mejorar tu local con tratos justos y cercanos.
                </p>
                <p className="text-xs leading-relaxed pl-8 text-gray-400 font-normal mt-3">
                  FOWY no es solo una herramienta digital, es tu aliado para que dejes de trabajar para las aplicaciones y empieces a hacer crecer tu propio negocio con tranquilidad.
                </p>
              </div>
            </div>

            {/* Footer Button in gold */}
            <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#a58100] hover:bg-[#8e6f00] text-white rounded-xl text-xs font-normal tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Unirme a la Visión
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
