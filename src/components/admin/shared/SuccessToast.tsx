"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessToast({ show, message, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 20, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className="fixed top-4 left-1/2 z-[110] w-full max-w-[320px] px-6 py-4 bg-white/80 backdrop-blur-md border border-green-100 rounded-3xl shadow-2xl shadow-green-100/50 flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-green-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-green-200">
            <CheckCircle2 size={24} />
          </div>
          
          <div className="flex-1">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Sistema FOWY</p>
            <p className="text-sm font-bold text-slate-700">{message}</p>
          </div>

          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
