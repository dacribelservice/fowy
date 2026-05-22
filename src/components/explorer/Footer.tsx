"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Shield, 
  Cookie, 
  Eye, 
  Mail, 
  MessageCircle,
  X
} from "lucide-react";

// Custom Instagram icon compatible with Lucide v1
const Instagram = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Custom Facebook icon compatible with Lucide v1
const Facebook = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// Custom Twitter icon compatible with Lucide v1
const Twitter = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

interface FooterProps {
  // Custom spacing / padding bottom to avoid floating cart collision (Fase 22.5)
  extraPaddingBottom?: boolean;
}

export default function Footer({ extraPaddingBottom = false }: FooterProps) {
  const [activeModal, setActiveModal] = React.useState<"terms" | "privacy" | "cookies" | "vision" | null>(null);

  React.useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeModal]);

  return (
    <footer className="w-full flex flex-col font-sans">
      {/* 22.1.1 Franja Superior (Gris Oscuro #5a5a5a) */}
      <div className="bg-[#5a5a5a] text-[#000000] pt-12 pb-8 px-6 border-t border-black/10">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          
          {/* 22.1.2 Columna de Propósito y Marca (Izquierda) */}
          <div className="flex flex-col space-y-4">
            {/* Propósito de Fowy (3 líneas) */}
            <p className="text-xs text-[#000000] leading-relaxed max-w-sm">
              Recupera el control de tu negocio. FOWY te libera de las comisiones abusivas y te conecta con tu ciudad, con un menú profesional.
            </p>
            <p className="text-xs text-[#000000] leading-relaxed max-w-sm">
              FOWY no es solo una herramienta digital, es tu aliado para que dejes de trabajar para las aplicaciones y empieces a hacer crecer tu propio negocio con tranquilidad.
            </p>
          </div>

          {/* 22.1.3 Columna de Enlaces Legales y Visión (Centro) */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-xs font-normal uppercase tracking-widest text-black">
              Enlaces Institucionales
            </h4>
            <div className="flex flex-col space-y-3">
              {[
                { label: "Términos y Condiciones", icon: FileText, key: "terms" },
                { label: "Políticas de Privacidad", icon: Shield, key: "privacy" },
                { label: "Políticas de Cookies", icon: Cookie, key: "cookies" },
                { label: "Nuestra Visión", icon: Eye, key: "vision" }
              ].map((link, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setActiveModal(link.key as any)}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="group flex items-center gap-3 text-sm font-normal text-[#a58100] hover:opacity-80 transition-colors duration-200 text-left w-fit cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-black/5 group-hover:bg-black/10 text-black group-hover:text-black transition-colors duration-200 shadow-sm">
                    <link.icon size={15} />
                  </div>
                  <span className="relative py-1 tracking-wide">
                    {link.label}
                    {/* Sliding expand-bar underline effect */}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#a58100] transition-all duration-300 ease-out group-hover:w-full" />
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Columna de Contacto y Redes (Derecha) - Estructura inicial */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-xs font-normal uppercase tracking-widest text-black">
              Contacto y Soporte
            </h4>
            <div className="flex flex-col space-y-2.5">
              <a 
                href="https://wa.me/573008014770" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-black hover:opacity-80 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center !text-[#000000] border !border-[#000000]">
                  <MessageCircle size={16} />
                </div>
                <span className="font-normal">+57 300 801 4770</span>
              </a>

              <a 
                href="mailto:info@fowy.pro" 
                className="flex items-center gap-2 text-sm text-black hover:opacity-80 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center !text-[#000000] border !border-[#000000]">
                  <Mail size={16} />
                </div>
                <span className="font-normal">info@fowy.pro</span>
              </a>
            </div>

            {/* Redes Sociales */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" }
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-8 h-8 rounded-full bg-black/5 border !border-[#000000] flex items-center justify-center !text-[#000000] hover:bg-black/10 transition-colors"
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 22.1.1 Franja Inferior (Negro #000000) */}
      <div className={`bg-[#000000] text-[#757575] py-5 px-6 border-t border-zinc-900 transition-all ${extraPaddingBottom ? 'pb-[140px]' : ''}`}>
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center gap-1">
          <p className="text-xs font-normal">
            &copy; {new Date().getFullYear()} FOWY. Todos los derechos reservados.
          </p>
          <p className="text-[10px] font-normal uppercase tracking-widest text-[#a58100]">
            Versión 2.7.7
          </p>
        </div>
      </div>

      {/* 22.2.1 Popup de Términos y Condiciones */}
      <AnimatePresence>
        {activeModal === "terms" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
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
                  onClick={() => setActiveModal(null)}
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
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 bg-[#a58100] hover:bg-[#8e6f00] text-white rounded-xl text-xs font-normal tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Entendido y Acepto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 22.2.2 Popup de Políticas de Privacidad */}
      <AnimatePresence>
        {activeModal === "privacy" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
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
                  onClick={() => setActiveModal(null)}
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
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 bg-[#a58100] hover:bg-[#8e6f00] text-white rounded-xl text-xs font-normal tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Entendido y Acepto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 22.2.3 Popup de Políticas de Cookies */}
      <AnimatePresence>
        {activeModal === "cookies" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
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
                  onClick={() => setActiveModal(null)}
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
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 bg-[#a58100] hover:bg-[#8e6f00] text-white rounded-xl text-xs font-normal tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Entendido y Acepto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 22.3.1 Popup "Nuestra Visión" (Crave Vision Modal) */}
      <AnimatePresence>
        {activeModal === "vision" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
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
                  onClick={() => setActiveModal(null)}
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
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 bg-[#a58100] hover:bg-[#8e6f00] text-white rounded-xl text-xs font-normal tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Unirme a la Visión
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
