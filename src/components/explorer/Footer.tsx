"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Shield, 
  Cookie, 
  Eye, 
  Mail, 
  MessageCircle 
} from "lucide-react";
import { Instagram, Facebook, Twitter } from "../shared/icons/SocialIcons";
import dynamic from "next/dynamic";

const TermsModal = dynamic(() => import("./modals/legal/TermsModal"), { ssr: false });
const PrivacyModal = dynamic(() => import("./modals/legal/PrivacyModal"), { ssr: false });
const CookiesModal = dynamic(() => import("./modals/legal/CookiesModal"), { ssr: false });
const VisionModal = dynamic(() => import("./modals/legal/VisionModal"), { ssr: false });

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
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#a58100] transition-all duration-300 ease-out group-hover:w-full" />
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Columna de Contacto y Redes (Derecha) */}
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

      {/* Modales Extraídos */}
      {activeModal === "terms" && <TermsModal isOpen={activeModal === "terms"} onClose={() => setActiveModal(null)} />}
      {activeModal === "privacy" && <PrivacyModal isOpen={activeModal === "privacy"} onClose={() => setActiveModal(null)} />}
      {activeModal === "cookies" && <CookiesModal isOpen={activeModal === "cookies"} onClose={() => setActiveModal(null)} />}
      {activeModal === "vision" && <VisionModal isOpen={activeModal === "vision"} onClose={() => setActiveModal(null)} />}

    </footer>
  );
}
