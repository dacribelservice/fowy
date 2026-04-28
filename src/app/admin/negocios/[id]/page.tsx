"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Save, Globe, Phone, MapPin, 
  CreditCard, ShieldCheck, Zap, Star,
  CheckCircle2, AlertCircle
} from "lucide-react";
import SuccessToast from "@/components/admin/shared/SuccessToast";
import dynamic from "next/dynamic";

const DynamicLocationPicker = dynamic(
  () => import("@/components/admin/shared/LocationPicker"),
  { ssr: false, loading: () => <div className="h-[300px] w-full rounded-[24px] bg-slate-50 animate-pulse flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-widest border-2 border-slate-100">Cargando Mapa...</div> }
);

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  plan: string;
  status: boolean;
  phone: string;
  payment_date: string;
  modules: {
    standard: boolean;
    pro: boolean;
    premium: boolean;
    inventory?: boolean;
    reports?: boolean;
    marketing?: boolean;
  };
}

export default function BusinessDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("modules");
  const [toast, setToast] = useState({ show: false, message: "" });

  const fetchBusiness = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setBusiness(data);
    } catch (error) {
      console.error("Error fetching business:", error);
    } finally {
      setLoading(false);
    }
  }, [id, supabase]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  const handleToggleModule = (moduleKey: string) => {
    if (!business) return;
    setBusiness({
      ...business,
      modules: {
        ...business.modules,
        [moduleKey]: !((business.modules as any)[moduleKey])
      }
    });
  };

  const handleUpdate = async () => {
    if (!business) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          status: business.status,
          plan: business.plan,
          modules: business.modules,
          city: business.city,
          country: business.country,
          latitude: business.latitude,
          longitude: business.longitude,
          phone: business.phone
        })
        .eq('id', id);

      if (error) throw error;
      setToast({ show: true, message: "Configuración actualizada con éxito" });
    } catch (error) {
      console.error("Error updating business:", error);
      alert("Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-fowy-primary/10 border-t-fowy-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Sincronizando Establecimiento...</p>
    </div>
  );

  if (!business) return <div>No se encontró el negocio.</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Navegación */}
      <div className="flex items-center justify-between mb-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-fowy-orange transition-colors font-bold text-xs uppercase tracking-widest group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft size={18} />
          </div>
          Volver al Listado
        </button>

        <button 
          onClick={handleUpdate}
          disabled={saving}
          className="px-8 py-4 bg-fowy-primary text-white rounded-2xl shadow-xl shadow-fowy-red/20 hover:shadow-fowy-red/30 transition-all active:scale-95 flex items-center gap-3 font-black uppercase tracking-widest text-[10px]"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Columna Izquierda: Perfil Card */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-fowy-orange/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <div className="relative flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-[40px] p-1 bg-gradient-to-tr from-fowy-red to-fowy-orange mb-6 shadow-2xl">
                <div className="w-full h-full rounded-[38px] overflow-hidden border-4 border-white bg-white">
                  <img src={business.logo_url} className="w-full h-full object-cover" alt={business.name} />
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">{business.name}</h2>
              <p className="text-[10px] font-mono text-slate-400 font-bold uppercase mb-6 tracking-tighter opacity-60">ID: {business.id.slice(0,8)}</p>
              
              <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border ${
                business.status ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {business.status ? "● Negocio Activo" : "○ Inactivo"}
              </div>

              <div className="w-full space-y-4 text-left border-t border-slate-50 pt-8">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="p-2 bg-slate-50 rounded-lg"><MapPin size={14} /></div>
                  <span className="text-xs font-bold">{business.city}, {business.country}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="p-2 bg-slate-50 rounded-lg"><Phone size={14} /></div>
                  <span className="text-xs font-bold">+{business.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="p-2 bg-slate-50 rounded-lg"><Globe size={14} /></div>
                  <span className="text-xs font-bold lowercase">/{business.slug}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Info: Plan actual */}
          <div className="bg-slate-900 rounded-[30px] p-8 text-white relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Zap size={100} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Plan Contratado</p>
            <div className="flex items-center gap-3">
              <Star className="text-fowy-orange" fill="currentColor" />
              <h4 className="text-2xl font-black italic tracking-tighter uppercase">{business.plan}</h4>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Próximo Pago</p>
              <span className="text-xs font-black">{business.payment_date}</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Configuración & Módulos */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-50 bg-slate-50/50">
              {['modules', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                    activeTab === tab ? 'text-fowy-orange' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab === 'modules' ? 'Módulos Activos' : 'Configuración General'}
                  {activeTab === tab && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-fowy-orange" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-10">
              {activeTab === 'modules' ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-4">
                    <ShieldCheck className="text-fowy-orange" />
                    <div>
                      <h4 className="text-lg font-black text-slate-800 tracking-tight">Gestión de Módulos</h4>
                      <p className="text-xs text-slate-400 font-medium">Activa servicios individuales para este cliente.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Modulo Standard */}
                    <ModuleSwitch 
                      title="Paquete Standard"
                      description="Menú digital, QR dinámico y perfil básico."
                      icon={<Zap size={20} />}
                      active={business.modules.standard}
                      onToggle={() => handleToggleModule('standard')}
                    />

                    {/* Modulo Pro */}
                    <ModuleSwitch 
                      title="Funciones Pro"
                      description="Gestión de pedidos en tiempo real y estadísticas."
                      icon={<Star size={20} />}
                      active={business.modules.pro}
                      onToggle={() => handleToggleModule('pro')}
                    />

                    {/* Modulo Premium */}
                    <ModuleSwitch 
                      title="Fowy Premium"
                      description="Personalización avanzada y multi-sucursal."
                      icon={<Zap size={20} className="text-yellow-500" />}
                      active={business.modules.premium}
                      onToggle={() => handleToggleModule('premium')}
                    />

                    {/* Inventario */}
                    <ModuleSwitch 
                      title="Módulo Inventario"
                      description="Control de stock y alertas automáticas."
                      icon={<Zap size={20} />}
                      active={business.modules.inventory || false}
                      onToggle={() => handleToggleModule('inventory')}
                    />
                  </div>

                  <div className="mt-10 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                    <AlertCircle className="text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      <strong>Nota:</strong> Los cambios realizados en los módulos afectarán inmediatamente la interfaz de usuario del cliente en la aplicación explorer.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estatus del Negocio</label>
                        <select 
                          value={business.status ? "true" : "false"}
                          onChange={(e) => setBusiness({...business, status: e.target.value === "true"})}
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none"
                        >
                          <option value="true">Activo / Operativo</option>
                          <option value="false">Inactivo / Pausado</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cambiar Plan</label>
                        <select 
                          value={business.plan}
                          onChange={(e) => setBusiness({...business, plan: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none"
                        >
                          <option value="standard">Standard</option>
                          <option value="pro">Pro</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <DynamicLocationPicker
                          initialCity={business.city}
                          initialCountry={business.country}
                          initialLat={business.latitude || undefined}
                          initialLng={business.longitude || undefined}
                          onLocationChange={(data) => {
                            setBusiness({
                              ...business,
                              city: data.city,
                              country: data.country,
                              latitude: data.lat,
                              longitude: data.lng
                            });
                          }}
                        />
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <SuccessToast 
        show={toast.show} 
        message={toast.message} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}

function ModuleSwitch({ title, description, icon, active, onToggle }: any) {
  return (
    <div 
      onClick={onToggle}
      className={`p-6 rounded-3xl border-2 transition-all cursor-pointer select-none group ${
        active 
          ? 'bg-fowy-orange/5 border-fowy-orange/20 shadow-lg shadow-fowy-orange/5' 
          : 'bg-white border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl mb-4 transition-all ${
          active ? 'bg-fowy-primary text-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:scale-105'
        }`}>
          {icon}
        </div>
        
        {/* Toggle UI */}
        <div className={`w-12 h-6 rounded-full relative transition-colors ${
          active ? 'bg-fowy-orange' : 'bg-slate-200'
        }`}>
          <motion.div 
            animate={{ x: active ? 24 : 4 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
          />
        </div>
      </div>
      
      <h5 className={`font-black text-sm uppercase tracking-tight mb-1 ${active ? 'text-slate-800' : 'text-slate-500'}`}>
        {title}
      </h5>
      <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
