"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { formatCOP } from "@/utils/financeReceipt";

interface AccountTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  accounts?: Array<{ id: string; code: string; name: string; current_balance: number }>;
}

const supabase = createClient();

export const AccountTransferModal: React.FC<AccountTransferModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  accounts = [],
}) => {
  const [sourceId, setSourceId] = useState<string>("");
  const [destId, setDestId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [fee, setFee] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (accounts.length >= 2) {
      setSourceId(accounts[0].id);
      setDestId(accounts[1].id);
    }
  }, [accounts]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return toast.error("El monto debe ser mayor a cero");
    if (sourceId === destId) return toast.error("La cuenta origen y destino deben ser distintas");

    const sourceAcc = accounts.find((a) => a.id === sourceId);
    if (sourceAcc && sourceAcc.current_balance < amount + fee) {
      return toast.error("Saldo insuficiente en cuenta origen");
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.rpc("apply_account_transfer", {
        p_source_account_id: sourceId,
        p_destination_account_id: destId,
        p_amount: amount,
        p_fee: fee,
        p_notes: notes || null,
      });

      if (error) throw error;
      toast.success(`Traspaso de ${formatCOP(amount)} completado`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Error al realizar el traspaso");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Traspaso de Fondos</h3>
            <p className="text-xs text-slate-500">Mover liquidez entre cuentas oficiales</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Origen</label>
              <select value={sourceId} onChange={(e) => setSourceId(e.target.value)} className="w-full px-2 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none">
                {accounts.map((acc) => <option key={acc.id} value={acc.id}>{acc.name} ({formatCOP(acc.current_balance)})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Destino</label>
              <select value={destId} onChange={(e) => setDestId(e.target.value)} className="w-full px-2 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none">
                {accounts.map((acc) => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Monto a Traspasar (COP)</label>
            <input type="number" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Ej: 100000" className="w-full px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 outline-none" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Comisión / Fee Bancario (Opcional)</label>
            <input type="number" value={fee || ""} onChange={(e) => setFee(Number(e.target.value))} placeholder="0" className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Nota o Motivo</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej: Traspaso de liquidez..." className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Transfiriendo..." : "Confirmar Traspaso"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountTransferModal;
