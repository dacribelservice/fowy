"use client";

import React, { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import type { TaskType, PriorityLevel } from "@/types/finance";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  businesses?: Array<{ id: string; name: string }>;
}

const TASK_TYPES: Array<{ key: TaskType; label: string }> = [
  { key: "visita", label: "Visita presencial" }, { key: "impresion_volantes", label: "Imprenta de volantes" },
  { key: "fotos", label: "Sesión de fotos" }, { key: "cobro", label: "Cobro programado" },
  { key: "reunion", label: "Reunión directiva" }, { key: "otro", label: "Otro mandado" },
];

const supabase = createClient();

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  businesses = [],
}) => {
  const [title, setTitle] = useState<string>("");
  const [taskType, setTaskType] = useState<TaskType>("visita");
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [dueTime, setDueTime] = useState<string>("");
  const [priority, setPriority] = useState<PriorityLevel>("media");
  const [businessId, setBusinessId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Ingresa el título de la tarea");

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("ceo_tasks").insert({
        title: title.trim(),
        task_type: taskType,
        due_date: dueDate,
        due_time: dueTime || null,
        priority: priority,
        business_id: businessId || null,
        status: "pending",
      });

      if (error) throw error;
      toast.success("Tarea agendada exitosamente");
      setTitle("");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Error al agendar tarea");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Nueva Tarea del CEO</h3>
            <p className="text-xs text-slate-500">Agendar visita de campo o mandado</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Título de la Labor</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Llevar volantes a Pizzería..." className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-sky-500" required />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
              <select value={taskType} onChange={(e) => setTaskType(e.target.value as TaskType)} className="w-full px-2 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none">
                {TASK_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Prioridad</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as PriorityLevel)} className="w-full px-2 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none">
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-2 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Hora (Opcional)</label>
              <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="w-full px-2 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none" />
            </div>
          </div>

          {businesses.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Negocio (Opcional)</label>
              <select value={businessId} onChange={(e) => setBusinessId(e.target.value)} className="w-full px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none">
                <option value="">Sin negocio específico</option>
                {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Agendando..." : "Crear Tarea"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
