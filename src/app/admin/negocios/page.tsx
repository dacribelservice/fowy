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
import SuccessToast from "@/components/admin/shared/SuccessToast";

export default function NegociosPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{ id: string, name: string, type: 'category' | 'business' } | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      
      const { data: busData } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });
      
      setCategories(catData || []);
      setBusinesses((busData as any) || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    const total = businesses.length;
    const activos = businesses.filter(b => b.status === true || b.status === 'true' || b.status === 'active' || b.status === 'activo').length;
    const hoy = new Date();
    const en7Dias = new Date();
    en7Dias.setDate(hoy.getDate() + 7);
    
    const vencimientos = businesses.filter(b => {
      if (!b.payment_date) return false;
      const fechaPago = new Date(b.payment_date);
      return fechaPago >= hoy && fechaPago <= en7Dias;
    }).length;

    const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const inicioMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const nuevosEsteMes = businesses.filter(b => new Date(b.created_at) >= inicioMesActual).length;
    const nuevosMesPasado = businesses.filter(b => {
      const d = new Date(b.created_at);
      return d >= inicioMesPasado && d < inicioMesActual;
    }).length;

    let diff = 0;
    if (nuevosMesPasado > 0) diff = ((nuevosEsteMes - nuevosMesPasado) / nuevosMesPasado) * 100;
    else if (nuevosEsteMes > 0) diff = 100;

    return { total, activos, vencimientos, diff: Math.round(diff) };
  }, [businesses]);

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    setDeleteConfig({ id, name: cat?.name || 'esta categoría', type: 'category' });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteBusiness = (id: string, name: string) => {
    setDeleteConfig({ id, name, type: 'business' });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfig) return;
    
    try {
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
        <StatCard title="Total Negocios" value={stats.total.toString()} icon={<Store className="text-fowy-orange" />} bgColor="bg-fowy-orange/10" />
        <StatCard title="Activos hoy" value={stats.activos.toString()} icon={<CheckCircle2 className="text-green-500" />} bgColor="bg-green-50" percentage="+2.5%" />
        <StatCard title="Conversión" value={`${stats.diff}%`} icon={stats.diff >= 0 ? <TrendingUp className="text-blue-500" /> : <TrendingDown className="text-red-500" />} bgColor={stats.diff >= 0 ? "bg-blue-50" : "bg-red-50"} trend={stats.diff >= 0 ? "up" : "down"} percentage={`${Math.abs(stats.diff)}%`} />
        <StatCard title="Vencimientos" value={stats.vencimientos.toString()} icon={<Calendar className="text-amber-500" />} bgColor="bg-amber-50" alert={stats.vencimientos > 0} />
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
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">{businesses.length} Total</span>
          </div>
          
          <button 
            onClick={() => setIsBusinessModalOpen(true)}
            className="hidden sm:flex px-6 py-4 bg-fowy-primary text-white rounded-2xl shadow-lg shadow-fowy-red/20 hover:shadow-fowy-red/30 transition-all active:scale-95 items-center gap-3 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Nuevo Negocio</span>
          </button>
        </div>
        
        <BusinessList businesses={businesses} onDelete={handleDeleteBusiness} />
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

function StatCard({ title, value, icon, bgColor, percentage, trend, alert }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] shadow-sm shadow-slate-200 border border-slate-50 flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${bgColor}`}>
          {React.cloneElement(icon, { size: 18 })}
        </div>
        {percentage && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black ${trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {trend === 'down' ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
            {percentage}
          </div>
        )}
        {alert && (
          <div className="animate-pulse flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black bg-amber-100 text-amber-700">¡Hoy!</div>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">{title}</p>
        <h4 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{value}</h4>
      </div>
    </motion.div>
  );
}
