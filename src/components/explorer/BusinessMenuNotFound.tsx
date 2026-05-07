"use client";

import React from "react";
import { useRouter } from "next/navigation";

/**
 * BusinessMenuNotFound: Interfaz limpia y estilizada para notificar que un
 * menú/negocio de Crave Vision no está disponible, permitiendo regresar al Explorador.
 */
export function BusinessMenuNotFound() {
  const router = useRouter();

  return (
    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center gap-6">
      <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Menú No Disponible</h1>
      <p className="text-sm text-slate-500">No pudimos encontrar este negocio o el enlace no es válido.</p>
      <button 
        onClick={() => router.push("/explorar")}
        className="px-6 py-3 bg-slate-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest cursor-pointer hover:bg-slate-800 transition-colors"
      >
        Volver a Explorar
      </button>
    </div>
  );
}

export default BusinessMenuNotFound;
