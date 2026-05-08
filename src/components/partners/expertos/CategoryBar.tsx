"use client";

import React from "react";

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = ['Todos', 'Marketing', 'Fotografía', 'Anuncios', 'Diseño'];

export const CategoryBar: React.FC<CategoryBarProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full max-w-full">
      {CATEGORIES.map((cat) => (
        <button 
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 whitespace-nowrap border ${
            activeCategory === cat 
              ? 'bg-gradient-to-b from-[#7B61FF] to-[#5C40FF] border-[#7B61FF]/10 text-white shadow-[0_4px_12px_rgba(123,97,255,0.25)] border-t-white/10' 
              : 'bg-white/70 backdrop-blur-sm border-slate-200/50 text-slate-500 hover:text-[#7B61FF] hover:bg-slate-50'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
