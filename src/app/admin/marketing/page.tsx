"use client";

import React, { useState } from "react";
import MarketingBannerHeader from "@/components/admin/marketing/MarketingBannerHeader";
import BannerUploadModal from "@/components/admin/marketing/BannerUploadModal";
import BannerGridList from "@/components/admin/marketing/BannerGridList";
import MarketingCTAManager from "@/components/admin/marketing/MarketingCTAManager";
import SuccessToast from "@/components/admin/shared/SuccessToast";
import { useMarketingManager } from "@/hooks/useMarketingManager";

export default function MarketingPage() {
  const { 
    banners, 
    loading, 
    error, 
    addBanner, 
    updateBanner, 
    deleteBanner, 
    reorderBanners,

    // Frases dinámicas
    ctas,
    ctasLoading,
    ctasError,
    addCTA,
    updateCTA,
    deleteCTA,
    reorderCTAs
  } = useMarketingManager();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleSave = async (
    file: File, 
    title: string, 
    linkUrl: string,
    targetCity?: string | null,
    targetBusinessId?: string | null,
    destinationBusinessId?: string | null
  ) => {
    const result = await addBanner(file, title, linkUrl, targetCity, targetBusinessId, destinationBusinessId);
    if (result) {
      setToast({ show: true, message: "¡Banner subido con éxito!" });
      return true;
    }
    return false;
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const result = await updateBanner(id, { is_active: isActive });
    if (result) {
      setToast({ 
        show: true, 
        message: isActive ? "¡Banner activado con éxito!" : "¡Banner desactivado con éxito!" 
      });
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    const success = await deleteBanner(id, imageUrl);
    if (success) {
      setToast({ show: true, message: "¡Banner eliminado correctamente!" });
    }
  };

  const handleShowToast = (message: string) => {
    setToast({ show: true, message });
  };

  return (
    <div className="pb-32 px-4 sm:px-8 max-w-full lg:max-w-[1600px] mx-auto">
      {/* Sección 1: Banners de Marketing */}
      <MarketingBannerHeader onAddClick={() => setIsUploadOpen(true)} />
      
      {error && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 text-red-400 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      )}

      <BannerGridList 
        banners={banners}
        loading={loading}
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
        onReorder={reorderBanners}
      />

      {/* Sección 2: Gestión de Frases Rotativas (CTAs) */}
      <MarketingCTAManager 
        ctas={ctas}
        loading={ctasLoading}
        error={ctasError}
        onAdd={addCTA}
        onUpdate={updateCTA}
        onDelete={deleteCTA}
        onReorder={reorderCTAs}
        onToast={handleShowToast}
      />

      {/* Modal para subir banners */}
      <BannerUploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSave={handleSave}
      />

      {/* Alertas Toast de Éxito */}
      <SuccessToast 
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
