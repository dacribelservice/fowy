"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Palette, 
  Upload, 
  Save, 
  Loader2,
  Image as ImageIcon,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ColorPickerFowy } from "@/components/partners/branding/ColorPicker";
import { BannerUploader } from "@/components/partners/branding/BannerUploader";
import { storageService } from "@/services/storageService";
import Link from "next/link";

export default function BrandingPage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchBusinessData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: bizData, error: bizError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (bizData) setBusiness(bizData);
    } catch (error) {
      console.error("Error fetching business:", error);
      toast.error("Error al cargar configuración");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('businesses')
      .update({
        color_identity: business.color_identity,
        logo_url: business.logo_url
      })
      .eq('id', business.id);

    if (!error) {
      toast.success("Branding actualizado");
      document.documentElement.style.setProperty('--business-color', business.color_identity);
    } else {
      toast.error("Error al guardar");
    }
    setSaving(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadToast = toast.loading("Subiendo logo...");
    try {
      // Cleanup old logo if exists (Concepto 3.4)
      if (business.logo_url) {
        await storageService.deleteFileByUrl(business.logo_url, 'logos');
      }

      const publicUrl = await storageService.uploadFile(file, 'logos', {
        path: `${business.id}/logo`,
        maxWidth: 400,
        quality: 0.9
      });

      setBusiness({ ...business, logo_url: publicUrl });
      toast.success("Logo actualizado", { id: uploadToast });
    } catch (error) {
      toast.error("Error al subir logo", { id: uploadToast });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 size={40} className="text-slate-900 animate-spin" />
      <p className="text-slate-500 font-bold">Cargando branding...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Link href="/business/perfil" className="hover:text-fowy-secondary transition-colors font-bold text-xs uppercase tracking-widest">Perfil</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-bold text-xs uppercase tracking-widest">Branding</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            Identidad Visual
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Personaliza cómo ven los clientes tu negocio y menú.
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-4 bg-fowy-energy text-white rounded-2xl font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 shadow-lg shadow-fowy-red/20"
        >
          {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
          Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Colors Section */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 space-y-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Palette size={24} className="text-slate-900" />
              Color de Identidad
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Este color se usará en botones, acentos y elementos clave de tu menú digital para mantener la consistencia de tu marca.
            </p>
            <ColorPickerFowy 
              color={business?.color_identity || "#FF5A5F"} 
              onChange={(color) => setBusiness({...business, color_identity: color})}
            />
          </section>

          {/* Banners Section */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <BannerUploader businessId={business.id} />
          </section>
        </div>

        {/* Logo Section */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 w-full text-left">Logo Oficial</p>
            <div className="w-48 h-48 rounded-[3rem] bg-slate-50 flex items-center justify-center relative group overflow-hidden mb-8 border-4 border-white ring-1 ring-slate-100 shadow-xl">
              {business?.logo_url ? (
                <img src={business.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <ImageIcon size={80} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Subir Imagen</span>
                </div>
              )}
              <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <Upload size={40} className="text-white" />
              </label>
            </div>
            <p className="text-xs text-slate-400 font-bold max-w-[200px] mb-6">Se recomienda un logo cuadrado o circular con fondo transparente.</p>
            <button className="px-8 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl text-xs font-black hover:border-fowy-secondary hover:text-fowy-secondary transition-all">
              Cambiar Logotipo
            </button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-fowy-flow text-white relative overflow-hidden group shadow-lg shadow-fowy-purple/20">
            <div className="absolute -top-10 -right-10 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Palette size={140} />
            </div>
            <h4 className="text-lg font-black mb-2 relative z-10">Vista Previa</h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed relative z-10 opacity-90">
              Así es como se ve tu marca. El color seleccionado se aplicará dinámicamente a tu tienda.
            </p>
            <div className="mt-6 flex gap-2 relative z-10">
              <div className="px-4 py-2 rounded-lg text-[10px] font-black uppercase" style={{ backgroundColor: business?.color_identity }}>Botón Primario</div>
              <div className="px-4 py-2 rounded-lg border-2 text-[10px] font-black uppercase" style={{ borderColor: business?.color_identity, color: business?.color_identity }}>Borde</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
