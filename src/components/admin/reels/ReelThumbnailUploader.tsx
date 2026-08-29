"use client";

import React, { useRef } from "react";
import { UploadCloud, Image as ImageIcon, Trash2 } from "lucide-react";

export interface ReelThumbnailUploaderProps {
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function ReelThumbnailUploader({
  previewUrl,
  onFileSelect,
  onClear,
  disabled = false,
}: ReelThumbnailUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
        Portada del Video (9:16)
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative w-36 aspect-[9/16] rounded-2xl overflow-hidden shadow-md border-2 border-fowy-orange/30 group">
          <img
            src={previewUrl}
            alt="Preview portada"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-800 text-[10px] font-black rounded-xl uppercase tracking-wider shadow-sm hover:scale-105 transition-transform"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={onClear}
              className="p-2 bg-red-500 text-white rounded-xl shadow-sm hover:scale-105 transition-transform"
              title="Eliminar portada"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          className="w-36 aspect-[9/16] rounded-2xl border-2 border-dashed border-slate-200 hover:border-fowy-orange/50 bg-slate-50 hover:bg-orange-50/20 cursor-pointer flex flex-col items-center justify-center gap-2 p-4 text-center transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-fowy-orange transition-colors">
            <UploadCloud size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-fowy-orange transition-colors">
            Subir Portada
          </span>
          <span className="text-[9px] font-medium text-slate-400">
            WebP o JPG (9:16)
          </span>
        </div>
      )}
    </div>
  );
}
