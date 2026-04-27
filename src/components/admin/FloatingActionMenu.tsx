"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, LayoutDashboard, Store, Users, 
  Briefcase, UserCircle, Wallet, ShieldCheck 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { icon: <LayoutDashboard size={22} />, href: "/admin/dashboard", delay: 0.3 },
    { icon: <Store size={22} />, href: "/admin/negocios", delay: 0.25 },
    { icon: <Users size={22} />, href: "/admin/vendedores", delay: 0.2 },
    { icon: <Briefcase size={22} />, href: "/admin/profesionales", delay: 0.15 },
    { icon: <UserCircle size={22} />, href: "/admin/usuarios", delay: 0.1 },
    { icon: <Wallet size={22} />, href: "/admin/finanzas", delay: 0.05 },
    { icon: <ShieldCheck size={22} />, href: "/admin/seguridad", delay: 0 },
  ];

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[60] xl:hidden">
        <AnimatePresence>
          {isOpen && (
            <div className="flex flex-col items-center gap-3 mb-4">
              {menuItems.map((item, idx) => (
                <FabSubButton 
                  key={idx}
                  onClick={() => { router.push(item.href); setIsOpen(false); }}
                  icon={item.icon}
                  delay={item.delay}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-fowy-primary text-white rounded-full shadow-2xl shadow-fowy-red/40 flex items-center justify-center relative z-10"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Plus size={32} />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] xl:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}

function FabSubButton({ onClick, icon, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 30 }}
      transition={{ type: "spring", damping: 15, stiffness: 250, delay }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all active:scale-90 border border-white/10 bg-white text-fowy-primary">
        {icon}
      </div>
    </motion.div>
  );
}
