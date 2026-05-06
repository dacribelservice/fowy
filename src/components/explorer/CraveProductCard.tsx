"use client";

import React from "react";
import { Plus, Heart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_promo?: boolean;
}

interface CraveProductCardProps {
  product: Product;
  onSelect: () => void;
  onAddToCart: () => void;
  accentColor?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function CraveProductCard({
  product,
  onSelect,
  onAddToCart,
  accentColor = "#FF5A5F",
  isFavorite = false,
  onToggleFavorite,
}: CraveProductCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col relative group">
      {/* Imagen del Producto */}
      <div 
        onClick={onSelect}
        className="h-32 w-full relative overflow-hidden bg-slate-50 cursor-pointer"
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.is_promo && (
          <div 
            className="absolute top-2 left-2 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10"
            style={{
              background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
              boxShadow: `0 2px 6px ${accentColor}40`,
            }}
          >
            Promo
          </div>
        )}
        {/* Ícono de Favoritos (Corazón) - Premium Glassmorphism */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite();
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-sm transition-all active:scale-90 hover:bg-white/30 z-10 cursor-pointer"
        >
          <Heart 
            className={`w-3.5 h-3.5 stroke-[2.5] transition-colors ${
              isFavorite ? "text-red-500 fill-red-500" : "text-white"
            }`} 
          />
        </button>
      </div>

      {/* Información del Producto */}
      <div className="p-3 flex-1 flex flex-col">
        <div 
          onClick={onSelect}
          className="cursor-pointer flex-1 flex flex-col"
        >
          <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-slate-500 text-[11px] mt-1 line-clamp-2 flex-1 leading-snug">
            {product.description}
          </p>
        </div>

        {/* Precio y Botón de Acción */}
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-slate-900 text-[15px]">
            ${product.price.toLocaleString("es-CO")}
          </span>

          {/* Botón flotante de acción premium */}
          <button
            onClick={onAddToCart}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-90 hover:brightness-110 border border-white/20 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
              boxShadow: `0 4px 10px ${accentColor}66, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)`
            }}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
