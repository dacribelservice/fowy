import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Star } from 'lucide-react';

interface ProductCardProps {
  product: any;
  onAdd: (product: any) => void;
  onRemove: (productId: string) => void;
  quantity: number;
}

export default function ProductCard({ product, onAdd, onRemove, quantity }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
    >
      <div className="relative aspect-square rounded-[24px] overflow-hidden bg-slate-50 mb-4 flex-shrink-0">
        <img 
          src={product.image_url || "/placeholder-product.png"} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.is_popular && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl flex items-center gap-1 shadow-sm">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[8px] font-black uppercase">Top</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <h4 className="text-sm font-black text-slate-800 leading-tight mb-1 line-clamp-1">{product.name}</h4>
        <p className="text-[10px] font-medium text-slate-400 leading-tight mb-4 line-clamp-2 h-8">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-black text-slate-900 tracking-tight">
            ${product.price.toLocaleString()}
          </span>

          {quantity > 0 ? (
            <div className="flex items-center gap-2 bg-slate-900 text-white rounded-full p-1 shadow-lg animate-in zoom-in-50">
              <button 
                onClick={() => onRemove(product.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-800 active:scale-90 transition-all"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center text-[10px] font-black">{quantity}</span>
              <button 
                onClick={() => onAdd(product)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-800 active:scale-90 transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onAdd(product)}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white active:scale-90 transition-all shadow-sm"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
