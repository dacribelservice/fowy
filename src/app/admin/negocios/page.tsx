"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import CategoryStrip from "@/components/admin/businesses/CategoryStrip";
import BusinessList, { Business } from "@/components/admin/businesses/BusinessList";
import AddCategoryModal from "@/components/admin/businesses/AddCategoryModal";
import AddBusinessModal from "@/components/admin/businesses/AddBusinessModal";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Store, CheckCircle2, TrendingUp, 
  TrendingDown, Calendar, ArrowUpRight, ArrowDownRight,
  Tag, Briefcase, Trash2
} from "lucide-react";
import DeleteConfirmModal from "@/components/admin/shared/DeleteConfirmModal";
import Pagination from "@/components/admin/shared/Pagination";
import StatCard from "@/components/admin/shared/StatCard";
import SuccessToast from "@/components/admin/shared/SuccessToast";
import { useBusinessStats } from "@/hooks/useBusinessStats";
import { useAdminBusinessManager } from "@/hooks/useAdminBusinessManager";

export default function NegociosPage() {
  // UI States (Controlled by User)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

  // Phase 7: Desacoplamiento de Orquestadores
  const {
    categories,
    businesses,
    loading,
    totalCount,
    globalStats,
    fetchData,
    refreshStats,
    handleDeleteCategory,
    handleDeleteBusiness,
    confirmDelete,
    updateBusinessStatus,
    createBusiness,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteConfig,
    toast,
    setToast,
    supabase
  } = useAdminBusinessManager({
    currentPage,
    pageSize,
    searchTerm,
    filterPlan,
    filterStatus
  });

  // Reset a página 1 al filtrar (Lógica de UI)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPlan, filterStatus]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-fowy-orange/10 border-t-fowy-orange rounded-full animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs text-center px-4">Sincronizando el ecosistema...</p>
      </div>
    );
  }


  return (
    <div className="pb-32 px-4 sm:px-8 max-w-full lg:max-w-[1600px] mx-auto">
      {/* Header Responsivo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 mt-4 sm:mt-0"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight mb-2 flex items-center gap-2 flex-wrap">
          Gestión de Negocios <span className="inline-block animate-bounce-slow">👋</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-xl">
          Administra y monitorea el crecimiento de todos los establecimientos afiliados a la red FOWY.
        </p>
      </motion.div>

      {/* Grid de KPIs Adaptativo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <StatCard title="Total Negocios" value={globalStats.total.toString()} icon={<Store className="text-fowy-orange" />} bgColor="bg-fowy-orange/10" />
        <StatCard title="Activos hoy" value={globalStats.activos.toString()} icon={<CheckCircle2 className="text-green-500" />} bgColor="bg-green-50" percentage="+2.5%" />
        <StatCard title="Conversión" value={`${globalStats.diff}%`} icon={globalStats.diff >= 0 ? <TrendingUp className="text-blue-500" /> : <TrendingDown className="text-red-500" />} bgColor={globalStats.diff >= 0 ? "bg-blue-50" : "bg-red-50"} trend={globalStats.diff >= 0 ? "up" : "down"} percentage={`${Math.abs(globalStats.diff)}%`} />
        <StatCard title="Vencimientos" value={globalStats.vencimientos.toString()} icon={<Calendar className="text-amber-500" />} bgColor="bg-amber-50" alert={globalStats.vencimientos > 0} />
      </div>

      {/* Categorías (Scroll Horizontal en Móvil) */}
      <section className="mb-12">
        <h3 className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Categorías de Comida</h3>
        <CategoryStrip 
          categories={categories} 
          onAddClick={() => setIsModalOpen(true)} 
          onDeleteCategory={handleDeleteCategory}
        />
      </section>

      {/* Listado con Botón de Escritorio */}
      <section className="relative">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Establecimientos Afiliados</h3>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">{totalCount} Total</span>
          </div>
          
          <button 
            onClick={() => setIsBusinessModalOpen(true)}
            className="hidden sm:flex px-6 py-4 bg-fowy-primary text-white rounded-2xl shadow-lg shadow-fowy-red/20 hover:shadow-fowy-red/30 transition-all active:scale-95 items-center gap-3 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Nuevo Negocio</span>
          </button>
        </div>
        
        <BusinessList 
          businesses={businesses} 
          onDelete={handleDeleteBusiness}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterPlan={filterPlan}
          onPlanChange={setFilterPlan}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
        />

        {/* Paginación */}
        <Pagination 
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </section>

      <AddCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => { fetchData(); refreshStats(); }} supabase={supabase} setToast={setToast} />
      <AddBusinessModal 
        isOpen={isBusinessModalOpen} 
        onClose={() => setIsBusinessModalOpen(false)} 
        onSuccess={() => { fetchData(); refreshStats(); }} 
        onSave={createBusiness}
        supabase={supabase} 
        setToast={setToast} 
      />
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete}
        title={`¿Eliminar ${deleteConfig?.type === 'category' ? 'Categoría' : 'Negocio'}?`}
        message={`¿Estás seguro de que deseas eliminar "${deleteConfig?.name}"? Esta acción no se puede deshacer.`}
      />

      <SuccessToast 
        show={toast.show} 
        message={toast.message} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}

