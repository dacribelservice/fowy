"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, MessageSquare, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { formatCOP, buildOfficialReceiptText, buildWhatsAppLink } from "@/utils/financeReceipt";
import type { ReceiptData } from "@/types/finance";

interface QuickPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  business?: { id: string; name: string; monthly_fee?: number; phone?: string } | null;
  accounts?: Array<{ id: string; code: string; name: string; current_balance: number }>;
}

const supabase = createClient();

export const QuickPaymentModal: React.FC<QuickPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  business,
  accounts = [],
}) => {
  const [amount, setAmount] = useState<number>(business?.monthly_fee || 50000);
  const [accountId, setAccountId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("nequi");
  const [isPartial, setIsPartial] = useState<boolean>(false);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [remainingDueDate, setRemainingDueDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedReceipt, setCompletedReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    if (business) {
      setAmount(business.monthly_fee || 50000);
      setIsPartial(false);
      setRemainingAmount(0);
      setCompletedReceipt(null);
    }
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
      setPaymentMethod(accounts[0].code);
    }
  }, [business, accounts, accountId]);

  if (!isOpen || !business) return null;

  const handleAccountChange = (accId: string) => {
    setAccountId(accId);
    const acc = accounts.find((a) => a.id === accId);
    if (acc) setPaymentMethod(acc.code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return toast.error("El monto debe ser mayor a cero");
    if (!accountId) return toast.error("Selecciona una cuenta de destino");

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("apply_confirmed_membership_payment", {
        p_business_id: business.id,
        p_account_id: accountId,
        p_amount: amount,
        p_payment_method: paymentMethod,
        p_extension_days: 30,
        p_notes: notes || null,
        p_is_partial: isPartial,
        p_remaining_amount: isPartial ? remainingAmount : 0,
        p_remaining_due_date: isPartial && remainingDueDate ? remainingDueDate : null,
      });

      if (error) throw error;

      const receipt: ReceiptData = {
        receipt_number: (data as any)?.receipt_number || 1,
        receipt_code: (data as any)?.receipt_code || "#REC-0001",
        business_name: business.name,
        amount: amount,
        payment_method: paymentMethod,
        period_start: new Date().toISOString().split("T")[0],
        period_end: (data as any)?.next_billing_date?.split("T")[0] || "",
        is_partial: isPartial,
        remaining_amount: isPartial ? remainingAmount : 0,
        notes: notes,
      };

      setCompletedReceipt(receipt);
      toast.success(`Pago registrado con éxito (${receipt.receipt_code})`);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Error al procesar el pago");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Registrar Cobro</h3>
            <p className="text-xs text-slate-500 truncate max-w-[280px]">{business.name}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {completedReceipt ? (
          <div className="space-y-3 py-2">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-500" strokeWidth={1.75} />
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">¡Pago Aplicado con Éxito!</p>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-300">{completedReceipt.receipt_code} — {formatCOP(completedReceipt.amount)}</p>
            </div>
            <a
              href={buildWhatsAppLink(business.phone || "", buildOfficialReceiptText(completedReceipt))}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar Recibo por WhatsApp</span>
            </a>
            <button type="button" onClick={onClose} className="w-full py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 transition cursor-pointer">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Monto Cobrado (COP)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Cuenta de Ingreso</label>
              <select
                value={accountId}
                onChange={(e) => handleAccountChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 outline-none"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name} ({formatCOP(acc.current_balance)})</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input type="checkbox" checked={isPartial} onChange={(e) => setIsPartial(e.target.checked)} className="rounded border-slate-300 text-sky-600 focus:ring-0" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Abono parcial (con saldo pendiente)</span>
            </label>

            {isPartial && (
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div>
                  <label className="block text-[10px] font-semibold text-amber-700 dark:text-amber-400 mb-0.5">Saldo Restante</label>
                  <input type="number" value={remainingAmount} onChange={(e) => setRemainingAmount(Number(e.target.value))} className="w-full px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-amber-700 dark:text-amber-400 mb-0.5">Fecha Compromiso</label>
                  <input type="date" value={remainingDueDate} onChange={(e) => setRemainingDueDate(e.target.value)} className="w-full px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 outline-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Notas / Observaciones</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej: Pago mensualidad vía Nequi..." className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 outline-none" />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={onClose} className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Procesando..." : "Confirmar Cobro"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuickPaymentModal;
