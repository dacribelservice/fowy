"use client";

import React, { useState } from "react";
import { MapPin, Printer, Camera, DollarSign, Calendar, PlusCircle, CheckCircle2, Clock, Check } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import type { TaskType } from "@/types/finance";

export interface CeoTaskItem {
  id: string;
  title: string;
  task_type: TaskType;
  due_time: string | null;
  status: string;
  business_id: string | null;
}

interface CeoAgendaChecklistProps {
  tasks?: CeoTaskItem[];
  onOpenNewTaskModal?: () => void;
  onRevalidate?: () => void;
  isLoading?: boolean;
}

const TASK_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  visita: { label: "Visita", icon: MapPin, color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20" },
  impresion_volantes: { label: "Volantes", icon: Printer, color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20" },
  fotos: { label: "Fotos", icon: Camera, color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20" },
  cobro: { label: "Cobro", icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  reunion: { label: "Reunión", icon: Calendar, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  otro: { label: "Otro", icon: Calendar, color: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20" },
};

const supabase = createClient();

export const CeoAgendaChecklist: React.FC<CeoAgendaChecklistProps> = ({
  tasks = [],
  onOpenNewTaskModal,
  onRevalidate,
  isLoading = false,
}) => {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const handleToggleTask = async (task: CeoTaskItem) => {
    const isCompleted = completedIds.has(task.id) || task.status === "completed";
    const nextStatus = isCompleted ? "pending" : "completed";

    setCompletedIds((prev) => {
      const updated = new Set(prev);
      isCompleted ? updated.delete(task.id) : updated.add(task.id);
      return updated;
    });

    try {
      const { error } = await supabase.from("ceo_tasks").update({ status: nextStatus }).eq("id", task.id);
      if (error) throw error;
      onRevalidate?.();

      if (!isCompleted && task.business_id && (task.task_type === "fotos" || task.task_type === "impresion_volantes")) {
        const key = task.task_type === "fotos" ? "photos" : "flyers";
        toast("Tarea completada", {
          description: "¿Actualizar entregables de este restaurante en su ficha?",
          action: {
            label: "Sí, sincronizar",
            onClick: async () => {
              const { data: sub } = await supabase.from("business_subscriptions").select("deliverables").eq("business_id", task.business_id).single();
              const curr = (sub?.deliverables as Record<string, any>) || {};
              await supabase.from("business_subscriptions").update({ deliverables: { ...curr, [key]: "delivered" } }).eq("business_id", task.business_id);
              toast.success("Entregable actualizado en ficha");
              onRevalidate?.();
            },
          },
        });
      }
    } catch (err) {
      toast.error("Error al actualizar la tarea");
      setCompletedIds((prev) => {
        const rb = new Set(prev);
        isCompleted ? rb.add(task.id) : rb.delete(task.id);
        return rb;
      });
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Agenda de Campo del CEO</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Visitas presenciales, cobros y entregables</p>
          </div>
          {onOpenNewTaskModal && (
            <button
              type="button"
              onClick={onOpenNewTaskModal}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Nueva Tarea</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          {isLoading && <div className="py-6 text-center text-xs text-slate-400">Cargando agenda...</div>}

          {!isLoading && tasks.length === 0 && (
            <div className="py-6 text-center flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <CheckCircle2 className="w-8 h-8 mb-1.5 opacity-40 text-emerald-500" strokeWidth={1.5} />
              <p className="text-xs font-medium">¡Sin tareas pendientes para hoy!</p>
              <p className="text-[10px] text-slate-400">Agenda de calle 100% al día</p>
            </div>
          )}

          {!isLoading &&
            tasks.map((task) => {
              const isCompleted = completedIds.has(task.id) || task.status === "completed";
              const meta = TASK_META[task.task_type] || TASK_META.otro;
              const Icon = meta.icon;

              return (
                <div
                  key={task.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                    isCompleted
                      ? "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800/50 opacity-60"
                      : "bg-white/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task)}
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition shrink-0 cursor-pointer ${
                        isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-600 hover:border-emerald-500"
                      }`}
                    >
                      {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${isCompleted ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-200"}`}>
                        {task.title}
                      </p>
                      {task.due_time && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-2.5 h-2.5" strokeWidth={1.75} />
                          <span>{task.due_time.slice(0, 5)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0 ${meta.color}`}>
                    <Icon className="w-3 h-3" strokeWidth={1.75} />
                    <span>{meta.label}</span>
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CeoAgendaChecklist;
