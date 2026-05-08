import React, { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Check } from "lucide-react";
import { BusinessData } from "@/app/admin/negocios/[id]/page";
import { createClient } from "@/utils/supabase/client";

interface BusinessPaymentViewerProps {
  business: BusinessData;
  onRefresh?: () => void;
}

export function BusinessPaymentViewer({ business, onRefresh }: BusinessPaymentViewerProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleConfirmPayment = async () => {
    if (!business.payment_proof_id) return;
    try {
      setConfirming(true);
      const supabase = createClient();
      const { error } = await supabase
        .from("payment_proofs")
        .update({ status: "approved" })
        .eq("id", business.payment_proof_id);

      if (error) throw error;

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Error al confirmar el pago");
    } finally {
      setConfirming(false);
    }
  };

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
            <div className="flex-1 space-y-3">
              <div>
                <h5 className="text-sm font-bold text-slate-800 mb-1">Comprobante Recibido</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  El dueño del negocio ha enviado este comprobante. Haz clic en la imagen para ampliar o verifícalo presionando "Confirmado".
                </p>
              </div>
              <button
                onClick={handleConfirmPayment}
                disabled={confirming}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer disabled:pointer-events-none"
              >
                {confirming ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={14} />
                    Confirmado
                  </>
                )}
              </button>
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
              <button
                onClick={async () => {
                  setIsImageModalOpen(false);
                  await handleConfirmPayment();
                }}
                disabled={confirming}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors shadow-lg cursor-pointer"
              >
                {confirming ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={14} />
                    Confirmar Pago
                  </>
                )}
              </button>
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
