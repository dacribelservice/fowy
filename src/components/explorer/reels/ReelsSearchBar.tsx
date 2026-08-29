"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface ReelsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ReelsSearchBar({ value, onChange }: ReelsSearchBarProps) {
  return (
    <div className="relative w-full px-4">
      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-3.5 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar por plato, antojo o restaurante..."
          className="w-full h-10 pl-10 pr-9 bg-slate-100/90 rounded-full text-xs font-semibold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-fowy-orange/30 transition-all border border-slate-200/50"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 active:scale-95 transition-all"
            title="Borrar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
