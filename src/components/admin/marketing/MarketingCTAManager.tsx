"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Check, 
  X, 
  Edit2, 
  Save,
  AlertCircle
} from "lucide-react";
import { MarketingCTA } from "@/hooks/useMarketingManager";
import DeleteConfirmModal from "@/components/admin/shared/DeleteConfirmModal";

interface MarketingCTAManagerProps {
  ctas: MarketingCTA[];
  loading: boolean;
  error: string | null;
  onAdd: (text: string) => Promise<any>;
  onUpdate: (id: string, updates: Partial<MarketingCTA>) => Promise<any>;
  onDelete: (id: string) => Promise<boolean>;
  onReorder: (newCtas: MarketingCTA[]) => Promise<any>;
  onToast: (message: string) => void;
}

export default function MarketingCTAManager({
  ctas,
  loading,
  error,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onToast
}: MarketingCTAManagerProps) {
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Agregar nueva frase
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    setAdding(true);
    try {
      const result = await onAdd(newText.trim());
      if (result) {
        setNewText("");
        onToast("¡Frase publicitaria agregada con éxito!");
      }
    } finally {
      setAdding(false);
    }
  };

  // Guardar edición en línea
  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return;
    const result = await onUpdate(id, { text: editText.trim() });
    if (result) {
      setEditingId(null);
      onToast("¡Frase actualizada correctamente!");
    }
  };

  // Activar/desactivar frase
  const handleToggleActive = async (id: string, currentState: boolean) => {
    const result = await onUpdate(id, { is_active: !currentState });
    if (result) {
      onToast(!currentState ? "¡Frase activada con éxito!" : "Frase desactivada con éxito.");
    }
  };

  // Confirmar eliminación
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const success = await onDelete(deletingId);
    if (success) {
      onToast("¡Frase eliminada correctamente!");
    }
    setDeletingId(null);
  };

  // Reordenar frases (Subir/Bajar)
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ctas.length) return;

    const reordered = [...ctas];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    await onReorder(reordered);
    onToast("¡Orden de frases actualizado!");
  };

  return (
    <div className="mt-16 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      {/* Glow Efecto Decorativo */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-fowy-red/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/15 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Llamados a la Acción Rotativos (CTAs)
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl">
            Estas frases rotarán dinámicamente con transiciones premium arriba del pie de página para enganchar a tus usuarios. Los negocios verán incrementadas sus vistas.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 text-red-400 rounded-2xl flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Formulario de Adición */}
      <form onSubmit={handleAdd} className="mb-8 flex gap-3 max-w-3xl">
        <div className="relative flex-1">
          <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Ej: ¿Listo para más? ¡Promociones 2x1 esperándote! ⚡"
            className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/80 transition-all duration-300"
            disabled={adding}
          />
        </div>
        <button
          type="submit"
          disabled={adding || !newText.trim()}
          className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Agregar</span>
        </button>
      </form>

      {/* Listado de Frases */}
      <div className="space-y-3">
        {ctas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/25">
            <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-slate-400 text-sm font-semibold text-center">
              No hay frases configuradas actualmente
            </p>
            <p className="text-slate-500 text-xs text-center mt-1">
              Agrega tu primera frase publicitaria arriba para activarla de inmediato.
            </p>
          </div>
        ) : (
          ctas.map((cta, index) => {
            const isEditing = editingId === cta.id;
            return (
              <div 
                key={cta.id}
                className={`group flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                  cta.is_active 
                    ? "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/60" 
                    : "bg-slate-950/10 border-slate-900/60 opacity-60 hover:opacity-80"
                }`}
              >
                {/* Lado izquierdo: Orden badge + Contenido */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center select-none shadow-inner">
                    #{index + 1}
                  </div>

                  {isEditing ? (
                    <div className="flex-1 flex gap-2 min-w-0">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(cta.id)}
                        className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg border border-emerald-500/30 transition-colors"
                        title="Guardar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 bg-slate-800 text-slate-400 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm sm:text-base font-medium truncate select-all">
                        {cta.text}
                      </p>
                    </div>
                  )}
                </div>

                {/* Acciones del lado derecho */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Switch is_active */}
                  <button
                    onClick={() => handleToggleActive(cta.id, cta.is_active)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      cta.is_active ? "bg-emerald-500" : "bg-slate-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        cta.is_active ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>

                  {/* Editar */}
                  {!isEditing && (
                    <button
                      onClick={() => {
                        setEditingId(cta.id);
                        setEditText(cta.text);
                      }}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all duration-200"
                      title="Editar frase"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Flechas de orden */}
                  <div className="flex flex-col sm:flex-row gap-1">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-1 text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      title="Subir"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={index === ctas.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-1 text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      title="Bajar"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => setDeletingId(cta.id)}
                    className="p-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 rounded-xl border border-red-950/30 hover:border-red-500/30 transition-all duration-200"
                    title="Eliminar frase"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Frase Publicitaria"
        message="¿Estás seguro de que deseas eliminar esta frase? Los menús del explorador dejarán de mostrarla de forma inmediata en su rotación de marketing."
      />
    </div>
  );
}
