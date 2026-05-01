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

export default function NegociosPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fase 8.1 y 8.2: Paginación y Búsqueda Server-side
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8); 
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [globalStats, setGlobalStats] = useState({
    total: 0,
    activos: 0,
    vencimientos: 0,
    diff: 0
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{ id: string, name: string, type: 'category' | 'business', imageUrl?: string } | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const supabase = createClient();

  // 1. Obtener Stats Globales (independiente de filtros)
  const fetchGlobalStats = useCallback(async () => {
    try {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('created_at, status, payment_date');

      if (businesses) {
        const total = businesses.length;
        const activos = businesses.filter((b: any) => b.status === true || b.status === 'true' || b.status === 'active' || b.status === 'activo').length;
        const hoy = new Date();
        const en7Dias = new Date();
        en7Dias.setDate(hoy.getDate() + 7);
        
        const vencimientos = businesses.filter((b: any) => {
          if (!b.payment_date) return false;
          const fechaPago = new Date(b.payment_date);
          return fechaPago >= hoy && fechaPago <= en7Dias;
        }).length;

        const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const inicioMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const nuevosEsteMes = businesses.filter((b: any) => new Date(b.created_at) >= inicioMesActual).length;
        const nuevosMesPasado = businesses.filter((b: any) => {
          const d = new Date(b.created_at);
          return d >= inicioMesPasado && d < inicioMesActual;
        }).length;

        let diff = 0;
        if (nuevosMesPasado > 0) diff = ((nuevosEsteMes - nuevosMesPasado) / nuevosMesPasado) * 100;
        else if (nuevosEsteMes > 0) diff = 100;

        setGlobalStats({ total, activos, vencimientos, diff: Math.round(diff) });
      }
    } catch (e) {
      console.error("Error stats:", e);
    }
  }, [supabase]);

  // 2. Obtener Datos Paginados y Filtrados
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      setCategories(catData || []);

      let query = supabase
        .from('businesses')
        .select('*', { count: 'exact' });

      // Filtro de búsqueda (Nombre o ID)
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
      }

      // Filtro de Plan
      if (filterPlan !== "all") {
        query = query.eq('plan', filterPlan);
      }

      // Filtro de Estatus
      if (filterStatus !== "all") {
        query = query.eq('status', filterStatus === "active");
      }

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data: busData, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setBusinesses((busData as any) || []);
      setTotalCount(count || 0);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, currentPage, pageSize, searchTerm, filterPlan, filterStatus]);

  useEffect(() => {
    fetchData();
    fetchGlobalStats();
  }, [fetchData, fetchGlobalStats]);

  // Reset a página 1 al filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPlan, filterStatus]);

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    setDeleteConfig({ id, name: cat?.name || 'esta categoría', type: 'category', imageUrl: cat?.image_url });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteBusiness = (business: Business) => {
    setDeleteConfig({ id: business.id, name: business.name, type: 'business', imageUrl: business.logo_url });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfig) return;
    
    try {
      // 1. Storage Cleanup (Fase 8.3)
      if (deleteConfig.imageUrl) {
        try {
          const bucket = deleteConfig.type === 'category' ? 'categories' : 'logos';
          // Extraer el nombre del archivo de la URL pública
          const fileName = deleteConfig.imageUrl.split('/').pop();
          if (fileName) {
            await supabase.storage.from(bucket).remove([fileName]);
            console.log(`Storage: ${fileName} eliminado de ${bucket}`);
          }
        } catch (storageErr) {
          console.error("Error cleaning up storage:", storageErr);
          // Continuamos con la eliminación de DB incluso si falla el storage
        }
      }

      // 2. Database Deletion
      const table = deleteConfig.type === 'category' ? 'categories' : 'businesses';
      const { error, count } = await supabase
        .from(table)
        .delete({ count: 'exact' })
        .eq('id', deleteConfig.id);
      
      if (error) throw error;
      
      // Si no hubo error pero tampoco se borró nada (count 0), suele ser por RLS
      if (count === 0) {
        setToast({ show: true, message: "⚠️ No se pudo eliminar: Permisos insuficientes." });
        return;
      }

      setToast({ show: true, message: "✅ Eliminado correctamente" });
      fetchData();
    } catch (error: any) {
      console.error(`Error deleting ${deleteConfig.type}:`, error);
      setToast({ show: true, message: `❌ Error: ${error.message || "Error desconocido"}` });
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteConfig(null);
    }
  };

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

      <AddCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchData} supabase={supabase} setToast={setToast} />
      <AddBusinessModal isOpen={isBusinessModalOpen} onClose={() => setIsBusinessModalOpen(false)} onSuccess={fetchData} supabase={supabase} setToast={setToast} />
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

