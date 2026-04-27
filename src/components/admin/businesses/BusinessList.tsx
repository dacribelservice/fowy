"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Phone, 
  Edit2, 
  Trash2, 
  MapPin, 
  Calendar,
  MoreVertical
} from "lucide-react";
import Link from "next/link";

export interface Business {
  id: string;
  name: string;
  slug: string;
  plan: 'standard' | 'pro' | 'premium';
  city: string;
  country: string;
  phone: string;
  payment_date: string;
  logo_url: string;
  status: boolean;
  created_at: string;
}

interface BusinessListProps {
  businesses: Business[];
  onDelete?: (id: string, name: string) => void;
}

export default function BusinessList({ businesses, onDelete }: BusinessListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === "all" || b.plan === filterPlan;
    const matchesStatus = filterStatus === "all" || (filterStatus === "active" ? b.status : !b.status);
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Filtros e Buscador Inteligente */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col xl:flex-row gap-4 items-center justify-between"
      >
        <div className="relative w-full xl:w-[450px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Buscar negocio por nombre o ID..."
            className="w-full pl-12 pr-4 py-4 rounded-[20px] glass-morphism border-white/50 focus:ring-2 focus:ring-fowy-orange/30 outline-none transition-all shadow-sm placeholder:text-slate-400 text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full xl:w-auto">
          <select 
            className="flex-1 xl:w-44 px-4 py-4 rounded-[20px] glass-morphism border-white/50 outline-none focus:ring-2 focus:ring-fowy-orange/30 text-slate-600 font-medium appearance-none cursor-pointer"
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
          >
            <option value="all">Todos los Planes</option>
            <option value="standard">Standard</option>
            <option value="pro">Pro</option>
            <option value="premium">Premium</option>
          </select>

          <select 
            className="flex-1 lg:w-44 px-4 py-4 rounded-[20px] glass-morphism border-white/50 outline-none focus:ring-2 focus:ring-fowy-orange/30 text-slate-600 font-medium appearance-none cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Estatus: Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </motion.div>

      {/* Vista Desktop (Tabla High-Tech) */}
      <div className="hidden xl:block overflow-x-auto rounded-[25px] glass-morphism border-white/60 shadow-premium">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-white/40 border-b border-white/30">
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Establecimiento</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Ubicación</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Plan</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Estatus</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Vencimiento</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">WPP</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filtered.map((b) => (
                <motion.tr 
                  key={b.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group hover:bg-white/60 transition-all border-b border-white/20 last:border-0"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm bg-slate-50 group-hover:scale-110 transition-transform">
                        <img src={b.logo_url} alt={b.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-700 text-base">{b.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">ID: {b.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <MapPin size={16} className="text-fowy-blue/60" />
                      {b.city}, {b.country}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      b.plan === 'premium' ? 'bg-fowy-orange/10 text-fowy-orange border border-fowy-orange/20' :
                      b.plan === 'pro' ? 'bg-fowy-purple/10 text-fowy-purple border border-fowy-purple/20' :
                      'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {b.plan}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full shadow-sm animate-pulse ${b.status ? 'bg-green-400 shadow-green-200' : 'bg-red-400 shadow-red-200'}`} />
                      <span className="text-xs font-bold text-slate-600">{b.status ? 'ACTIVO' : 'INACTIVO'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <Calendar size={16} className="text-slate-300" />
                      {new Date(b.payment_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <a 
                      href={`https://wa.me/${b.phone}`}
                      target="_blank"
                      className="inline-flex p-3 rounded-2xl bg-green-400/10 text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm hover:shadow-green-200"
                    >
                      <Phone size={18} />
                    </a>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        href={`/admin/negocios/${b.id}`}
                        className="p-3 rounded-2xl bg-fowy-blue/5 text-fowy-blue hover:bg-fowy-blue hover:text-white transition-all shadow-sm"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => onDelete?.(b.id, b.name)}
                        className="p-3 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Vista Mobile (Cards Dinámicos) */}
      <div className="xl:hidden grid grid-cols-1 gap-5">
        <AnimatePresence>
          {filtered.map((b) => (
            <motion.div 
              key={b.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-morphism p-6 rounded-[30px] border-white/60 shadow-premium"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-md bg-white">
                    <img src={b.logo_url} alt={b.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-700 text-lg">{b.name}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                      <MapPin size={12} /> {b.city}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                  b.plan === 'premium' ? 'bg-fowy-orange/10 text-fowy-orange' : 'bg-slate-100 text-slate-500'
                }`}>
                  {b.plan}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/40 p-3 rounded-2xl border border-white/50">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Estatus</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${b.status ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-xs font-bold text-slate-600">{b.status ? 'ACTIVO' : 'INACTIVO'}</span>
                  </div>
                </div>
                <div className="bg-white/40 p-3 rounded-2xl border border-white/50">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Próximo Pago</span>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Calendar size={12} className="text-slate-400" />
                    {new Date(b.payment_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <a href={`https://wa.me/${b.phone}`} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[20px] bg-green-500 text-white font-bold text-sm shadow-lg shadow-green-200 active:scale-95 transition-all">
                  <Phone size={18} /> WhatsApp
                </a>
                <Link href={`/admin/negocios/${b.id}`} className="p-4 rounded-[20px] bg-white border border-white/50 text-fowy-blue shadow-sm active:scale-95 transition-all">
                  <Edit2 size={20} />
                </Link>
                <button 
                  onClick={() => onDelete?.(b.id, b.name)}
                  className="p-4 rounded-[20px] bg-white border border-white/50 text-red-400 shadow-sm active:scale-95 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
