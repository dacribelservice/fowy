"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { storageService } from "@/services/storageService";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supabase: any;
  setToast: (config: { show: boolean, message: string }) => void;
}

export default function AddCategoryModal({ isOpen, onClose, onSuccess, supabase, setToast }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAdd = async () => {
    if (!name || !image) return;
    setUploading(true);

    try {
      // 1. Upload using centralized service
      const publicUrl = await storageService.uploadFile(image, 'categories', {
        maxWidth: 400,
        quality: 0.7
      });

      // 4. Insert into DB
      const { error: dbError } = await supabase
        .from('categories')
        .insert([{ name, image_url: publicUrl }]);

      if (dbError) throw dbError;

      // 4. Reset and Close
      setName("");
      setImage(null);
      setPreview(null);
      setToast({ show: true, message: "✅ Categoría creada con éxito" });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error adding category:", error);
      setToast({ show: true, message: `❌ Error: ${error.message || "Error desconocido"}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white w-full sm:max-w-md sm:rounded-[30px] rounded-t-[30px] overflow-hidden shadow-2xl z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Nueva Categoría</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Image Upload Area */}
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-all ${
                    preview ? 'border-fowy-orange' : 'border-slate-200 hover:border-fowy-orange bg-slate-50'
                  }`}
                >
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <Upload size={28} className="text-slate-300" />
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sube el icono de la categoría</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Pizza, Perros, Sushi..."
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-fowy-orange/20 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleAdd}
                disabled={!name || !image || uploading}
                className="w-full py-5 rounded-2xl bg-fowy-primary text-white font-black uppercase tracking-[0.2em] shadow-lg shadow-fowy-red/20 hover:shadow-fowy-red/30 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Creando...
                  </>
                ) : (
                  <>Crear Categoría</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
