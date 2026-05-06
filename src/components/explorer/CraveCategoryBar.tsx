"use client";

import React from "react";

interface Category {
  id: string;
  name: string;
}

interface CraveCategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  accentColor?: string;
}

export function CraveCategoryBar({
  categories,
  selectedCategory,
  onCategorySelect,
  accentColor = "#FF5A5F",
}: CraveCategoryBarProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
      {/* Botón de "Todos" */}
      <button
        onClick={() => onCategorySelect("all")}
        className={`px-[10px] py-[5px] rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-90 border cursor-pointer ${
          selectedCategory === "all"
            ? "border-transparent text-white"
            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
        }`}
        style={
          selectedCategory === "all"
            ? {
                background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
                boxShadow: `0 4px 10px ${accentColor}66, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)`,
              }
            : {}
        }
      >
        Todos
      </button>

      {/* Categorías dinámicas */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategorySelect(cat.id)}
          className={`px-[10px] py-[5px] rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-90 border flex items-center gap-2 cursor-pointer ${
            selectedCategory === cat.id
              ? "border-transparent text-white"
              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
          }`}
          style={
            selectedCategory === cat.id
              ? {
                  background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
                  boxShadow: `0 4px 10px ${accentColor}66, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)`,
                }
              : {}
          }
        >
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
