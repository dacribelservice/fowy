"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { storageService } from "@/services/storageService";

interface Banner {
  id: string;
  image_url: string;
  order_index: number;
}

interface BannerUploaderProps {
  businessId: string;
}

export function BannerUploader({ businessId }: BannerUploaderProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("business_banners")
        .select("*")
        .eq("business_id", businessId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Error al cargar los banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) fetchBanners();
  }, [businessId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadToast = toast.loading("Subiendo banners...");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Upload to Storage using storageService (it handles compression)
        const publicUrl = await storageService.uploadFile(file, "banners", {
          path: `${businessId}/banners`,
          maxWidth: 1200, // Banners can be wider
          quality: 0.8
        });

        // 2. Save to Database
        const { data, error } = await supabase
          .from("business_banners")
          .insert({
            business_id: businessId,
            image_url: publicUrl,
            order_index: banners.length + i
          })
          .select()
          .single();

        if (error) throw error;
      }

      toast.success("Banners subidos con éxito", { id: uploadToast });
      fetchBanners();
    } catch (error) {
      console.error("Error uploading banners:", error);
      toast.error("Error al subir los banners", { id: uploadToast });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleDelete = async (banner: Banner) => {
    const deleteToast = toast.loading("Eliminando banner...");
    try {
      // 1. Delete from Storage (Concepto 3.4: Limpieza de Storage)
      await storageService.deleteFileByUrl(banner.image_url, "banners");

      // 2. Delete from Database
      const { error } = await supabase
        .from("business_banners")
        .delete()
        .eq("id", banner.id);

      if (error) throw error;

      toast.success("Banner eliminado", { id: deleteToast });
      setBanners(banners.filter((b) => b.id !== banner.id));
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Error al eliminar el banner", { id: deleteToast });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <ImageIcon size={24} className="text-slate-900" />
          Banners del Menú
        </h3>
        
        <label className="cursor-pointer group">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={handleUpload}
            disabled={uploading}
          />
          <div className="flex items-center gap-2 px-4 py-2 bg-fowy-secondary text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-fowy-blue/20">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Agregar Banners
          </div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative aspect-[16/9] rounded-2xl overflow-hidden group border border-slate-100 shadow-sm"
            >
              <img 
                src={banner.image_url} 
                alt="Banner" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(banner)}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-fowy-energy hover:text-white transition-all shadow-xl border border-white/30"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {banners.length === 0 && !uploading && (
          <div className="col-span-full py-12 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <ImageIcon size={48} className="mb-4 opacity-20" />
            <p className="font-bold text-sm">No hay banners configurados</p>
            <p className="text-xs mt-1">Los banners se mostrarán en la parte superior de tu menú digital.</p>
          </div>
        )}

        {uploading && (
          <div className="aspect-[16/9] rounded-2xl border-2 border-dashed border-fowy-secondary/30 flex items-center justify-center bg-fowy-secondary/5">
            <Loader2 className="animate-spin text-fowy-secondary" size={32} />
          </div>
        )}
      </div>
      
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
          <ImageIcon size={18} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-black text-amber-800 uppercase tracking-wider">Recomendación</p>
          <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
            Usa imágenes horizontales (relación 16:9) de alta calidad. 
            El sistema optimizará automáticamente el tamaño para que tu menú cargue rápido.
          </p>
        </div>
      </div>
    </div>
  );
}
