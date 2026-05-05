"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pipette, Hash } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

/**
 * ColorPickerFowy
 * Selector de color con diseño circular, presets pequeños y selector personalizado destacado.
 */
export const ColorPickerFowy = ({ color, onChange }: ColorPickerProps) => {
  const [hex, setHex] = useState(color);

  useEffect(() => {
    setHex(color);
  }, [color]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('#')) value = '#' + value;
    if (value.length > 7) value = value.slice(0, 7);
    setHex(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onChange(value);
    }
  };

  const presets = ['#FF5A5F', '#7B61FF', '#4D8BFF', '#FF9A3D', '#10B981', '#000000'];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-end gap-8 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
        
        {/* Sección de Presets - Círculos Pequeños */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Paleta Base
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <motion.button
                key={p}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onChange(p)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  color.toUpperCase() === p.toUpperCase() 
                    ? 'border-slate-800 ring-2 ring-slate-100 scale-110 shadow-md' 
                    : 'border-white hover:border-slate-200'
                }`}
                style={{ backgroundColor: p }}
              />
            ))}
          </div>
        </div>

        {/* Separador Visual */}
        <div className="h-12 w-[1px] bg-slate-100 hidden md:block self-center" />

        {/* Sección de Personalización - Círculo Grande con Título */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">
            Personaliza tu color
          </span>
          <div className="flex items-center gap-5">
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full shadow-xl cursor-pointer border-4 border-white overflow-hidden relative ring-1 ring-slate-200"
                style={{ backgroundColor: color }}
              >
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => onChange(e.target.value)}
                  className="absolute inset-0 w-[300%] h-[300%] opacity-0 cursor-pointer -translate-x-1/4 -translate-y-1/4"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/5">
                  <Pipette size={24} className="text-white drop-shadow-sm" />
                </div>
              </motion.div>
              {/* Glow Dinámico */}
              <div 
                className="absolute inset-0 -z-10 blur-2xl opacity-20"
                style={{ backgroundColor: color }}
              />
            </div>

            <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-fowy-secondary/10 transition-all">
              <Hash size={14} className="text-slate-300 group-focus-within:text-slate-500" />
              <input 
                type="text" 
                value={hex}
                onChange={handleHexChange}
                className="bg-transparent border-none p-0 font-mono font-bold text-slate-700 focus:outline-none uppercase w-20 text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-fowy-flow/5 rounded-2xl border border-fowy-secondary/10">
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
          El color seleccionado se aplicará a todos los elementos interactivos de tu menú digital para mantener la coherencia de tu marca.
        </p>
      </div>
    </div>
  );
};
