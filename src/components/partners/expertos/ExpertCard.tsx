"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Zap } from "lucide-react";

interface ExpertCardProps {
  expert: any;
  index: number;
  onClick: (expert: any) => void;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ 
  expert, 
  index, 
  onClick 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onClick(expert)}
      className="glass-morphism p-10 rounded-[3rem] shadow-glass border-b-8 border-b-slate-100 hover:border-b-fowy-secondary cursor-pointer hover:shadow-premium transition-all group relative flex flex-col"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-[2rem] overflow-hidden ring-4 ring-white shadow-xl transition-transform group-hover:scale-110">
            <img 
              src={expert.image} 
              alt={expert.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {expert.verified && (
            <div className="absolute -bottom-2 -right-2 bg-fowy-blue text-white p-2 rounded-full border-4 border-white shadow-lg">
              <ShieldCheck size={16} />
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ring-2 ring-green-100">
            <Star size={14} fill="currentColor" />
            {expert.rating}
          </div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
            {expert.stats?.completions || 0} Éxitos
          </span>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-black text-slate-800 group-hover:text-fowy-secondary transition-colors mb-2">
          {expert.name}
        </h3>
        <p className="text-xs font-black text-fowy-blue uppercase tracking-widest mb-6">
          {expert.specialty}
        </p>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-8">
          {expert.description}
        </p>
      </div>

      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex -space-x-3">
          {expert.portfolio?.slice(0, 3).map((item: any, i: number) => (
            <div 
              key={i} 
              className="w-10 h-10 rounded-xl border-4 border-white overflow-hidden shadow-sm group-hover:translate-y-[-4px] transition-transform" 
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <img src={item.image_url} className="w-full h-full object-cover" alt="prev" />
            </div>
          ))}
          {(expert.portfolio?.length || 0) > 3 && (
            <div className="w-10 h-10 rounded-xl bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
              +{expert.portfolio.length - 3}
            </div>
          )}
        </div>
        <span className="text-sm font-black text-fowy-secondary group-hover:translate-x-2 transition-transform flex items-center gap-2">
          Ver Perfil <Zap size={16} />
        </span>
      </div>
    </motion.div>
  );
};
