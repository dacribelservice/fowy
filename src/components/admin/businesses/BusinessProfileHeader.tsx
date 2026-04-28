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
  const formatPaymentDate = (date: string | Date | null | undefined) => {
    if (!date) return "No definido";
    try {
      const dateString = typeof date === 'string' ? date : date.toISOString();
      const [year, month, day] = dateString.split('T')[0].split('-');
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const monthName = months[parseInt(month, 10) - 1];
      if (!day || !monthName || !year) return dateString.split('T')[0];
      return `${day}/${monthName}/${year}`;
    } catch (e) {
      return String(date);
    }
  };

  return (
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <span className="text-xs font-black">{formatPaymentDate(business.payment_date)}</span>
        </div>
      </div>
    </div>
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
          value={typeof business.payment_date === 'string' ? business.payment_date.split('T')[0] : ''}
          onChange={(e) => onChange({ payment_date: e.target.value })}
          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none"
        />
      </div>
    </>
  );
}
