"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Clapperboard } from "lucide-react";
import { useAdminReelsSummary } from "@/hooks/useAdminReelsSummary";
import { ReelsGlobalKPIs } from "@/components/admin/reels/ReelsGlobalKPIs";
import { ReelsTrafficChart } from "@/components/admin/reels/ReelsTrafficChart";
import { ReelsBusinessesTable } from "@/components/admin/reels/ReelsBusinessesTable";
import { ReelFormModal } from "@/components/admin/reels/ReelFormModal";
import SuccessToast from "@/components/admin/shared/SuccessToast";

export default function AdminReelsPage() {
  const { summaries, globalStats, loading, refreshSummary } = useAdminReelsSummary();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  return (
    <div className="pb-32 px-4 sm:px-8 max-w-full lg:max-w-[1600px] mx-auto space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 sm:mt-0"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight mb-2 flex items-center gap-3">
            <span>Fowy Reels</span>
            <span className="inline-flex p-2 rounded-2xl bg-orange-500/10 text-fowy-orange text-lg">🎬</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-2xl">
            Central de videos cortos de alto impacto. Monitorea vistas, clics al menú y administra los reels de cada restaurante.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white rounded-2xl shadow-lg shadow-fowy-orange/30 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 font-black text-xs uppercase tracking-widest"
        >
          <Plus size={18} />
          <span>Publicar Nuevo Reel</span>
        </button>
      </motion.div>

      {/* 1. KPIs Globales */}
      <section>
        <ReelsGlobalKPIs stats={globalStats} />
      </section>

      {/* 2. Gráfica de Rendimiento Global */}
      <section>
        <ReelsTrafficChart title="Rendimiento Global de Reproducciones y Clics" />
      </section>

      {/* 3. Tabla de Negocios y Videos */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Restaurantes & Catálogo de Reels
          </h3>
          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">
            {summaries.length} Negocios
          </span>
        </div>

        <ReelsBusinessesTable summaries={summaries} loading={loading} />
      </section>

      {/* Modales */}
      <ReelFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refreshSummary();
          setToast({ show: true, message: "¡Reel publicado exitosamente!" });
        }}
      />

      <SuccessToast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}
