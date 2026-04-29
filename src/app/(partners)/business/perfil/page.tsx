"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Palette, 
  Upload, 
  Save, 
  Store, 
  Globe, 
  Phone,
  CheckCircle2,
  Clock,
  CreditCard,
  Puzzle,
  Smartphone,
  ChevronRight,
  FileText,
  AlertCircle,
  Calendar,
  Layers,
  Truck,
  MessageCircle,
  Zap,
  ShoppingBag,
  XCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function BusinessProfilePage() {
  const [activeTab, setActiveTab] = useState<'branding' | 'plan' | 'modules'>('branding');
  const [business, setBusiness] = useState<any>(null);
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const fetchBusinessData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch Business
    const { data: bizData } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    if (bizData) {
      setBusiness(bizData);
      
      // Fetch Payment Proofs
      const { data: proofData } = await supabase
        .from('payment_proofs')
        .select('*')
        .eq('business_id', bizData.id)
        .order('created_at', { ascending: false });
      
      if (proofData) setProofs(proofData);
    }
    setLoading(false);
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

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${business.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('payment_proofs')
        .insert({
          business_id: business.id,
          amount: 29.99,
          proof_url: publicUrl,
          status: 'pending'
        });

      if (insertError) throw insertError;

      toast.success("Comprobante enviado correctamente");
      fetchBusinessData();
    } catch (error) {
      toast.error("Error al subir el comprobante");
    } finally {
      setUploading(false);
    }
  };

  const menuModules = [
    { id: "delivery", name: "Módulo Delivery", description: "Gestión de pedidos por WhatsApp.", icon: Truck, active: true },
    { id: "menu_digital", name: "Menú Digital QR", description: "Catálogo interactivo personalizado.", icon: Zap, active: true },
    { id: "reservas", name: "Reservas", description: "Agendamiento de mesas online.", icon: Calendar, active: false },
    { id: "marketing", name: "Marketing", description: "Campañas y cupones de descuento.", icon: ShoppingBag, active: false },
    { id: "fowy_ai", name: "FOWY AI", description: "Asistente inteligente 24/7.", icon: MessageCircle, active: false },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 size={40} className="text-fowy-secondary animate-spin" />
      <p className="text-slate-500 font-bold animate-pulse">Cargando configuración...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            Configuración del Socio ⚙️
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Gestiona tu marca, pagos y herramientas en un solo lugar.
          </p>
        </div>
        
        {activeTab === 'branding' && (
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-10 py-4 bg-fowy-secondary text-white rounded-2xl font-black shadow-premium hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
            Guardar Cambios
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex p-2 bg-slate-100 rounded-[2rem] w-full md:w-fit gap-2">
        <button 
          onClick={() => setActiveTab('branding')}
          className={`flex-1 md:flex-none px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'branding' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Palette size={20} />
          🎨 Perfil & Branding
        </button>
        <button 
          onClick={() => setActiveTab('plan')}
          className={`flex-1 md:flex-none px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'plan' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <CreditCard size={20} />
          💳 Mi Plan (Pagos)
        </button>
        <button 
          onClick={() => setActiveTab('modules')}
          className={`flex-1 md:flex-none px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'modules' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Puzzle size={20} />
          🧩 Mis Módulos
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'branding' && (
            <motion.div 
              key="branding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              {/* Basic Info */}
              <div className="lg:col-span-2 space-y-8">
                <div className="glass-morphism p-10 rounded-[2.5rem] shadow-glass space-y-8">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <Store size={24} className="text-fowy-secondary" />
                    Información de Identidad
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
                          className={`w-14 h-14 rounded-2xl border-4 transition-all shadow-sm ${
                            business?.color_identity === color ? 'border-white ring-4 ring-fowy-secondary/20 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
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
                <div className="glass-morphism p-10 rounded-[2.5rem] shadow-glass">
                  <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <Clock size={24} className="text-fowy-secondary" />
                    Horarios de Atención
                  </h3>
                  <div className="grid gap-3">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
                      <div key={dia} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-sm transition-all group">
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
                <div className="glass-morphism p-10 rounded-[2.5rem] shadow-glass flex flex-col items-center text-center">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 w-full text-left">Logo de Marca</p>
                  <div className="w-48 h-48 rounded-[3rem] bg-slate-50 flex items-center justify-center relative group overflow-hidden mb-8 shadow-inner border-4 border-white ring-1 ring-slate-100">
                    {business?.logo_url ? (
                      <img src={business.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Store size={80} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Subir Imagen</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                      <Upload size={40} className="text-white" />
                    </div>
                  </div>
                  <button className="px-8 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl text-xs font-black hover:border-fowy-secondary hover:text-fowy-secondary transition-all shadow-sm">
                    Cambiar Logotipo
                  </button>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-fowy-blue to-fowy-blue/80 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 p-10 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                    <Zap size={140} />
                  </div>
                  <h4 className="text-lg font-black mb-2 relative z-10">Potencia tu Branding</h4>
                  <p className="text-xs text-blue-50 font-medium leading-relaxed relative z-10 opacity-90">
                    Un logo claro y un color consistente aumentan la retención de clientes en un 45%. ¡Mantén tu imagen profesional!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'plan' && (
            <motion.div 
              key="plan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              <div className="lg:col-span-1 space-y-6">
                <div className="glass-morphism p-10 rounded-[3rem] shadow-glass border-t-[12px] border-t-fowy-secondary flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <CreditCard size={120} />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-14 h-14 bg-fowy-secondary/10 text-fowy-secondary rounded-2xl flex items-center justify-center shadow-inner">
                      <Zap size={32} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Membresía Activa</p>
                      <h3 className="text-2xl font-black text-slate-800">FOWY PRO 🚀</h3>
                    </div>
                  </div>

                  <div className="space-y-6 mb-10 relative z-10">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <span className="text-sm font-bold text-slate-500">Estado</span>
                      <span className="px-4 py-1 bg-green-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg shadow-green-500/20">Activo</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <span className="text-sm font-bold text-slate-500">Precio</span>
                      <span className="text-xl font-black text-slate-800">$29.99/mes</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <span className="text-sm font-bold text-slate-500">Vence en</span>
                      <span className="font-black text-slate-800 text-sm">15 días</span>
                    </div>
                  </div>

                  <input 
                    type="file" 
                    id="proof-upload-profile" 
                    className="hidden" 
                    onChange={handleUploadProof}
                    disabled={uploading}
                  />
                  <button 
                    onClick={() => document.getElementById('proof-upload-profile')?.click()}
                    disabled={uploading}
                    className="w-full py-5 bg-fowy-secondary text-white rounded-[2rem] font-black shadow-premium hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10 disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                    Subir Comprobante
                  </button>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-orange-50 border border-orange-100 flex gap-4">
                  <AlertCircle size={32} className="text-orange-400 shrink-0" />
                  <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
                    Recuerda subir tu comprobante de pago antes de la fecha de vencimiento para evitar la suspensión de tus módulos.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="glass-morphism p-10 rounded-[3rem] shadow-glass">
                  <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3">
                    <Clock size={24} className="text-fowy-secondary" />
                    Historial de Pagos & Facturas
                  </h3>

                  <div className="space-y-4">
                    {proofs.length === 0 ? (
                      <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                        <FileText size={64} className="mx-auto mb-4 text-slate-200" />
                        <p className="text-slate-400 font-bold">No hay registros de pago disponibles.</p>
                      </div>
                    ) : (
                      proofs.map((proof) => (
                        <div key={proof.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 hover:shadow-premium hover:-translate-y-1 transition-all">
                          <div className="flex items-center gap-5 mb-4 md:mb-0">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                              proof.status === 'approved' ? 'bg-green-50 text-green-500' :
                              proof.status === 'pending' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'
                            }`}>
                              {proof.status === 'approved' ? <CheckCircle2 size={28} /> :
                               proof.status === 'pending' ? <Clock size={28} /> : <XCircle size={28} />}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-lg">Membresía Mensual</p>
                              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                                <Calendar size={14} />
                                {new Date(proof.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end gap-10">
                            <div className="text-right">
                              <p className="text-2xl font-black text-slate-800">${proof.amount}</p>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${
                                proof.status === 'approved' ? 'text-green-500' :
                                proof.status === 'pending' ? 'text-orange-500' : 'text-red-500'
                              }`}>
                                {proof.status === 'approved' ? 'Aprobado ✅' :
                                 proof.status === 'pending' ? 'Pendiente ⏳' : 'Rechazado ❌'}
                              </p>
                            </div>
                            <a 
                              href={proof.proof_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-fowy-secondary hover:text-white transition-all shadow-sm"
                            >
                              <FileText size={20} />
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'modules' && (
            <motion.div 
              key="modules"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuModules.map((mod, idx) => {
                  const Icon = mod.icon;
                  return (
                    <div 
                      key={mod.id} 
                      className={`glass-morphism p-10 rounded-[3rem] shadow-glass border-b-8 transition-all flex flex-col ${
                        mod.active ? 'border-b-fowy-secondary' : 'border-b-slate-100 opacity-70 grayscale-[0.5]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-8">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg ${
                          mod.active ? 'bg-fowy-secondary text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          <Icon size={32} />
                        </div>
                        {mod.active ? (
                          <span className="px-5 py-2 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 ring-2 ring-green-100">
                            <CheckCircle2 size={12} /> Habilitado
                          </span>
                        ) : (
                          <span className="px-5 py-2 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                            <XCircle size={12} /> Bloqueado
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-2xl font-black text-slate-800 mb-2">{mod.name}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed mb-10 flex-1">
                        {mod.description}
                      </p>
                      
                      <button 
                        disabled
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          mod.active ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-300'
                        }`}
                      >
                        {mod.active ? "Módulo en Uso" : "Solicitar Activación"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="p-10 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Layers size={180} />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <h4 className="text-2xl font-black mb-4">¿Necesitas una solución a medida?</h4>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    FOWY escala con tu negocio. Si necesitas integración con POS externo, 
                    módulos de inventario avanzado o inteligencia de datos, nuestro equipo lo habilita por ti.
                  </p>
                  <button className="px-10 py-4 bg-fowy-secondary text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-3">
                    <MessageCircle size={24} />
                    Hablar con un Especialista
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
