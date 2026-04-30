"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X } from "lucide-react";

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationPermissionModal({ isOpen, onClose }: LocationPermissionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[320px] bg-white/90 backdrop-blur-2xl rounded-[30px] shadow-2xl border border-white/50 overflow-hidden"
          >
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-[20px] flex items-center justify-center text-white mb-6 shadow-xl shadow-orange-200">
                <MapPin size={32} />
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">Activar Ubicación</h3>
              
              <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
                Para mostrarte los mejores locales cerca de ti, necesitamos acceder a tu ubicación.
              </p>
              
              <button
                onClick={onClose}
                className="w-full py-4 bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white rounded-[20px] font-black text-sm uppercase tracking-[2px] shadow-lg shadow-orange-200 active:scale-95 transition-all"
              >
                Entendido
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
