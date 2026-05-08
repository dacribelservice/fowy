"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  TrendingUp, 
  ShoppingBag, 
  Utensils, 
  User, 
  CreditCard, 
  LogOut,
  Puzzle,
  Sparkles,
  Briefcase,
  Palette,
  ChevronRight,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

const mainItems = [
  { name: "Dashboard", href: "/business", icon: TrendingUp },
  { name: "Pedidos", href: "/business/orders", icon: ShoppingBag },
  { name: "Mi Menú", href: "/business/menu", icon: Utensils },
];

const perfilItems = [
  { name: "Perfil General", href: "/business/perfil", icon: User },
  { name: "Branding & Banners", href: "/business/branding", icon: Palette },
  { name: "Mi Plan (Pagos)", href: "/business/finanzas", icon: CreditCard },
  { name: "Mis Módulos", href: "/business/modulos", icon: Puzzle },
  { name: "Expertos FOWY", href: "/business/expertos", icon: Sparkles },
  { name: "Panel Experto", href: "/business/expert", icon: Briefcase },
];

export default function PartnerMobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("socio@fowy.com");
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    fetchUser();
  }, [supabase]);

  // Bloquear el scroll del body cuando el menú esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    window.location.href = "/login";
  };

  return (
    <>
      {/* Botón Flotante FAB (solo visible en pantallas menores a xl) */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.90 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 xl:hidden w-14 h-14 rounded-full bg-gradient-to-b from-[#FF9A3D] to-[#FF5A5F] text-white shadow-[0_8px_30px_rgba(255,90,95,0.5)] hover:shadow-[0_12px_35px_rgba(255,90,95,0.7)] flex items-center justify-center border-t-2 border-t-white/40 border-r border-r-white/20 border-l border-l-white/20 border-b-2 border-b-black/30 transition-all cursor-pointer"
        aria-label="Abrir menú de navegación"
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex items-center justify-center"
        >
          <Plus size={26} strokeWidth={2.5} className="drop-shadow-sm" />
        </motion.div>
      </motion.button>

      {/* Overlay (Fondo oscuro sutil con click-outside) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 z-40 xl:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Side Menu Drawer (Desliza de Izquierda a Derecha) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 w-[290px] bg-white z-40 xl:hidden shadow-2xl flex flex-col rounded-r-[24px] overflow-hidden border-r border-slate-100"
          >
            {/* Cabecera idéntica a la del Explorador */}
            <div className="px-6 pt-8 pb-5 border-b border-slate-50 flex flex-col">
              {/* Logo o Marca en Móvil */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow border border-slate-100 p-1">
                  <img src="/assets/icono png.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <img src="/assets/fowy png.png" alt="FOWY" className="h-6 object-contain" />
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                Sesión iniciada
              </span>
              <span className="text-sm font-bold text-slate-800 truncate" title={userEmail}>
                {userEmail}
              </span>
            </div>

            {/* Listado de Opciones del Menú */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
              {/* Ítems Principales */}
              {mainItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-[16px] transition-colors group ${
                      isActive 
                        ? "bg-slate-50 text-slate-900 font-bold" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon 
                        size={18} 
                        strokeWidth={2} 
                        className={`transition-colors ${
                          isActive 
                            ? "text-fowy-secondary" 
                            : "text-slate-400 group-hover:text-slate-800"
                        }`} 
                      />
                      <span className="text-sm font-bold">{item.name}</span>
                    </div>
                    <ChevronRight 
                      size={14} 
                      className={`transition-colors ${
                        isActive 
                          ? "text-slate-850" 
                          : "text-slate-300 group-hover:text-slate-800"
                      }`} 
                    />
                  </Link>
                );
              })}

              {/* Separador de Sección */}
              <div className="h-px bg-slate-100 my-2 mx-2" />

              {/* Ajustes de Perfil */}
              <div className="px-4 py-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Ajustes de Perfil
                </p>
              </div>

              {perfilItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-[16px] transition-colors group ${
                      isActive 
                        ? "bg-slate-50 text-slate-900 font-bold" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon 
                        size={18} 
                        strokeWidth={2} 
                        className={`transition-colors ${
                          isActive 
                            ? "text-fowy-secondary" 
                            : "text-slate-400 group-hover:text-slate-800"
                        }`} 
                      />
                      <span className="text-sm font-bold">{item.name}</span>
                    </div>
                    <ChevronRight 
                      size={14} 
                      className={`transition-colors ${
                        isActive 
                          ? "text-slate-850" 
                          : "text-slate-300 group-hover:text-slate-800"
                      }`} 
                    />
                  </Link>
                );
              })}
            </div>

            {/* Separador del Pie de Página */}
            <div className="h-px bg-slate-100 my-1 mx-5" />

            {/* Botón de Cerrar Sesión (Idéntico al Explorador) */}
            <div className="p-3 bg-white">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] text-red-500 hover:bg-red-50 transition-colors group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all flex-shrink-0">
                  <LogOut size={16} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black uppercase tracking-wider">
                  Cerrar sesión
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
