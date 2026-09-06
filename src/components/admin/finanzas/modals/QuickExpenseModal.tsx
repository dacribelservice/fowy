"use client";

import React, { useState, useEffect } from "react";
import { X, PlusCircle, Coffee, Fuel, Printer, Server, UserCheck, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { formatCOP } from "@/utils/financeReceipt";
import type { ExpenseCategory } from "@/types/finance";

interface QuickExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  accounts?: Array<{ id: string; code: string; name: string; current_balance: number }>;
}

const CATEGORIES: Array<{ key: ExpenseCategory; label: string; icon: React.ElementType }> = [
  { key: "viaticos_calle", label: "Viáticos calle (comida)", icon: Coffee },
  { key: "transporte_movilidad", label: "Transporte (gasolina/pasajes)", icon: Fuel },
  { key: "material_negocios", label: "Material negocios (volantes/fotos)", icon: Printer },
  { key: "tecnologia_fija", label: "Tecnología fija (servidores/APIs)", icon: Server },
  { key: "salario_ceo", label: "Honorarios CEO Cristian", icon: UserCheck },
  { key: "otros", label: "Otros gastos", icon: MoreHorizontal },
];

const supabase = createClient();

export const QuickExpenseModal: React.FC<QuickExpenseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  accounts = [],
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<ExpenseCategory>("viaticos_calle");
  const [accountId, setAccountId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return toast.error("El monto debe ser mayor a cero");
    if (!accountId) return toast.error("Selecciona la cuenta de egreso");
    if (!description.trim()) return toast.error("Ingresa una descripción del gasto");

    setIsSubmitting(true);
    try {
      const { error } = await supabase.rpc("apply_confirmed_expense", {
        p_account_id: accountId,
        p_category: category,
        p_amount: amount,
        p_description: description.trim(),
        p_related_business_id: null,
        p_expense_date: new Date().toISOString().split("T")[0],
      });

      if (error) throw error;

      toast.success(`Gasto de ${formatCOP(amount)} registrado con éxito`);
      setAmount(0);
      setDescription("");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Error al registrar el gasto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Registrar Gasto OPEX</h3>
            <p className="text-xs text-slate-500">Egreso deducible de operación</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría Oficial OPEX</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const selected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                      selected
                        ? "bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-400 font-semibold"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                    <span className="text-[11px] truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Monto del Gasto (COP)</label>
            <input
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Ej: 25000"
              className="w-full px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-rose-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Cuenta de Origen</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-rose-500 outline-none"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name} ({formatCOP(acc.current_balance)})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción / Concepto</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Almuerzo en ruta de visitas..."
              className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-rose-500 outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer">Cancelar</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Guardando..." : "Registrar Gasto"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickExpenseModal;
