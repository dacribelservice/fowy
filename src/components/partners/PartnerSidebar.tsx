"use client";

import React from "react";
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
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mainItems = [
  { name: "Dashboard", href: "/business", icon: TrendingUp },
  { name: "Pedidos", href: "/business/orders", icon: ShoppingBag },
  { name: "Mi Menú", href: "/business/menu", icon: Utensils },
];

const perfilItems = [
  { name: "Branding & Perfil", href: "/business/perfil", icon: User },
  { name: "Mi Plan (Pagos)", href: "/business/finanzas", icon: CreditCard },
  { name: "Mis Módulos", href: "/business/modulos", icon: Puzzle },
  { name: "Expertos FOWY", href: "/business/expertos", icon: Sparkles },
  { name: "Panel Experto", href: "/business/expert", icon: Briefcase },
];

export default function PartnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-72 glass-morphism rounded-fowy shadow-glass hidden xl:flex flex-col p-6 z-50">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-fowy-secondary rounded-xl flex items-center justify-center shadow-premium">
          <span className="text-white font-bold text-xl">F</span>
        </div>
        <h1 className="text-2xl font-bold bg-fowy-secondary bg-clip-text text-transparent tracking-tight">
          FOWY PARTNER
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        {/* Main Section */}
        <div className="space-y-2">
          {mainItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href} className="block">
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-fowy transition-all duration-300 group",
                    isActive 
                      ? "bg-fowy-secondary text-white shadow-premium" 
                      : "text-slate-500 hover:bg-white/50 hover:text-fowy-blue"
                  )}
                >
                  <Icon size={20} className={cn("transition-colors", isActive ? "text-white" : "group-hover:text-fowy-blue")} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill-partner"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Profile Section */}
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Ajustes de Perfil
          </p>
          {perfilItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href} className="block">
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-fowy transition-all duration-300 group",
                    isActive 
                      ? "bg-fowy-secondary text-white shadow-premium" 
                      : "text-slate-500 hover:bg-white/50 hover:text-fowy-blue"
                  )}
                >
                  <Icon size={20} className={cn("transition-colors", isActive ? "text-white" : "group-hover:text-fowy-blue")} />
                  <span className="text-sm font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill-partner"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Business Account */}
      <div className="mt-auto pt-6 border-t border-white/20">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-fowy-primary flex items-center justify-center text-white font-bold">
            B
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none">Mi Negocio</p>
            <p className="text-xs text-slate-500 mt-1 truncate max-w-[150px]">socio@fowy.com</p>
          </div>
        </div>
        <button className="flex items-center gap-4 px-4 py-3 w-full rounded-fowy text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all">
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
