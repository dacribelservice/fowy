"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Store, Link as LinkIcon, MapPin, Phone, CreditCard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { storageService } from "@/services/storageService";

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supabase: any;
  setToast: (config: { show: boolean, message: string }) => void;
}

export default function AddBusinessModal({ isOpen, onClose, onSuccess, supabase, setToast }: AddBusinessModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [plan, setPlan] = useState("standard");
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from name
  useEffect(() => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/[\s_-]+/g, '-')  // Replace spaces and underscores with -
      .replace(/^-+|-+$/g, '');  // Remove leading/trailing -
    setSlug(generatedSlug);
  }, [name]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!name || !slug || !logo) return;
    setLoading(true);

    try {
      // 1. Upload Logo using centralized service
      const publicUrl = await storageService.uploadFile(logo, 'logos', {
        maxWidth: 800,
        quality: 0.7
      });

      // 2. Insert Business
      const { error: dbError } = await supabase
        .from('businesses')
        .insert([{
          name,
          slug,
          logo_url: publicUrl,
          city,
          country,
          plan,
          phone: whatsapp,
          status: true,
          payment_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Next month default
          modules: {
            standard: true,
            pro: plan === "pro" || plan === "premium",
            premium: plan === "premium"
          }
        }]);

      if (dbError) throw dbError;

      setToast({ show: true, message: "✅ Negocio creado correctamente" });
      onSuccess();
      onClose();
      // Reset
      setName("");
      setCity("");
      setCountry("");
      setWhatsapp("");
      setLogo(null);
      setPreview(null);
    } catch (error: any) {
      console.error("Error creating business:", error);
      setToast({ show: true, message: `❌ Error: ${error.message || "Error desconocido"}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative bg-white w-full sm:max-w-2xl sm:rounded-[40px] rounded-t-[40px] overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-20">
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-lg">Nuevo Establecimiento</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configuración Inicial de Negocio</p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 space-y-10">
              {/* Logo Selection */}
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-32 h-32 rounded-[40px] border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-all group relative ${
                    preview ? 'border-fowy-orange' : 'border-slate-200 hover:border-fowy-orange bg-slate-50'
                  }`}
                >
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-fowy-orange transition-colors">
                      <Upload size={32} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Logo</span>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
                </div>
              </div>

              {/* Grid Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <Store size={12} className="text-fowy-orange" /> Nombre del Negocio
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej. Burger King"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-fowy-orange/20 outline-none transition-all font-bold text-slate-700"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2 opacity-80">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <LinkIcon size={12} className="text-slate-400" /> URL (Slug Automático)
                  </label>
                  <input 
                    type="text" 
                    readOnly
                    className="w-full px-6 py-4 rounded-2xl bg-slate-100 border border-slate-100 outline-none font-mono text-xs text-slate-500 font-bold"
                    value={slug}
                  />
                </div>

                {/* Ciudad */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <MapPin size={12} className="text-fowy-orange" /> Ciudad
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej. Cali"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-fowy-orange/20 outline-none transition-all font-bold text-slate-700"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                {/* País */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <MapPin size={12} className="text-fowy-orange" /> País
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej. Colombia"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-fowy-orange/20 outline-none transition-all font-bold text-slate-700"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <Phone size={12} className="text-green-500" /> WhatsApp (Sin +)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej. 573001234567"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-fowy-orange/20 outline-none transition-all font-bold text-slate-700"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>

                {/* Plan */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <CreditCard size={12} className="text-blue-500" /> Plan Inicial
                  </label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-fowy-orange/20 outline-none transition-all font-bold text-slate-700 appearance-none"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                  >
                    <option value="standard">Standard</option>
                    <option value="pro">Pro</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleSave}
                disabled={!name || !logo || loading}
                className="w-full py-6 rounded-3xl bg-fowy-primary text-white font-black uppercase tracking-[0.3em] shadow-xl shadow-fowy-red/30 hover:shadow-fowy-red/40 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Inicializando...</span>
                  </>
                ) : (
                  "Crear Negocio"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
