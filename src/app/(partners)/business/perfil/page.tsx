"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Palette, 
  Upload, 
  Save, 
  Store, 
  Smartphone,
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function BusinessProfilePage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchBusinessData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch Business
      const { data: bizData, error: bizError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (bizError && bizError.code !== 'PGRST116') {
        console.error("Error fetching business:", bizError);
        toast.error("Error al obtener los datos del negocio");
      }

      if (bizData) {
        setBusiness(bizData);
      }
    } catch (error) {
      console.error("Critical error in fetchBusinessData:", error);
      toast.error("Error al cargar los datos del perfil");
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
        name: business.name,
        color_identity: business.color_identity,
        phone: business.phone,
        city: business.city,
        schedules: business.schedules
      })
      .eq('id', business.id);

    if (!error) {
      toast.success("Perfil actualizado con éxito");
      document.documentElement.style.setProperty('--business-color', business.color_identity);
    } else {
      toast.error("Error al actualizar el perfil");
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 size={40} className="text-slate-900 animate-spin" />
      <p className="text-slate-500 font-bold">Cargando configuración...</p>
    </div>
  );

  if (!business) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
        <AlertCircle size={40} />
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-800">No se encontró el negocio</h3>
        <p className="text-slate-500 mt-2 max-w-md">
          Parece que no tienes un negocio vinculado a tu cuenta. Contacta con el administrador para activarlo.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            Identidad del Negocio
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Gestiona tu marca, logotipo y horarios de atención.
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

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 space-y-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Store size={24} className="text-slate-900" />
              Información de Marca
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nombre Comercial</label>
                <input 
                  type="text" 
                  value={business?.name || ""}
                  onChange={(e) => setBusiness({...business, name: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fowy-secondary/10 font-bold transition-all"
                  placeholder="Ej. Burger Master"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">WhatsApp de Pedidos</label>
                <div className="relative">
                  <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    value={business?.phone || ""}
                    onChange={(e) => setBusiness({...business, phone: e.target.value})}
                    className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fowy-secondary/10 font-bold transition-all"
                    placeholder="+57 300..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Color de Marca (Menú Digital)</label>
              <div className="flex flex-wrap gap-4 items-center">
                {['#FF5A5F', '#7B61FF', '#4D8BFF', '#FF9A3D', '#10B981', '#000000'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setBusiness({...business, color_identity: color})}
                    className={`w-14 h-14 rounded-2xl border-4 transition-all ${
                      business?.color_identity === color ? 'border-white ring-4 ring-fowy-secondary/20 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-fowy-secondary transition-colors group">
                  <input 
                    type="color" 
                    value={business?.color_identity || "#FF5A5F"}
                    onChange={(e) => setBusiness({...business, color_identity: e.target.value})}
                    className="absolute inset-0 w-[200%] h-[200%] cursor-pointer -translate-x-1/4 -translate-y-1/4"
                  />
                  <Palette size={20} className="text-slate-400 group-hover:text-fowy-secondary" />
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium italic">El color seleccionado se aplicará a botones y categorías en tu menú QR.</p>
            </div>
          </div>

          {/* Schedules */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <Clock size={24} className="text-slate-900" />
              Horarios de Atención
            </h3>
            <div className="grid gap-3">
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
                <div key={dia} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 transition-all group">
                  <span className="text-sm font-black text-slate-700 w-24 group-hover:text-fowy-secondary transition-colors">{dia}</span>
                  <div className="flex items-center gap-4">
                    <input 
                      type="time" 
                      value={business?.schedules?.[dia]?.open || "09:00"}
                      onChange={(e) => {
                        const newSchedules = { ...business.schedules };
                        if (!newSchedules[dia]) newSchedules[dia] = {};
                        newSchedules[dia].open = e.target.value;
                        setBusiness({...business, schedules: newSchedules});
                      }}
                      className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black focus:ring-2 focus:ring-fowy-secondary/20"
                    />
                    <span className="text-slate-300 font-black">—</span>
                    <input 
                      type="time" 
                      value={business?.schedules?.[dia]?.close || "22:00"}
                      onChange={(e) => {
                        const newSchedules = { ...business.schedules };
                        if (!newSchedules[dia]) newSchedules[dia] = {};
                        newSchedules[dia].close = e.target.value;
                        setBusiness({...business, schedules: newSchedules});
                      }}
                      className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black focus:ring-2 focus:ring-fowy-secondary/20"
                    />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={business?.schedules?.[dia]?.active ?? true}
                      onChange={(e) => {
                        const newSchedules = { ...business.schedules };
                        if (!newSchedules[dia]) newSchedules[dia] = {};
                        newSchedules[dia].active = e.target.checked;
                        setBusiness({...business, schedules: newSchedules});
                      }}
                      className="sr-only peer" 
                    />
                    <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-fowy-secondary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar branding */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 w-full text-left">Logo de Marca</p>
            <div className="w-48 h-48 rounded-[3rem] bg-slate-50 flex items-center justify-center relative group overflow-hidden mb-8 border-4 border-white ring-1 ring-slate-100">
              {business?.logo_url ? (
                <img src={business.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Store size={80} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Subir Imagen</span>
                </div>
              )}
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Upload size={40} className="text-white" />
              </div>
            </div>
            <button className="px-8 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl text-xs font-black hover:border-fowy-secondary hover:text-fowy-secondary transition-all">
              Cambiar Logotipo
            </button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-fowy-flow text-white relative overflow-hidden group shadow-lg shadow-fowy-purple/20">
            <div className="absolute -top-10 -right-10 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Palette size={140} />
            </div>
            <h4 className="text-lg font-black mb-2 relative z-10 text-white">Potencia tu Branding</h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed relative z-10 opacity-90">
              Un logo claro y un color consistente aumentan la retención de clientes. ¡Mantén tu imagen profesional!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
