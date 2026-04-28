import React from "react";
import Sidebar from "@/components/admin/Sidebar";
import FloatingActionMenu from "@/components/admin/FloatingActionMenu";
import { NotificationBell } from "@/modules/notifications/components/NotificationBell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50/50">
      {/* Sidebar Fijo */}
      <Sidebar />

      {/* Contenido Principal con Scroll */}
      <main className="flex-1 ml-0 xl:ml-[320px] p-4 sm:p-8 pt-6 overflow-y-auto relative">
        {/* Top Header con Notificaciones */}
        <div className="flex justify-end items-center mb-6 px-4 sm:px-0">
          <NotificationBell />
        </div>

        <div className="max-w-full lg:max-w-7xl mx-auto">
          {children}
        </div>
        
        {/* Menú Flotante Global para Móvil */}
        <FloatingActionMenu />
      </main>
    </div>
  );
}
