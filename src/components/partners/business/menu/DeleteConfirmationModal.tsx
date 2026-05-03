"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2, CheckCircle2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false
}: DeleteConfirmationModalProps) {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 } 
    },
    exit: { 
      scale: 0.9, 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="relative w-full max-w-md bg-white rounded-fowy shadow-premium overflow-hidden border border-white/50"
          >
            {/* Header / Icon Section */}
            <div className="p-8 pb-4 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 relative">
                <div className="absolute inset-0 bg-red-500/10 rounded-2xl animate-ping" />
                <Trash2 size={32} className="relative z-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed px-4">
                {description}
              </p>
            </div>

            {/* Footer / Actions */}
            <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-4 px-6 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all border border-slate-100 active:scale-95 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 size={18} />
                    Eliminar
                  </>
                )}
              </button>
            </div>

            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
