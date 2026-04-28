'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../NotificationProvider';
import { Circle, MessageSquare, AlertCircle, ShoppingBag, Clock } from 'lucide-react';

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    body: string;
    type: string;
    is_read: boolean;
    created_at: string;
  };
  onClick?: () => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <ShoppingBag className="w-4 h-4 text-orange-500" />;
    case 'alert':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <MessageSquare className="w-4 h-4 text-blue-500" />;
  }
};

export const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  const { markAsRead } = useNotifications();

  const handleClick = async () => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    if (onClick) onClick();
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Ahora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`group relative p-4 flex gap-4 transition-all duration-300 hover:bg-white/40 cursor-pointer border-b border-gray-100/50 ${
        !notification.is_read ? 'bg-indigo-50/20 shadow-inner' : ''
      }`}
      onClick={handleClick}
    >
      <div className="relative flex-shrink-0 mt-1">
        <div className={`p-2 rounded-xl ${!notification.is_read ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
          {getIcon(notification.type)}
        </div>
        {!notification.is_read && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className={`text-sm font-semibold truncate ${!notification.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
            {notification.title}
          </h4>
          <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(notification.created_at)}
          </span>
        </div>
        <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${!notification.is_read ? 'text-gray-700' : 'text-gray-500'}`}>
          {notification.body}
        </p>
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Circle className="w-2 h-2 text-indigo-200 fill-current" />
      </div>
    </motion.div>
  );
};
