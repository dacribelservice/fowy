"use client";

import React from "react";
import { Mic, Square } from "lucide-react";

interface CopilotVoiceMicProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
  variant?: "standalone" | "inline";
}

/**
 * Componente minimalista de grabación de voz nativo Web Audio API / MediaRecorder.
 * Cero 3D: Iconografía plana vectorial lucide-react y micro-animaciones fluidas.
 */
export const CopilotVoiceMic: React.FC<CopilotVoiceMicProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  disabled = false,
  variant = "standalone",
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  const isInline = variant === "inline";

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      {/* Halo pulsante visual al grabar */}
      {isRecording && (
        <span className="absolute -inset-1 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title={isRecording ? "Detener grabación y enviar audio" : "Dictar nota de voz"}
        aria-label={isRecording ? "Detener grabación" : "Iniciar dictado de voz"}
        className={`relative flex items-center justify-center transition-all duration-200 outline-none select-none ${
          isInline
            ? disabled
              ? "w-7 h-7 rounded-full text-slate-600 cursor-not-allowed"
              : isRecording
              ? "w-7 h-7 rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-2 ring-rose-400 scale-105"
              : "w-7 h-7 rounded-full text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 active:scale-90"
            : disabled
            ? "w-10 h-10 rounded-full bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
            : isRecording
            ? "w-10 h-10 rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400 scale-105"
            : "w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 shadow hover:shadow-md hover:scale-105 active:scale-95"
        }`}
      >
        {isRecording ? (
          <Square className="w-3.5 h-3.5 fill-white animate-pulse" strokeWidth={2} />
        ) : (
          <Mic className="w-4 h-4" strokeWidth={1.8} />
        )}
      </button>

      {/* Micro-badge de estado para accesibilidad y visualización */}
      {isRecording && (
        <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-semibold tracking-wider uppercase animate-pulse shadow pointer-events-none whitespace-nowrap">
          Grabando...
        </div>
      )}
    </div>
  );
};

export default CopilotVoiceMic;
