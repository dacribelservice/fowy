'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../NotificationProvider';
import { NotificationItem } from './NotificationItem';
import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute right-0 mt-3 w-[380px] origin-top-right rounded-[24px] border border-white/20 bg-white/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100/50 bg-white/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-200">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">Notificaciones</h3>
          </div>
          <button 
            onClick={() => markAllAsRead()}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-indigo-50"
          >
            Marcar todo leído
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
              filter === 'all' 
                ? 'bg-gray-900 text-white shadow-md shadow-gray-200' 
                : 'bg-white/50 text-gray-600 hover:bg-white'
            }`}
          >
            Todas
            {notifications.length > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] ${filter === 'all' ? 'bg-white/20' : 'bg-gray-100'}`}>
                {notifications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
              filter === 'unread' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'bg-white/50 text-gray-600 hover:bg-white'
            }`}
          >
            Sin leer
            {unreadCount > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] ${filter === 'unread' ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-grow max-h-[450px] overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center px-10"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-900">Estás al día</p>
              <p className="text-xs text-gray-500 mt-1">No hay notificaciones {filter === 'unread' ? 'sin leer ' : ''}por ahora.</p>
            </motion.div>
          ) : (
            filteredNotifications.map((n) => (
              <NotificationItem 
                key={n.id} 
                notification={n} 
                onClick={onClose}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100/50 flex justify-between items-center">
        <Link 
          href="/admin/notifications" 
          onClick={onClose}
          className="text-xs font-bold text-gray-900 hover:text-indigo-600 transition-colors flex items-center gap-2"
        >
          Ver todo el historial
          <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            →
          </motion.span>
        </Link>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-white">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
