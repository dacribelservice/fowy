"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

/**
 * CraveVisionSandbox: El "Lienzo en Blanco" para el Re-Diseño Premium.
 * Esta página vive dentro del MobileFrame del layout, por lo que hereda el marco del celular.
 */
export default function CraveVisionSandbox() {
  const { slug } = useParams();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sandbox Indicator (Solo para desarrollo) */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Crave Vision Sandbox</p>
          <p className="text-xs font-bold text-slate-800">Negocio: <span className="text-orange-500">{slug}</span></p>
        </div>
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <div className="w-2 h-2 rounded-full bg-slate-200"></div>
           <div className="w-2 h-2 rounded-full bg-slate-200"></div>
        </div>
      </div>

      {/* Main Content Area - LIENZO EN BLANCO */}
      <div className="flex-grow flex flex-col items-center justify-center p-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[240px]"
        >
          {/* Icono de Diseño */}
          <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-white rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-orange-100">
            <span className="text-3xl">✨</span>
          </div>
          
          <h2 className="text-xl font-black text-slate-900 leading-tight">Lienzo en Blanco Preparado</h2>
          <p className="text-sm text-slate-400 mt-4 font-medium leading-relaxed">
            Estamos listos para construir el diseño <span className="text-slate-900 font-bold">Premium V3</span> desde cero, pieza por pieza.
          </p>

          <div className="mt-8 flex flex-col gap-3">
             <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-orange-500 rounded-full"></div>
             </div>
             <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Esperando primer bloque de diseño...</p>
          </div>
        </motion.div>
      </div>

      {/* Footer Placeholder */}
      <div className="p-6 bg-slate-50/50">
         <div className="h-12 w-full bg-white rounded-2xl border border-slate-100 border-dashed"></div>
      </div>
    </div>
  );
}
