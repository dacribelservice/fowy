"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  Briefcase, 
  UserCircle, 
  Wallet, 
  ShieldCheck, 
  LogOut 
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Negocios", href: "/admin/negocios", icon: Store },
  { name: "Vendedores", href: "/admin/vendedores", icon: Users },
  { name: "Profesionales", href: "/admin/profesionales", icon: Briefcase },
  { name: "Usuarios", href: "/admin/usuarios", icon: UserCircle },
  { name: "Finanzas", href: "/admin/finanzas", icon: Wallet },
  { name: "Seguridad", href: "/admin/seguridad", icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-72 glass-morphism rounded-fowy shadow-glass hidden xl:flex flex-col p-6 z-50">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-premium overflow-hidden">
          <img 
            src="/assets/icono rojo favicon.png" 
            alt="FOWY Logo" 
            className="w-7 h-7 object-contain"
          />
        </div>
        <img 
          src="/assets/fowy png.png" 
          alt="FOWY" 
          className="h-8 object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href} className="block">
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-fowy transition-all duration-300 group",
                  isActive 
                    ? "bg-fowy-primary text-white shadow-premium" 
                    : "text-slate-500 hover:bg-white/50 hover:text-fowy-red"
                )}
              >
                <Icon size={20} className={cn("transition-colors", isActive ? "text-white" : "group-hover:text-fowy-red")} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="mt-auto pt-6 border-t border-white/20">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-fowy-secondary flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none">Juan Doe</p>
            <p className="text-xs text-slate-500 mt-1">Super Admin</p>
          </div>
        </div>
        <button className="flex items-center gap-4 px-4 py-3 w-full rounded-fowy text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all">
          <LogOut size={20} />
          <span className="font-medium">Salir</span>
        </button>
      </div>
    </aside>
  );
}
