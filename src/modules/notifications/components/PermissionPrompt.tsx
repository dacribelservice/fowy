'use client';

import React from 'react';
import { BellRing, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../NotificationProvider';

export const PermissionPrompt = () => {
  const { permissionStatus, requestPermission } = useNotifications();
  const [isVisible, setIsVisible] = React.useState(true);

  if (permissionStatus !== 'default' || !isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg"
    >
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/10 p-2 rounded-xl">
            <BellRing className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Activar Notificaciones</h4>
            <p className="text-xs text-gray-500">Recibe alertas en tiempo real sobre tus pedidos.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={requestPermission}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Permitir
          </button>
        </div>
      </div>
    </motion.div>
  );
};
