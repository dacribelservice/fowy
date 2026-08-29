"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Store, MapPin, Eye, ShoppingBag, Clapperboard, TrendingUp } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { BusinessReel } from "@/types/reels";
import { useReelsManager } from "@/hooks/useReelsManager";
import { ReelsTrafficChart } from "@/components/admin/reels/ReelsTrafficChart";
import { ReelsBusinessGallery } from "@/components/admin/reels/ReelsBusinessGallery";
import { ReelFormModal } from "@/components/admin/reels/ReelFormModal";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import DeleteConfirmModal from "@/components/admin/shared/DeleteConfirmModal";
import SuccessToast from "@/components/admin/shared/SuccessToast";

export default function BusinessReelsPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = use(params);
  const supabase = createClient();
  const { reels, loading, fetchReels, toggleReelStatus, deleteReel } = useReelsManager(businessId);

  const [business, setBusiness] = useState<{ id: string; name: string; logo_url: string | null; city: string | null; plan: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reelToEdit, setReelToEdit] = useState<BusinessReel | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reelToDelete, setReelToDelete] = useState<BusinessReel | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    async function loadBusiness() {
      const { data } = await supabase.from("businesses").select("id, name, logo_url, city, plan").eq("id", businessId).single();
      if (data) setBusiness(data);
    }
    loadBusiness();
  }, [businessId, supabase]);

  const totalViews = reels.reduce((acc, r) => acc + (r.viewsCount || 0), 0);
  const totalClicks = reels.reduce((acc, r) => acc + (r.clicksToMenuCount || 0), 0);
  const conversionRate = totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0;

  const handleConfirmDelete = async () => {
    if (!reelToDelete) return;
    try {
      await deleteReel(reelToDelete.id, reelToDelete.thumbnailUrl);
      setToast({ show: true, message: "Reel eliminado correctamente" });
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsDeleteModalOpen(false);
      setReelToDelete(null);
    }
  };

  return (
    <div className="pb-32 px-4 sm:px-8 max-w-full lg:max-w-[1600px] mx-auto space-y-8">
      {/* Back Button */}
      <div className="pt-2">
        <Link
          href="/admin/reels"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-100 text-slate-500 hover:text-fowy-orange font-bold text-xs shadow-sm transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Volver al Listado de Fowy Reels</span>
        </Link>
      </div>

      {/* Header with Business Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-50 shrink-0">
            <PremiumImage src={business?.logo_url || ""} alt={business?.name || ""} className="w-full h-full" fallbackType="logo" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                {business?.name || "Cargando restaurante..."}
              </h1>
              {business?.plan && (
                <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-orange-50 text-fowy-orange border border-orange-100">
                  {business.plan}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mt-1">
              <MapPin size={13} className="text-slate-400" />
              <span>{business?.city || "Sede Principal"}</span>
              <span>•</span>
              <span className="text-slate-600 font-bold">{reels.length} {reels.length === 1 ? "video activo" : "videos activos"}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { setReelToEdit(null); setIsModalOpen(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white rounded-2xl shadow-lg shadow-fowy-orange/30 font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={18} />
          <span>Nuevo Reel</span>
        </button>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Videos</span>
          <span className="text-xl font-black text-slate-800">{reels.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Vistas</span>
          <span className="text-xl font-black text-slate-800 flex items-center gap-1.5">
            <Eye size={16} className="text-fowy-orange" /> {totalViews.toLocaleString()}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Clics Menú</span>
          <span className="text-xl font-black text-emerald-600 flex items-center gap-1.5">
            <ShoppingBag size={16} className="text-emerald-500" /> {totalClicks.toLocaleString()}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Conversión</span>
          <span className="text-xl font-black text-purple-600 flex items-center gap-1.5">
            <TrendingUp size={16} className="text-purple-500" /> {conversionRate}%
          </span>
        </div>
      </div>

      {/* 1. Gráfica Reutilizada Filtrada por Negocio */}
      <ReelsTrafficChart businessId={businessId} title={`Rendimiento de Reels: ${business?.name || ""}`} />

      {/* 2. Galería de Reels */}
      <section className="space-y-4">
        <h3 className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Galería de Videos Activos
        </h3>
        <ReelsBusinessGallery
          reels={reels}
          loading={loading}
          onToggleStatus={toggleReelStatus}
          onEdit={(r) => { setReelToEdit(r); setIsModalOpen(true); }}
          onDelete={(r) => { setReelToDelete(r); setIsDeleteModalOpen(true); }}
          onNewReel={() => { setReelToEdit(null); setIsModalOpen(true); }}
        />
      </section>

      {/* Modales */}
      <ReelFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setReelToEdit(null); }}
        initialBusinessId={businessId}
        businessName={business?.name}
        reelToEdit={reelToEdit}
        onSuccess={() => {
          fetchReels();
          setToast({ show: true, message: reelToEdit ? "¡Reel actualizado con éxito!" : "¡Reel publicado con éxito!" });
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setReelToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar este Reel?"
        message={`¿Estás seguro de que deseas eliminar "${reelToDelete?.title}"? Esta acción es permanente y borrará también la miniatura.`}
      />

      <SuccessToast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: "" })} />
    </div>
  );
}
