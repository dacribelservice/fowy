"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Link as LinkIcon, Sparkles, Loader2, UploadCloud } from "lucide-react";

interface BannerUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File, title: string, linkUrl: string) => Promise<any>;
}

export default function BannerUploadModal({ isOpen, onClose, onSave }: BannerUploadModalProps) {
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("/explorar");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);
    try {
      const success = await onSave(selectedFile, title, linkUrl);
      if (success) {
        // Reset states
        setTitle("");
        setLinkUrl("/explorar");
        setSelectedFile(null);
        setPreviewUrl(null);
        onClose();
      }
    } catch (error) {
      console.error("Error submitting banner:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white/95 backdrop-blur-md rounded-[32px] p-8 shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-fowy-primary/5 rounded-full -mr-24 -mt-24 blur-3xl opacity-75 pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fowy-primary/10 rounded-2xl flex items-center justify-center text-fowy-primary">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-850">Crear Nuevo Banner</h3>
                  <p className="text-slate-400 text-xs font-semibold">Sube una imagen y configura el enlace del banner.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-450 hover:text-slate-700 transition-colors flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* File Drag and Drop */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={handleSelectClick}
                className={`group relative flex flex-col items-center justify-center border-2 border-dashed rounded-[24px] p-6 cursor-pointer transition-all ${
                  dragActive
                    ? "border-fowy-primary bg-fowy-primary/5 scale-[1.01]"
                    : "border-slate-200 bg-slate-50/50 hover:border-fowy-primary/40 hover:bg-white"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                />

                {previewUrl ? (
                  <div className="relative w-full aspect-[3/1] rounded-2xl overflow-hidden shadow-inner border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <UploadCloud size={24} className="text-white" />
                      <span className="text-white text-xs font-black uppercase tracking-wider">Cambiar Imagen</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-6">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-4 group-hover:text-fowy-primary group-hover:scale-110 transition-all border border-slate-100">
                      <ImageIcon size={28} />
                    </div>
                    <p className="text-slate-800 font-bold text-sm mb-1">
                      Arrastra tu banner aquí o <span className="text-fowy-primary">búscalo</span>
                    </p>
                    <p className="text-slate-400 text-[11px] font-semibold">
                      Formatos sugeridos: JPG, PNG • Proporción recomendada: 3:1 (ej. 1200x400px)
                    </p>
                  </div>
                )}
              </div>

              {/* Title (Opcional) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-550 uppercase tracking-widest block">
                  Título de Campaña (Opcional)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Sparkles size={16} />
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Promo Viernes de Hamburguesas"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-primary/20 focus:bg-white transition-all text-slate-800 font-semibold text-sm"
                  />
                </div>
              </div>

              {/* Redirect URL */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-550 uppercase tracking-widest block">
                  Enlace de Redirección (URL)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <LinkIcon size={16} />
                  </div>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Ej. /explorar o https://instagram.com/..."
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-primary/20 focus:bg-white transition-all text-slate-800 font-mono text-sm"
                    required
                  />
                </div>
                <p className="text-[10px] font-semibold text-slate-400">
                  Fallback por defecto: <code className="font-mono text-slate-500 bg-slate-100 px-1 py-0.5 rounded">/explorar</code>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-450 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all border border-slate-200"
                  disabled={isSubmitting}
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: selectedFile ? 1.02 : 1 }}
                  whileTap={{ scale: selectedFile ? 0.98 : 1 }}
                  type="submit"
                  disabled={!selectedFile || isSubmitting}
                  className="flex-1 py-4 bg-fowy-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-fowy-red/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Comprimiendo y Subiendo...</span>
                    </>
                  ) : (
                    <span>Guardar Banner</span>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
