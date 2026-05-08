import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Globe, Phone, MapPin, Zap, Star } from "lucide-react";
import { BusinessData } from "@/app/admin/negocios/[id]/page";

interface TopBarProps {
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
}

export function BusinessTopBar({ onBack, onSave, saving }: TopBarProps) {
  return (
    <div className="flex items-center justify-between mb-10">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-fowy-orange transition-colors font-bold text-xs uppercase tracking-widest group"
      >
        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
          <ArrowLeft size={18} />
        </div>
        Volver al Listado
      </button>

      <button 
        onClick={onSave}
        disabled={saving}
        className="px-8 py-4 bg-fowy-primary text-white rounded-2xl shadow-xl shadow-fowy-red/20 hover:shadow-fowy-red/30 transition-all active:scale-95 flex items-center gap-3 font-black uppercase tracking-widest text-[10px]"
      >
        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
        {saving ? "Guardando..." : "Guardar Cambios"}
      </button>
    </div>
  );
}

interface ProfileCardProps {
  business: BusinessData;
}

export function BusinessProfileCard({ business }: ProfileCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 shadow-md shadow-slate-100/50 border border-slate-100 relative overflow-hidden flex flex-col items-center text-center"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-fowy-orange/5 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none" />
      
      {/* Logo */}
      <div className="w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-fowy-red to-fowy-orange shadow-md flex-shrink-0 mb-2">
        <div className="w-full h-full rounded-[14px] overflow-hidden border-2 border-white bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={business.logo_url} className="w-full h-full object-cover" alt={business.name} />
        </div>
      </div>

      {/* Text Info */}
      <div className="flex flex-col items-center gap-1 mb-3">
        <h2 className="text-base font-black text-slate-800 tracking-tight leading-tight">{business.name}</h2>
        <span className="text-[8px] font-mono text-slate-400 font-bold uppercase tracking-widest opacity-70">ID: {business.id.slice(0,8)}</span>
        
        <div className={`mt-1.5 inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
          business.status 
            ? 'bg-green-50/70 text-green-600 border-green-100/50' 
            : 'bg-red-50/70 text-red-600 border-red-100/50'
        }`}>
          {business.status ? "● Negocio Activo" : "○ Negocio Inactivo"}
        </div>
      </div>

      {/* Info Rows */}
      <div className="w-full border-t border-slate-50 pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin size={12} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Ubicación</span>
          </div>
          <span className="font-semibold text-slate-600 text-right">{business.city}, {business.country}</span>
        </div>

        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2 text-slate-400">
            <Phone size={12} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Teléfono</span>
          </div>
          <span className="font-semibold text-slate-600 text-right">+{business.phone}</span>
        </div>

        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2 text-slate-400">
            <Globe size={12} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Enlace</span>
          </div>
          <span className="font-semibold text-fowy-orange lowercase text-right">/{business.slug}</span>
        </div>
      </div>
    </motion.div>
  );
}

interface BasicSettingsProps {
  business: BusinessData;
  onChange: (updates: Partial<BusinessData>) => void;
}

export function BusinessBasicSettings({ business, onChange }: BasicSettingsProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estatus del Negocio</label>
        <select 
          value={business.status ? "true" : "false"}
          onChange={(e) => onChange({ status: e.target.value === "true" })}
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
          onChange={(e) => onChange({ plan: e.target.value })}
          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none"
        >
          <option value="standard">Standard</option>
          <option value="pro">Pro</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Próximo Pago (Fecha)</label>
        <input 
          type="date"
          value={business.payment_date?.split('T')[0] || ''}
          onChange={(e) => onChange({ payment_date: e.target.value })}
          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio de Membresía (COP)</label>
        <input 
          type="number"
          value={business.membership_price !== undefined && business.membership_price !== null ? business.membership_price : ''}
          onChange={(e) => onChange({ membership_price: e.target.value === '' ? null : Number(e.target.value) })}
          placeholder="Ej: 115000"
          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none"
        />
      </div>
    </>
  );
}
