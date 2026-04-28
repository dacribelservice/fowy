'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../NotificationProvider';
import { NotificationDropdown } from './NotificationDropdown';

export const NotificationBell = () => {
  const { unreadCount, requestPermission } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          // Request permission on first interaction if not granted
          if (typeof window !== 'undefined' && Notification.permission === 'default') {
            requestPermission();
          }
        }}
        className={`relative p-2.5 transition-all duration-300 rounded-[16px] border ${
          isOpen 
            ? 'bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-200' 
            : 'bg-white/40 backdrop-blur-md border-white/20 text-gray-700 hover:bg-white hover:shadow-lg'
        }`}
      >
        <Bell className={`w-5 h-5 ${isOpen ? 'animate-none' : ''}`} />
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-[0_2px_10px_rgba(239,68,68,0.4)] border-2 border-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <NotificationDropdown onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

