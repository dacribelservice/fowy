import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Heart, Flame } from 'lucide-react';
import PremiumImage from '@/components/admin/shared/PremiumImage';

interface ProductCardV2Props {
  product: any;
  onAdd: (product: any) => void;
  onRemove: (productId: string) => void;
  quantity: number;
  accentColor?: string;
}

export function ProductCardV2({ product, onAdd, onRemove, quantity, accentColor = "#FF5A5F" }: ProductCardV2Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col h-full relative overflow-hidden group"
    >
      {/* 4.3 Imagen del Producto */}
      <div className="relative aspect-[4/3] bg-slate-50 flex-shrink-0 overflow-hidden">
        <PremiumImage 
          src={product.image_url || "/placeholder-product.png"} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* 4.4 Badges y Superposiciones */}
        {/* Superior Izquierda: Etiqueta "Hot" */}
        {product.is_popular && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
            <Flame size={12} strokeWidth={3} />
            <span className="text-[9px] font-black uppercase tracking-wider">Hot</span>
          </div>
        )}
        
        {/* Superior Derecha: Icono Corazón */}
        <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm">
          <Heart size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* 4.5 Información de la Tarjeta */}
      <div className="flex-1 flex flex-col p-3">
        <h4 className="text-sm font-black text-slate-800 leading-tight mb-1 line-clamp-1">{product.name}</h4>
        <p className="text-[10px] font-medium text-slate-400 leading-tight mb-3 line-clamp-2 h-7">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between relative">
          <span className="text-base font-black text-slate-900 tracking-tight">
            ${product.price.toLocaleString()}
          </span>

          {/* 4.6 Botón (+) de Agregar */}
          {quantity > 0 ? (
            <div 
              className="flex items-center gap-2 rounded-full p-1 shadow-md animate-in zoom-in-50 text-white"
              style={{ backgroundColor: accentColor }}
            >
              <button 
                onClick={() => onRemove(product.id)}
                className="w-6 h-6 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 active:scale-90 transition-all"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="w-3 text-center text-[10px] font-black">{quantity}</span>
              <button 
                onClick={() => onAdd(product)}
                className="w-6 h-6 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 active:scale-90 transition-all"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onAdd(product)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
              style={{ backgroundColor: accentColor }}
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
