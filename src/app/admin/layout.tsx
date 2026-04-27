import React from "react";
import Sidebar from "@/components/admin/Sidebar";
import FloatingActionMenu from "@/components/admin/FloatingActionMenu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar Fijo */}
      <Sidebar />

      {/* Contenido Principal con Scroll */}
      <main className="flex-1 ml-0 xl:ml-[320px] p-4 sm:p-8 pt-14 overflow-y-auto relative">
        <div className="max-w-full lg:max-w-7xl mx-auto">
          {children}
        </div>
        
        {/* Menú Flotante Global para Móvil */}
        <FloatingActionMenu />
      </main>
    </div>
  );
}
