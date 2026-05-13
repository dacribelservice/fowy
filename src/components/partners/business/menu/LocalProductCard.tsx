"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import { type Product } from "@/hooks/useProductManager";

interface LocalProductCardProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleOffer: (id: string, currentOffer: boolean) => void;
  onToggleStock: (id: string, currentStock: boolean) => void;
}

export default function LocalProductCard({
  product,
  index,
  onEdit,
  onDelete,
  onToggleOffer,
  onToggleStock,
}: LocalProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="glass-morphism rounded-fowy overflow-hidden group shadow-sm border border-white/40 hover:shadow-premium transition-all duration-300"
    >
      <div className="aspect-video bg-slate-100 relative overflow-hidden">
        <PremiumImage 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
          fallbackType="generic"
        />
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button 
            type="button"
            onClick={() => onEdit(product)}
            className="p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-fowy-secondary shadow-sm transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Pencil size={16} />
          </button>
          <button 
            type="button"
            onClick={() => onDelete(product.id)}
            className="p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 shadow-sm transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7B61FF] bg-[#7B61FF]/10 px-2 py-0.5 rounded-full">
            {product.category_name || 'Sin Categoría'}
          </span>
          <span className="text-lg font-bold text-slate-800">
            ${Number(product.price).toLocaleString()}
          </span>
        </div>
        <h3 className="font-bold text-slate-800 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2 h-10">
          {product.description || 'Sin descripción disponible.'}
        </p>

        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
          {/* Fila de Promoción/Oferta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.is_offer ? 'bg-[#FF5A5F]' : 'bg-slate-300'}`} />
              <span className="text-xs font-bold text-slate-600">
                {product.is_offer ? 'En Promoción' : 'Sin Promo'}
              </span>
            </div>
            
            <button 
              type="button"
              onClick={() => onToggleOffer(product.id, product.is_offer)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                product.is_offer ? 'bg-[#FF5A5F]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                  product.is_offer ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Fila de Stock */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs font-bold text-slate-600">
                {product.in_stock ? 'En Stock' : 'Agotado'}
              </span>
            </div>
            
            <button 
              type="button"
              onClick={() => onToggleStock(product.id, product.in_stock)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                product.in_stock ? 'bg-[#7B61FF]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                  product.in_stock ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
