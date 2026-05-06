"use client";

import React from "react";
import { Search } from "lucide-react";

interface CraveSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

export function CraveSearchBar({
  searchQuery,
  setSearchQuery,
  placeholder = "Buscar producto...",
}: CraveSearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-slate-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-slate-100/80 backdrop-blur-md border border-slate-200 text-slate-800 text-[15px] font-medium rounded-full py-3.5 pl-12 pr-4 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
      />
    </div>
  );
}
