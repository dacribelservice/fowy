"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Link as LinkIcon, Eye, EyeOff, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { MarketingBanner } from "@/hooks/useMarketingManager";
import DeleteConfirmModal from "@/components/admin/shared/DeleteConfirmModal";

interface BannerGridListProps {
  banners: MarketingBanner[];
  loading: boolean;
  onToggleActive: (id: string, isActive: boolean) => Promise<any>;
  onDelete: (id: string, imageUrl: string) => Promise<any>;
  onReorder: (newBanners: MarketingBanner[]) => Promise<any>;
}

export default function BannerGridList({ 
  banners, 
  loading, 
  onToggleActive, 
  onDelete, 
  onReorder 
}: BannerGridListProps) {
  const [deleteTarget, setDeleteTarget] = useState<MarketingBanner | null>(null);

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    // Intercambiar
    const temp = newBanners[index];
    newBanners[index] = newBanners[index - 1];
    newBanners[index - 1] = temp;
    
    await onReorder(newBanners);
  };

  const handleMoveDown = async (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    // Intercambiar
    const temp = newBanners[index];
    newBanners[index] = newBanners[index + 1];
    newBanners[index + 1] = temp;
    
    await onReorder(newBanners);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await onDelete(deleteTarget.id, deleteTarget.image_url);
      setDeleteTarget(null);
    }
  };

  if (loading && banners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-fowy-primary/10 border-t-fowy-primary rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Cargando banners...</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[32px] p-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-350 mb-6">
          <Sparkles size={28} />
        </div>
        <h3 className="text-lg font-black text-slate-800 mb-1">No hay banners de marketing</h3>
        <p className="text-slate-400 text-sm max-w-sm font-medium">
          Sube tu primer banner publicitario de marketing para que aparezca al pie del menú digital.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`group bg-white rounded-[24px] border border-slate-100 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between ${
                !banner.is_active ? "opacity-75 grayscale-[30%]" : ""
              }`}
            >
              <div>
                {/* Banner Image Preview */}
                <div className="relative aspect-[3/1] w-full overflow-hidden bg-slate-900 border-b border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={banner.image_url}
                    alt={banner.title || "Marketing Banner"}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm flex items-center gap-1.5 ${
                      banner.is_active 
                        ? "bg-emerald-500/90 text-white border-emerald-400" 
                        : "bg-slate-800/95 text-slate-300 border-slate-700"
                    }`}>
                      {banner.is_active ? (
                        <>
                          <Eye size={12} />
                          <span>Activo</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} />
                          <span>Inactivo</span>
                        </>
                      )}
                    </span>
                    
                    <span className="text-[10px] font-black bg-white/95 text-slate-700 px-3 py-1 rounded-full border border-slate-200 shadow-sm uppercase tracking-widest">
                      Posición #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Banner Information */}
                <div className="p-6">
                  <h4 className="font-extrabold text-slate-800 text-lg mb-2 leading-tight">
                    {banner.title || <em className="text-slate-400 font-medium font-serif">Sin título</em>}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 w-full overflow-hidden">
                    <LinkIcon size={14} className="shrink-0 text-slate-450" />
                    <span className="font-mono text-slate-550 truncate">{banner.link_url}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex items-center justify-between gap-4">
                {/* Reordering and Visibility Controls */}
                <div className="flex items-center gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-slate-50 text-slate-600 transition-colors flex items-center justify-center border border-slate-100"
                    title="Subir de posición"
                  >
                    <ArrowUp size={16} />
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleMoveDown(index)}
                    disabled={index === banners.length - 1}
                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-slate-50 text-slate-600 transition-colors flex items-center justify-center border border-slate-100"
                    title="Bajar de posición"
                  >
                    <ArrowDown size={16} />
                  </motion.button>

                  <div className="h-6 w-px bg-slate-200/60 mx-1" />

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onToggleActive(banner.id, !banner.is_active)}
                    className={`px-4 h-10 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 border ${
                      banner.is_active
                        ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600"
                        : "bg-fowy-primary/10 hover:bg-fowy-primary/20 border-fowy-primary/10 text-fowy-primary"
                    }`}
                  >
                    {banner.is_active ? (
                      <>
                        <EyeOff size={14} />
                        <span>Desactivar</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        <span>Activar</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteTarget(banner)}
                  className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors flex items-center justify-center border border-red-100"
                  title="Eliminar Banner"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar este banner publicitario?"
        message="Esta acción es permanente. El banner se desactivará y se borrará tanto de la base de datos como del almacenamiento físico."
      />
    </>
  );
}
