"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface PremiumConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'info' | 'success';
}

export const PremiumConfirmModal: React.FC<PremiumConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = 'warning'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-premium p-8 overflow-hidden"
          >
            {/* Decoration */}
            <div className={`absolute top-0 left-0 w-full h-2 ${
              type === 'warning' ? 'bg-amber-400' : 
              type === 'success' ? 'bg-green-400' : 'bg-fowy-blue'
            }`} />

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mt-4">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm ${
                type === 'warning' ? 'bg-amber-50 text-amber-500' : 
                type === 'success' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-fowy-blue'
              }`}>
                {type === 'warning' && <AlertCircle size={40} />}
                {type === 'success' && <CheckCircle2 size={40} />}
                {type === 'info' && <AlertCircle size={40} />}
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-3">{title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10">
                {description}
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`w-full py-4 rounded-2xl font-black text-white shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all ${
                    type === 'warning' ? 'bg-amber-500 shadow-amber-200' : 
                    type === 'success' ? 'bg-green-500 shadow-green-200' : 'bg-fowy-secondary shadow-blue-200'
                  }`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
