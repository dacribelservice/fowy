"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_promo?: boolean;
}

interface CraveProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  accentColor?: string;
}

export function CraveProductDetailModal({
  product,
  onClose,
  onAddToCart,
  accentColor = "#FF5A5F",
}: CraveProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const totalPrice = product.price * quantity;

  return (
    <>
      {/* Backdrop Blur Oscuro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md z-[110]"
      />

      {/* Modal Container */}
      <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center p-6 z-[120] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="bg-white/90 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl border border-white/60 flex flex-col w-full max-w-[340px] pointer-events-auto relative"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)"
          }}
        >
          {/* Botón Cerrar Flotante */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/15 backdrop-blur-md flex items-center justify-center border border-white/20 text-white hover:bg-black/30 active:scale-90 transition-all z-20 shadow-md cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Imagen del Producto en Alta Resolución */}
          <div className="h-52 w-full relative overflow-hidden bg-slate-100 shrink-0">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.is_promo && (
              <div
                className="absolute top-4 left-4 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
                }}
              >
                Promo
              </div>
            )}
          </div>

          {/* Información y Texto */}
          <div className="p-5 flex-1 overflow-y-auto max-h-[160px]">
            <h2 className="text-lg font-black text-slate-900 leading-tight">
              {product.name}
            </h2>
            <p className="text-slate-500 text-[12px] mt-2 leading-relaxed">
              {product.description}
            </p>

            {/* Selector Táctil de Cantidad V3 */}
            <div className="flex items-center justify-between border-t border-slate-100/80 pt-3.5 mt-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantidad</span>
              <div className="flex items-center gap-3 bg-slate-100/80 p-1 rounded-full border border-slate-200/50">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm transition-all active:scale-90 hover:bg-slate-150 cursor-pointer text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
                <span className="text-xs font-black text-slate-800 w-5 text-center select-none">{quantity}</span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
                    boxShadow: `0 2px 6px ${accentColor}40`
                  }}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer con Precio Expandido y Botón Agregar */}
          <div className="p-5 bg-white/40 border-t border-white/20 shrink-0 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Subtotal</span>
              <span className="text-[18px] font-black text-slate-900 leading-none">
                ${totalPrice.toLocaleString("es-CO")}
              </span>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 py-3 rounded-full text-white font-bold text-[13px] tracking-wide transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
                boxShadow: `0 8px 20px ${accentColor}40, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.3)`
              }}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Agregar
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
