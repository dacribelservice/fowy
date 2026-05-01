"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface SuccessToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessToast({ show, message, onClose }: SuccessToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.9, x: "-50%" }}
          className="fixed bottom-10 left-1/2 z-[100] px-6 py-4 bg-slate-900 text-white rounded-3xl shadow-2xl flex items-center gap-3 min-w-[300px]"
        >
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} className="text-white" />
          </div>
          <p className="text-sm font-bold">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
