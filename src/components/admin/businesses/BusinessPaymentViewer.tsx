import React, { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { BusinessData } from "@/app/admin/negocios/[id]/page";

interface BusinessPaymentViewerProps {
  business: BusinessData;
}

export function BusinessPaymentViewer({ business }: BusinessPaymentViewerProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comprobante de Pago</label>
      <div className="mt-2 flex items-center gap-6 p-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50">
        {business.payment_proof_url ? (
          <>
            <div 
              onClick={() => setIsImageModalOpen(true)}
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0 group cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={business.payment_proof_url} alt="Comprobante" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold px-3 py-1 bg-white/20 rounded-full backdrop-blur-md">Ampliar</span>
              </div>
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-bold text-slate-800 mb-1">Comprobante Recibido</h5>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                El dueño del negocio ha enviado este comprobante. Haz clic en la imagen para verla en tamaño completo.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-2 border-slate-200 flex flex-col gap-2 items-center justify-center bg-white text-slate-400 shrink-0 shadow-sm">
              <ImageIcon size={32} className="opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Sin Comprobante</span>
            </div>
            <div className="flex-1 space-y-3">
              <h5 className="text-sm font-bold text-slate-800 mb-1">Esperando Comprobante</h5>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                El dueño del negocio aún no ha enviado el comprobante de pago para este periodo.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Image Modal Popup */}
      {isImageModalOpen && business?.payment_proof_url && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 sm:p-10"
          onClick={() => setIsImageModalOpen(false)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative max-w-4xl max-h-full w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-white flex justify-between items-center border-b border-slate-100">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Comprobante de Pago</h3>
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="overflow-auto p-4 bg-slate-100 flex items-center justify-center min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={business.payment_proof_url} 
                alt="Comprobante ampliado" 
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-md border border-slate-200 bg-white"
              />
            </div>
            <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
              <a 
                href={business.payment_proof_url}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-fowy-primary/10 text-fowy-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-fowy-primary/20 transition-colors"
              >
                Abrir Original
              </a>
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="px-6 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
