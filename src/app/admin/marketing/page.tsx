"use client";

import React, { useState } from "react";
import MarketingBannerHeader from "@/components/admin/marketing/MarketingBannerHeader";
import BannerUploadModal from "@/components/admin/marketing/BannerUploadModal";
import BannerGridList from "@/components/admin/marketing/BannerGridList";
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
    reorderBanners 
  } = useMarketingManager();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleSave = async (file: File, title: string, linkUrl: string) => {
    const result = await addBanner(file, title, linkUrl);
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

  return (
    <div className="pb-32 px-4 sm:px-8 max-w-full lg:max-w-[1600px] mx-auto">
      <MarketingBannerHeader onAddClick={() => setIsUploadOpen(true)} />
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-semibold">
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

      <BannerUploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSave={handleSave}
      />

      <SuccessToast 
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
