'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/modules/notifications/NotificationProvider';
import { NotificationItem } from '@/modules/notifications/components/NotificationItem';
import { 
  Bell, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationHistoryPage() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'important'>('all');

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         n.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ? true : 
                       activeTab === 'unread' ? !n.is_read :
                       n.type === 'order'; // 'important' shows orders
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Historial de Notificaciones</h1>
          <p className="text-gray-500 mt-1 font-medium">Gestiona y revisa todas tus alertas del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => markAllAsRead()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Marcar todo como leído
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Recibidas</p>
          <div className="flex items-end gap-3 mt-2">
            <h3 className="text-4xl font-black text-gray-900">{notifications.length}</h3>
            <span className="text-green-500 text-xs font-bold mb-1.5 flex items-center gap-0.5">
              +12% <ArrowUpDown className="w-3 h-3" />
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-indigo-500 uppercase tracking-wider">Sin Leer</p>
          <div className="flex items-end gap-3 mt-2">
            <h3 className="text-4xl font-black text-gray-900">{unreadCount}</h3>
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse mb-3" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-orange-500 uppercase tracking-wider">Pedidos</p>
          <div className="flex items-end gap-3 mt-2">
            <h3 className="text-4xl font-black text-gray-900">
              {notifications.filter(n => n.type === 'order').length}
            </h3>
            <span className="text-gray-400 text-xs font-bold mb-1.5 italic">Últimos 30 días</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex p-1.5 bg-gray-50/50 rounded-2xl w-fit">
              {(['all', 'unread', 'important'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'all' ? 'Todas' : tab === 'unread' ? 'Sin leer' : 'Importantes'}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Buscar notificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 w-full sm:w-[300px] transition-all"
                />
              </div>
              <button className="p-2.5 text-gray-500 hover:text-gray-900 bg-gray-50 rounded-2xl transition-colors">
                <Calendar className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-gray-500 hover:text-gray-900 bg-gray-50 rounded-2xl transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-50">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-10 h-10 text-indigo-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No se encontraron notificaciones</h3>
                <p className="text-gray-500 mt-1 max-w-[280px]">
                  {searchTerm 
                    ? `No hay resultados para "${searchTerm}" en esta sección.`
                    : 'Tu bandeja de entrada está limpia por ahora.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Mostrando {filteredNotifications.length} de {notifications.length} notificaciones
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-900 disabled:opacity-50 transition-all shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1">
              {[1].map(p => (
                <button key={p} className="w-10 h-10 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-lg shadow-gray-200">
                  {p}
                </button>
              ))}
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
