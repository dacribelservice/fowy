"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface CraveHeaderCompactProps {
  isScrolled: boolean;
  logoUrl?: string;
  name?: string;
  isOpen?: boolean;
  rating?: number;
  distance?: string;
  onBack?: () => void;
}

export function CraveHeaderCompact({
  isScrolled,
  logoUrl,
  name,
  isOpen = true,
  rating = 5.0,
  distance,
  onBack,
}: CraveHeaderCompactProps) {
  const router = useRouter();
  const handleBack = onBack || (() => router.back());

  return (
    <>
      {/* Botón de Atrás (Efecto Vidrio Premium) - Fijo sobre el scroll */}
      <motion.button
        onClick={handleBack}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-6 z-45 w-11 h-11 bg-white/20 hover:bg-white/30 border border-white/35 rounded-full flex items-center justify-center backdrop-blur-md text-white shadow-lg shadow-black/10 transition-colors duration-200 cursor-pointer"
        title="Regresar al mapa"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
      </motion.button>

      {/* Header Compacto Colapsable (Efecto Vidrio Premium) - Se desliza tras el scroll */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-0 left-0 right-0 h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-100/80 shadow-sm z-30 flex items-center justify-between px-6 pl-20"
          >
            {/* Logo y Nombre del Negocio */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200/50 shadow-inner bg-slate-100 flex-shrink-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={name || "Negocio"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 leading-tight truncate max-w-[180px]">
                  {name || "Negocio"}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  {/* Abierto en Verde Premium (#34C759) */}
                  <span
                    className="text-[10px] font-bold flex items-center gap-1.5"
                    style={{ color: isOpen ? "#34C759" : "#EF4444" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: isOpen ? "#34C759" : "#EF4444" }}
                    />
                    {isOpen ? "Abierto" : "Cerrado"}
                  </span>

                  <span className="text-[10px] text-slate-300">•</span>

                  {/* Ranking en Amarillo Premium (#FFCC00) */}
                  <div className="flex items-center gap-1 font-bold text-[10px]">
                    <Star
                      className="w-3 h-3"
                      style={{ fill: "#FFCC00", stroke: "#FFCC00" }}
                    />
                    <span className="text-slate-600">{rating}</span>
                  </div>

                  {distance && (
                    <>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        {distance}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

