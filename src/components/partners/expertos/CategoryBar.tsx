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
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
      {CATEGORIES.map((cat) => (
        <button 
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border-2 ${
            activeCategory === cat 
              ? 'bg-fowy-secondary border-fowy-secondary text-white shadow-premium' 
              : 'bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-100'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
