"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface CraveMagicCartProps {
  cartItems: any[];
  onClick: () => void;
  accentColor: string;
  isVisible: boolean;
}

export function CraveMagicCart({
  cartItems,
  onClick,
  accentColor,
  isVisible,
}: CraveMagicCartProps) {
  const total = cartItems.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          onClick={onClick}
          initial={{
            width: "64px",
            height: "64px",
            borderRadius: "32px",
            opacity: 0,
            y: 60,
            x: "-50%",
            scale: 0.5,
          }}
          animate={{
            width: "92%",
            height: "72px",
            borderRadius: "36px",
            opacity: 1,
            y: 0,
            x: "-50%",
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 60,
            scale: 0.8,
            x: "-50%",
            width: "64px",
          }}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 14,
            mass: 1.1,
          }}
          className="absolute bottom-[50px] left-1/2 z-50 overflow-hidden cursor-pointer flex items-center justify-between"
          style={{
            // Glassmorphism ultra-premium super marcado
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.3) 100%)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            borderTop: "1px solid rgba(255, 255, 255, 0.9)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow:
              "0 25px 50px -12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <motion.div
            className="flex items-center justify-between w-full h-full px-5"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.35, duration: 0.45, ease: "easeOut" }}
          >
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
                Ver Pedido
              </span>
              <span className="text-[22px] font-black text-slate-900 leading-none tracking-tight">
                ${total.toLocaleString("es-CO")}
              </span>
            </div>

            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 relative"
              style={{
                background: `linear-gradient(135deg, ${accentColor}e6 0%, ${accentColor} 100%)`,
                boxShadow: `0 8px 20px ${accentColor}80, inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4)`,
              }}
            >
              <ShoppingCart className="w-[20px] h-[20px] stroke-[2.5]" />
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={cartItems.length}
                  initial={{ scale: 0, y: 10, rotate: -45 }}
                  animate={{ scale: 1, y: 0, rotate: 0 }}
                  exit={{ scale: 0, y: -10, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[12px] w-[24px] h-[24px] flex items-center justify-center rounded-full font-bold border-[2.5px] border-white shadow-md"
                >
                  {cartItems.length}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
