"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus } from "lucide-react";

export interface CheckoutCartViewProps {
  groupedCart: any[];
  cartItems: any[];
  accentColor: string;
  onAddOne: (product: any) => void;
  onRemoveOne: (productId: string) => void;
  onContinue: () => void;
}

export function CheckoutCartView({
  groupedCart,
  cartItems,
  accentColor,
  onAddOne,
  onRemoveOne,
  onContinue,
}: CheckoutCartViewProps) {
  const totalPrice = cartItems.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <>
      {/* Lista de productos scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide max-h-[48vh]">
        <motion.div
          key="cart-view"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 15 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {groupedCart.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white/40 p-3 rounded-2xl border border-white/30 backdrop-blur-sm shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-white/50">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 text-[14px] leading-tight line-clamp-2">
                    {item.name}
                  </span>
                  <span className="text-[13px] font-semibold text-slate-500 mt-0.5">
                    ${item.price.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>

              {/* Controles de cantidad de alta fidelidad con efectos de profundidad */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onRemoveOne(item.id)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-all duration-200 active:scale-90 border border-slate-100 shadow-md hover:shadow-lg overflow-hidden"
                  style={{
                    boxShadow:
                      "0 4px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {item.quantity === 1 ? (
                      <motion.span
                        key="trash"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center justify-center text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="minus"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.15 }}
                        className="text-[18px] font-bold leading-none select-none flex items-center justify-center pb-0.5"
                        style={{ color: accentColor }}
                      >
                        -
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <span className="text-[14px] font-black text-slate-800 w-6 text-center select-none">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onAddOne(item)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-90 border border-white/10"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
                    boxShadow: `0 4px 10px ${accentColor}50, inset 0 -1px 2px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.3)`,
                  }}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer con Total y Botón de Acción */}
      <div className="pt-6 px-6 pb-16 bg-white/20 backdrop-blur-md border-t border-white/20 shrink-0 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between px-1">
          <span className="text-slate-500 font-bold text-[14px] uppercase tracking-wider">
            Total del Pedido
          </span>
          <span className="text-[24px] font-black text-slate-900 tracking-tight">
            ${totalPrice.toLocaleString("es-CO")}
          </span>
        </div>

        {/* Botón Finalizar */}
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-full text-white font-bold text-[16px] tracking-wide transition-all duration-300 active:scale-95 shadow-lg relative overflow-hidden group border border-white/10"
          style={{
            background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
            boxShadow: `0 10px 25px ${accentColor}66, inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4)`,
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Finalizar Pedido
          </span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </>
  );
}
