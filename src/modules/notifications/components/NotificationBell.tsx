'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../NotificationProvider';

export const NotificationBell = () => {
  const { unreadCount, notifications, requestPermission } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (unreadCount > 0) {
            // Logic to mark as read could go here
          }
          // Request permission on first interaction if not granted
          if (Notification.permission === 'default') {
            requestPermission();
          }
        }}
        className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg"
      >
        <Bell className="w-6 h-6" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 origin-top-right rounded-2xl border border-white/20 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-100 bg-white/50">
              <h3 className="text-sm font-bold text-gray-900">Notificaciones</h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No tienes notificaciones
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-gray-50/50 hover:bg-white/50 transition-colors cursor-pointer ${
                      !n.is_read ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{n.body}</p>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50/50 text-center">
                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  Ver todas
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
