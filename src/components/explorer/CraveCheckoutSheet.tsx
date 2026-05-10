"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useCheckoutLogic } from "./hooks/useCheckoutLogic";
import { CheckoutCartView } from "./CheckoutCartView";
import { CheckoutFormView } from "./CheckoutFormView";

export interface CraveCheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  onAddOne: (product: any) => void;
  onRemoveOne: (productId: string) => void;
  accentColor: string;
  businessName: string;
  businessPhone?: string;
  businessId?: string;
  isBusinessOpen?: boolean;
}

export function CraveCheckoutSheet({
  isOpen,
  onClose,
  cartItems,
  onAddOne,
  onRemoveOne,
  accentColor,
  businessName,
  businessPhone,
  businessId,
  isBusinessOpen,
}: CraveCheckoutSheetProps) {
  const logic = useCheckoutLogic({
    cartItems,
    businessId,
    businessPhone,
    businessName,
    isOpen,
  });

  const { checkoutStep, setCheckoutStep, groupedCart } = logic;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay con Blur y Oscurecimiento */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-[90]"
          />

          {/* Bottom Sheet con Efecto Vidrio Premium */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-[100] rounded-t-[40px] overflow-hidden flex flex-col max-h-[85%]"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.3) 100%)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              borderTop: "2px solid rgba(255, 255, 255, 0.9)",
              borderBottom: "none",
              boxShadow: "0 -20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            {/* Drag Handle & Header */}
            <div className="w-full pt-3 pb-5 px-6 shrink-0 flex flex-col items-center border-b border-white/20">
              <div className="w-12 h-1.5 bg-slate-400/30 rounded-full mb-4" />
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {checkoutStep === "checkout" && (
                    <button
                      onClick={() => setCheckoutStep("cart")}
                      className="mr-1.5 p-1 rounded-full hover:bg-black/5 active:scale-90 transition-all flex items-center justify-center"
                    >
                      <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </button>
                  )}
                  <h2 className="text-[20px] font-black text-slate-900 tracking-tight">
                    {checkoutStep === "cart" ? "Mi Pedido" : "Datos de Envío"}
                  </h2>
                  {checkoutStep === "cart" && (
                    <span
                      className="text-[12px] font-bold px-2.5 py-0.5 rounded-full text-white shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
                        boxShadow: `0 2px 6px ${accentColor}40`,
                      }}
                    >
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* Renderización Condicional de Vistas */}
            <AnimatePresence mode="wait">
              {checkoutStep === "cart" ? (
                <CheckoutCartView
                  key="cart-step"
                  accentColor={accentColor}
                  cartItems={cartItems}
                  groupedCart={groupedCart}
                  onAddOne={onAddOne}
                  onRemoveOne={onRemoveOne}
                  onContinue={() => setCheckoutStep("checkout")}
                  isBusinessOpen={isBusinessOpen}
                />
              ) : (
                <CheckoutFormView
                  key="checkout-step"
                  accentColor={accentColor}
                  businessName={businessName}
                  cartItems={cartItems}
                  {...logic}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
