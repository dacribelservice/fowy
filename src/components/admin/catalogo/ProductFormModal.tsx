"use client";

import React from "react";
import { GlobalCategory, GlobalProduct } from "@/types/catalogo";

interface ProductFormModalProps {
  isOpen: boolean;
  product: GlobalProduct | null;
  categories: GlobalCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductFormModal({
  isOpen,
  product,
  categories,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-100 shadow-xl">
        <h3 className="text-lg font-black text-slate-800">
          {product ? "Editar Producto" : "Nuevo Producto"}
        </h3>
        <p className="text-sm text-slate-500 mt-2">
          El modal completo se integrará en el Paso 5.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
