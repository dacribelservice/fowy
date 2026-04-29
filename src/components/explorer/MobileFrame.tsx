'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExplorerInfoLeft } from './ExplorerInfoLeft';
import { ExplorerInfoRight } from './ExplorerInfoRight';

/**
 * MobileFrame: El "Escudo Térmico" del Explorador.
 * En PC muestra un marco de celular premium.
 * En Móvil desaparece el marco y ocupa toda la pantalla.
 */
export const MobileFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-[#FF4D00] bg-gradient-to-br from-[#FF8A00] via-[#FF4D00] to-[#FF0000] flex items-center justify-center p-0 md:p-4 overflow-hidden relative">
      
      {/* Información Lateral Izquierda (Solo PC) */}
      <div className="hidden lg:flex flex-col w-[280px] h-[720px] mr-8 justify-center">
        <ExplorerInfoLeft />
      </div>

      {/* Frame del Celular */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full h-screen md:w-[340px] md:h-[720px] bg-white md:rounded-[40px] md:shadow-[0_0_0_10px_#111,0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden z-10 flex flex-col border-none md:border-[6px] md:border-black shadow-2xl"
      >
        {/* Notch / Dynamic Island simulado (Solo PC) */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[25px] bg-black rounded-b-[18px] z-50"></div>

        {/* Contenido de la Aplicación */}
        <div className="flex-grow overflow-y-auto scrollbar-hide relative bg-white">
          {children}
        </div>

        {/* Barra de navegación inferior simulada (Solo PC) */}
        <div className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-gray-200/50 rounded-full z-50"></div>
      </motion.div>

      {/* Información Lateral Derecha (Solo PC) */}
      <div className="hidden lg:flex flex-col w-[280px] h-[720px] ml-8 justify-center">
        <ExplorerInfoRight />
      </div>

      {/* Capa de textura sutil para el fondo */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
    </div>
  );
};

