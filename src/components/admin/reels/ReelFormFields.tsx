"use client";

import React from "react";
import { Store, Film, Link as LinkIcon } from "lucide-react";
import Autocomplete from "@/components/admin/shared/Autocomplete";

export interface ReelFormFieldsProps {
  title: string;
  onTitleChange: (val: string) => void;
  instagramUrl: string;
  onInstagramUrlChange: (val: string) => void;
  businessInputValue?: string;
  onBusinessInputChange?: (val: string) => void;
  businessOptions?: string[];
  isBusinessPreselected: boolean;
  businessName?: string;
  disabled?: boolean;
}

export function ReelFormFields({
  title,
  onTitleChange,
  instagramUrl,
  onInstagramUrlChange,
  businessInputValue = "",
  onBusinessInputChange,
  businessOptions = [],
  isBusinessPreselected,
  businessName,
  disabled = false,
}: ReelFormFieldsProps) {
  return (
    <div className="space-y-4 flex-1">
      {isBusinessPreselected ? (
        <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-100/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-fowy-orange text-white flex items-center justify-center shrink-0 shadow-sm shadow-fowy-orange/30">
            <Store size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-black uppercase tracking-wider text-fowy-orange block">
              Restaurante Vinculado
            </span>
            <span className="text-sm font-bold text-slate-800 truncate block">
              {businessName || "Negocio Seleccionado"}
            </span>
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
            Restaurante <span className="text-red-500">*</span>
          </label>
          <Autocomplete
            value={businessInputValue}
            onChange={(val) => onBusinessInputChange?.(val)}
            options={businessOptions}
            placeholder="Buscar restaurante por nombre o ciudad..."
            disabled={disabled}
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
          Título del Video / Plato <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Film size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Ej. Hamburguesa Doble Artesanal"
            disabled={disabled}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-fowy-orange/20 focus:border-fowy-orange outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
          Enlace de Instagram (Reel o Post) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="url"
            value={instagramUrl}
            onChange={(e) => onInstagramUrlChange(e.target.value)}
            placeholder="https://www.instagram.com/reel/C-xyz..."
            disabled={disabled}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-fowy-orange/20 focus:border-fowy-orange outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
          />
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-1 ml-1">
          Formatos compatibles: <span className="font-mono text-slate-600">instagram.com/reel/...</span> o <span className="font-mono text-slate-600">/p/...</span>
        </p>
      </div>
    </div>
  );
}
