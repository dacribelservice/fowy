"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Clapperboard, AlertCircle } from "lucide-react";
import { BusinessReel } from "@/types/reels";
import { useReelFormLogic } from "./useReelFormLogic";
import { ReelThumbnailUploader } from "./ReelThumbnailUploader";
import { ReelFormFields } from "./ReelFormFields";

export interface ReelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedReel: BusinessReel) => void;
  initialBusinessId?: string;
  businessName?: string;
  reelToEdit?: BusinessReel | null;
}

export function ReelFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialBusinessId,
  businessName,
  reelToEdit,
}: ReelFormModalProps) {
  const {
    title,
    setTitle,
    instagramUrl,
    setInstagramUrl,
    thumbnailPreview,
    handleFileSelect,
    handleClearThumbnail,
    businessInputValue,
    handleBusinessSelect,
    businessOptions,
    isSubmitting,
    error,
    handleSubmit,
  } = useReelFormLogic({
    initialBusinessId,
    initialReel: reelToEdit,
    onSuccess,
    onClose,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF5A5F] to-[#FF9A3D] text-white flex items-center justify-center shadow-md shadow-fowy-orange/20">
                  <Clapperboard size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-tight">
                    {reelToEdit ? "Editar Fowy Reel" : "Publicar Nuevo Reel"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {reelToEdit ? "Modifica los datos del video existente" : "Sube una portada 9:16 y enlaza el video de Instagram"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto py-5 space-y-5 flex-1 pr-1">
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2.5">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <ReelThumbnailUploader
                  previewUrl={thumbnailPreview}
                  onFileSelect={handleFileSelect}
                  onClear={handleClearThumbnail}
                  disabled={isSubmitting}
                />

                <ReelFormFields
                  title={title}
                  onTitleChange={setTitle}
                  instagramUrl={instagramUrl}
                  onInstagramUrlChange={setInstagramUrl}
                  businessInputValue={businessInputValue}
                  onBusinessInputChange={handleBusinessSelect}
                  businessOptions={businessOptions}
                  isBusinessPreselected={Boolean(initialBusinessId || reelToEdit?.businessId)}
                  businessName={businessName}
                  disabled={isSubmitting}
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF5A5F] to-[#FF9A3D] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-fowy-orange/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>{reelToEdit ? "Guardar Cambios" : "Publicar Reel"}</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
