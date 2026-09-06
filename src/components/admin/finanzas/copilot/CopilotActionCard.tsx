"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Edit3, Share2, FileText, ArrowRightLeft, DollarSign, Calendar } from "lucide-react";
import type { PendingActionDTO, ReceiptData } from "@/types/finance";
import { formatCOP, buildOfficialReceiptText, buildWhatsAppLink } from "@/utils/financeReceipt";

interface CopilotActionCardProps {
  action: PendingActionDTO;
  receipt?: ReceiptData | null;
  onConfirm: (action: PendingActionDTO, updatedPayload?: Record<string, any>) => Promise<void> | void;
  onCancel: (actionId: string) => Promise<void> | void;
  isProcessing?: boolean;
}

/**
 * Tarjeta de Confirmación en Dos Pasos y Ajuste Rápido del Copilot IA (<180L).
 * Cero 3D: Iconografía plana vectorial lucide-react y compartir recibo WhatsApp en 1 clic.
 */
export const CopilotActionCard: React.FC<CopilotActionCardProps> = ({
  action,
  receipt,
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState<number>(action.payload?.amount || 50000);
  const [method, setMethod] = useState<string>(action.payload?.payment_method || action.payload?.account_code || "nequi");
  const [notes, setNotes] = useState<string>(action.payload?.notes || "");

  // 1. Tarjeta de Éxito con Botón WhatsApp
  if (action.status === "executed" || receipt) {
    const rcpt = receipt || {
      receipt_number: action.payload?.receipt_number || 1,
      receipt_code: action.payload?.receipt_code || "REC-OK",
      business_name: action.payload?.business_name || "Restaurante",
      amount,
      payment_method: method,
      period_start: new Date().toLocaleDateString("es-CO"),
      period_end: new Date(Date.now() + 30 * 86400000).toLocaleDateString("es-CO"),
    };

    return (
      <div className="mt-2 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs shadow-md space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={2} />
          <span>¡Acción ejecutada con éxito!</span>
        </div>
        <p className="text-slate-300">
          {action.action_type === "register_payment"
            ? `Recibo: ${rcpt.receipt_code || "#REC-XXXX"} • Monto: ${formatCOP(rcpt.amount)}`
            : `Monto aplicado: ${formatCOP(amount)} en ${method.toUpperCase()}`}
        </p>
        {action.action_type === "register_payment" && (
          <button
            type="button"
            onClick={() => window.open(buildWhatsAppLink("", buildOfficialReceiptText(rcpt)), "_blank")}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow transition-all hover:scale-[1.01]"
          >
            <Share2 className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Enviar Recibo por WhatsApp</span>
          </button>
        )}
      </div>
    );
  }

  // 2. Tarjeta Cancelada
  if (action.status === "cancelled") {
    return (
      <div className="mt-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
        <XCircle className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
        <span>Acción cancelada. No se modificaron fondos.</span>
      </div>
    );
  }

  const p = action.payload || {};
  const actionTitle = {
    register_payment: "REGISTRO DE PAGO DE MEMBRESÍA",
    register_expense: "REGISTRO DE GASTO OPEX",
    register_transfer: "TRASPASO DE FONDOS",
    schedule_task: "AGENDAR TAREA",
  }[action.action_type] || "CONFIRMACIÓN DE ACCIÓN";

  return (
    <div className="mt-2 p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 shadow-lg space-y-2.5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 font-semibold text-amber-400">
          {action.action_type === "register_payment" && <FileText className="w-4 h-4" strokeWidth={1.8} />}
          {action.action_type === "register_expense" && <DollarSign className="w-4 h-4" strokeWidth={1.8} />}
          {action.action_type === "register_transfer" && <ArrowRightLeft className="w-4 h-4" strokeWidth={1.8} />}
          {action.action_type === "schedule_task" && <Calendar className="w-4 h-4" strokeWidth={1.8} />}
          <span>{actionTitle}</span>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-slate-400 hover:text-amber-400 transition flex items-center gap-1 text-[11px]"
        >
          <Edit3 className="w-3 h-3" strokeWidth={1.8} />
          <span>{isEditing ? "Cerrar" : "Ajustar"}</span>
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-1 text-slate-300">
          {p.business_name && <div>• <span className="text-slate-400">Negocio:</span> {p.business_name}</div>}
          <div>• <span className="text-slate-400">Monto:</span> <span className="font-semibold text-emerald-400">{formatCOP(amount)}</span></div>
          <div>• <span className="text-slate-400">Cuenta:</span> <span className="uppercase text-amber-300 font-medium">{method}</span></div>
          {p.category && <div>• <span className="text-slate-400">Categoría:</span> {p.category}</div>}
          {p.description && <div>• <span className="text-slate-400">Detalle:</span> {p.description}</div>}
          {notes && <div>• <span className="text-slate-400">Notas:</span> {notes}</div>}
        </div>
      ) : (
        <div className="space-y-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Monto COP</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Cuenta / Método</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs outline-none focus:border-amber-500"
              >
                <option value="nequi">Nequi</option>
                <option value="daviplata">Daviplata</option>
                <option value="bancolombia">Bancolombia</option>
                <option value="cash">Efectivo</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Notas</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observación opcional"
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onConfirm(action, isEditing ? { amount, payment_method: method, account_code: method, notes } : undefined)}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium transition shadow"
        >
          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{isProcessing ? "Aplicando..." : "Confirmar y Aplicar"}</span>
        </button>
        <button
          type="button"
          onClick={() => onCancel(action.id)}
          disabled={isProcessing}
          className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 hover:text-white transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CopilotActionCard;
