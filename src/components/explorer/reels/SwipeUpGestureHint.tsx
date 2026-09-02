"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface SwipeUpGestureHintProps {
  onFinish?: () => void;
}

/**
 * Componente visual que reproduce el gesto táctil de deslizar hacia arriba:
 * - Flecha gigante translúcida con degradado vertical.
 * - Mano indicadora de silueta sólida pura (sin huecos internos) con Motion Trail.
 * - Ciclo de vida autocontenido con auto-desvanecimiento a los 3 segundos exactos.
 */
export function SwipeUpGestureHint({ onFinish }: SwipeUpGestureHintProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: [0, 1, 1, 1, 0] }}
      transition={{
        duration: 3,
        times: [0, 0.1, 0.6, 0.85, 1],
        ease: "easeInOut",
      }}
      onAnimationComplete={onFinish}
      className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center select-none"
    >
      <div className="relative w-52 h-64 flex items-center justify-center">
        {/* 1. Flecha con Degradado Vertical Ascendente */}
        <motion.div
          animate={{
            y: [10, -18, 10],
            opacity: [0.6, 0.95, 0.6],
          }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 100 120"
            className="w-44 h-52 drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]"
            fill="none"
          >
            <defs>
              <linearGradient id="fowyArrowGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.03" />
                <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.25" />
                <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <polygon
              points="50,5 92,48 66,48 66,115 34,115 34,48 8,48"
              fill="url(#fowyArrowGradient)"
            />
          </svg>
        </motion.div>

        {/* 2. Mano Táctil Sólida con Rastro de Movimiento (Motion Trail - 4 Capas) */}
        <motion.div
          animate={{
            y: [38, -28, 38],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 flex items-center justify-center"
        >
          {/* Capa Trail 1 (Fondo - 15% opacidad) */}
          <div className="absolute translate-y-8 translate-x-2 opacity-15 scale-75 filter blur-[1px]">
            <SolidHandIcon />
          </div>

          {/* Capa Trail 2 (Intermedia - 35% opacidad) */}
          <div className="absolute translate-y-5 translate-x-1.5 opacity-35 scale-[0.83] filter blur-[0.5px]">
            <SolidHandIcon />
          </div>

          {/* Capa Trail 3 (Cercana - 65% opacidad) */}
          <div className="absolute translate-y-2.5 translate-x-1 opacity-65 scale-[0.92]">
            <SolidHandIcon />
          </div>

          {/* Capa Principal (Frente - 100% opacidad blanca sólida con sombra) */}
          <div className="relative opacity-100 scale-100 drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
            <SolidHandIcon />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Silueta sólida de mano con UN SOLO dedo índice señalador (fiel a la Imagen 2)
 */
function SolidHandIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-16 h-16 -rotate-[38deg] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
      fill="#FFFFFF"
    >
      <path d="M 40 38 V 10 C 40 4.5, 52 4.5, 52 10 V 38 C 55 35, 65 35, 65 41 C 67 38, 77 38, 77 44 C 79 41, 87 41, 87 47 V 64 C 87 80, 72 90, 56 90 H 48 C 34 90, 22 78, 22 64 V 54 C 22 47, 32 44, 36 50 V 38 Z" />
    </svg>
  );
}
