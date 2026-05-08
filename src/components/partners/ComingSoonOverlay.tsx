"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lock, ShieldCheck, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface ComingSoonOverlayProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function ComingSoonOverlay({ children, title, description }: ComingSoonOverlayProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [clickCount, setClickCount] = useState<number>(0);
  const [showSecretModal, setShowSecretModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  useEffect(() => {
    // Check local storage on mount (prevents hydration mismatch)
    const unlocked = localStorage.getItem("fowy_unlocked_preview") === "true";
    setIsUnlocked(unlocked);
  }, []);

  const handleEmblemClick = () => {
    const now = Date.now();
    // Reset click count if too much time has passed between clicks (e.g., 2 seconds)
    if (now - lastClickTime > 2000) {
      setClickCount(1);
    } else {
      const nextCount = clickCount + 1;
      setClickCount(nextCount);
      if (nextCount === 3) {
        setShowSecretModal(true);
        setClickCount(0);
        toast.info("Acceso oculto detectado 🗝️", {
          description: "Ingresa la clave para desbloquear temporalmente el módulo.",
          duration: 3000,
        });
      }
    }
    setLastClickTime(now);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "8462Ee%829Vv") {
      localStorage.setItem("fowy_unlocked_preview", "true");
      setIsUnlocked(true);
      setShowSecretModal(false);
      toast.success("¡Desbloqueado con éxito! 🎉", {
        description: "Ahora tienes acceso completo de pruebas.",
      });
    } else {
      toast.error("Clave incorrecta", {
        description: "Inténtalo de nuevo.",
      });
      setPassword("");
    }
  };

  const handleResetLock = () => {
    localStorage.removeItem("fowy_unlocked_preview");
    setIsUnlocked(false);
    toast.success("Módulo bloqueado nuevamente");
  };

  // Prevent rendering children/overlay until client-side state is determined
  if (isUnlocked === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-fowy-secondary/20 border-t-fowy-secondary animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px] w-full">
      {/* Reset lock button for testing purposes - floating in a corner if unlocked */}
      {isUnlocked && (
        <button
          onClick={handleResetLock}
          className="fixed bottom-24 right-6 z-50 p-3 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full shadow-lg backdrop-blur-sm flex items-center justify-center transition-all text-xs font-bold gap-2 hover:scale-105 border border-white/10"
          title="Bloquear de nuevo (pruebas)"
        >
          <Lock size={14} />
          <span>Volver a bloquear</span>
        </button>
      )}

      {/* Main Page Content */}
      <div
        className={
          isUnlocked
            ? "transition-all duration-700 ease-out"
            : "filter blur-[8px] md:blur-[12px] opacity-40 pointer-events-none select-none transition-all duration-700"
        }
      >
        {children}
      </div>

      {/* Overlay Shield & Coming Soon card */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center px-4 py-12 z-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="glass-morphism p-8 md:p-12 rounded-[2.5rem] max-w-lg w-full shadow-[0_30px_70px_rgba(0,0,0,0.15)] text-center border border-white/50 relative overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-fowy-secondary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-fowy-blue/10 blur-3xl pointer-events-none" />

            {/* Tap Emblem with animation loop */}
            <motion.div
              onClick={handleEmblemClick}
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 bg-gradient-to-tr from-[#FF9A3D] to-[#FF5A5F] rounded-[2rem] flex items-center justify-center text-5xl shadow-[0_15px_30px_rgba(255,90,95,0.3)] mx-auto mb-8 cursor-pointer select-none border-t border-t-white/30 relative group"
            >
              <div className="absolute inset-0 bg-white/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              🚀
            </motion.div>

            {/* Content text */}
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight mb-4">
              {title}
            </h3>
            
            <p className="text-slate-500 leading-relaxed text-sm md:text-base font-medium max-w-md mx-auto mb-8">
              {description}
            </p>

            {/* Fowy stamp info badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles size={14} className="text-fowy-secondary animate-pulse" />
              Módulo exclusivo en preparación
            </div>
          </motion.div>
        </div>
      )}

      {/* Secret Password Modal popup */}
      <AnimatePresence>
        {showSecretModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecretModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-white text-center z-10"
            >
              {/* Invisible key indicator icon */}
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Lock size={22} />
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 text-center rounded-2xl bg-white border border-slate-200 text-slate-850 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-fowy-secondary focus:border-transparent shadow-sm text-sm"
                  autoFocus
                />
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSecretModal(false);
                      setPassword("");
                    }}
                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-[#FF9A3D] to-[#FF5A5F] text-white font-black rounded-2xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  >
                    Acceder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
