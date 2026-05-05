"use client";

import React from "react";
import { Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
  // Puede incluir image_url y otros, pero nos enfocamos en el id y name
}

interface MenuSearchAndFiltersV2Props {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  accentColor?: string;
}

export function MenuSearchAndFiltersV2({
  categories,
  selectedCategoryId,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  accentColor = "#FF5A5F",
}: MenuSearchAndFiltersV2Props) {
  return (
    <div className="w-full flex flex-col gap-4 mb-8 mt-2">
      {/* 3.1 Buscador Expansible / Cápsula */}
      <div className="px-6">
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800 transition-colors">
            <Search size={20} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-100 rounded-full border-2 border-transparent focus:border-slate-200 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium text-[15px]"
          />
        </div>
      </div>

      {/* 3.2 y 3.3 Carrusel de Categorías */}
      {categories.length > 0 && (
        <div className="w-full overflow-hidden">
          <div 
            className="flex items-center gap-3 overflow-x-auto px-6 pb-2 pt-1 hide-scrollbar" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => onSelectCategory(null)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                selectedCategoryId === null
                  ? "bg-red-50 border-red-200 text-red-600 shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
              style={
                selectedCategoryId === null
                  ? {
                      backgroundColor: `${accentColor}15`,
                      borderColor: `${accentColor}30`,
                      color: accentColor,
                    }
                  : {}
              }
            >
              Todos
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    isSelected
                      ? "bg-red-50 border-red-200 text-red-600 shadow-sm"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${accentColor}15`,
                          borderColor: `${accentColor}30`,
                          color: accentColor,
                        }
                      : {}
                  }
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}} />
        </div>
      )}
    </div>
  );
}
