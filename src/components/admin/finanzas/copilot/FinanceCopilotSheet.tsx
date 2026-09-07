"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, Plus, ArrowUp } from "lucide-react";
import { useCopilotChat } from "@/hooks/useCopilotChat";
import { CopilotActionCard } from "./CopilotActionCard";
import { CopilotVoiceMic } from "./CopilotVoiceMic";

interface FinanceCopilotSheetProps {
  todayTasksCount?: number;
}

/**
 * Panel Flotante Adaptativo del Agente FOWY (CFO & Secretaria) (<220L).
 * Móvil: bottom-24 right-4 y Bottom Sheet; Desktop: Drawer lateral.
 */
function renderFormattedMessage(text: string, isUser: boolean = false) {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Detectar viñetas: empieza con "* " o "- "
        const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ");
        const cleanLine = isBullet ? trimmed.replace(/^[\*\-]\s+/, "") : line;

        // Parsear negritas: **texto**
        const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);

        const renderedLine = parts.map((part, partIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            const boldText = part.slice(2, -2);
            return (
              <strong
                key={partIdx}
                className={isUser ? "font-bold text-white" : "font-bold text-white tracking-wide"}
              >
                {boldText}
              </strong>
            );
          }
          return <React.Fragment key={partIdx}>{part}</React.Fragment>;
        });

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-0.5 my-0.5">
              <span className={`select-none text-[12px] leading-none mt-0.5 ${isUser ? "text-white/80" : "text-amber-400 font-bold"}`}>
                •
              </span>
              <div className="flex-1 leading-relaxed">{renderedLine}</div>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="leading-relaxed">
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
}

export const FinanceCopilotSheet: React.FC<FinanceCopilotSheetProps> = ({ todayTasksCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages, inputText, setInputText, isSending, isRecording, attachedMedia,
    startRecording, stopRecording, handlePaste, attachImageFile,
    clearAttachedMedia, sendMessage, confirmAction, cancelAction,
  } = useCopilotChat();

  const isCopilotDisabled = process.env.NEXT_PUBLIC_COPILOT_ENABLED === "false";

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() && !attachedMedia) return;
    sendMessage(inputText.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 1. Botón Flotante Ergonómico (no tapa el botón + en celular) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir Agente FOWY"
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 select-none"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="w-5 h-5 text-amber-400" strokeWidth={1.8} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <span className="text-xs font-semibold tracking-wide">AGENTE FOWY</span>
        {todayTasksCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
            {todayTasksCount} Hoy
          </span>
        )}
      </button>

      {/* 2. Panel Desplegable: Bottom Sheet en móvil (<768px) / Drawer lateral en desktop (>=768px) */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-black/65 backdrop-blur-md transition-opacity duration-300 animate-in fade-in">
          <div
            onPaste={handlePaste}
            className="w-full md:w-[440px] h-[90vh] md:h-full mt-auto md:mt-0 rounded-t-[2.2rem] md:rounded-none md:rounded-l-3xl bg-slate-950/95 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-slate-800/90 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out animate-in slide-in-from-bottom md:slide-in-from-right"
          >
            {/* Tirador táctil ergonómico para móvil */}
            <div className="md:hidden w-12 h-1.5 bg-slate-700/80 hover:bg-slate-600 rounded-full mx-auto my-3 cursor-grab transition-all" />

            {/* Cabecera del Asistente */}
            <div className="px-5 py-3 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
                  <Bot className="w-4 h-4 text-amber-400" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>AGENTE FOWY</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} />
                  </h3>
                  <p className="text-[10px] text-slate-400">CFO & Secretaria Ejecutiva</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition active:scale-95"
                aria-label="Cerrar asistente"
              >
                <X className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>

            {/* Banner de Kill Switch si aplica */}
            {isCopilotDisabled && (
              <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1.5 text-[11px] text-amber-300 text-center font-medium">
                ⚠️ Copilot en pausa preventiva. Usa los modales manuales.
              </div>
            )}

            {/* Lista de Mensajes con Scroll */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl shadow-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-amber-600 text-white rounded-tr-none max-w-[85%]"
                        : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none max-w-[92%]"
                    }`}
                  >
                    {renderFormattedMessage(msg.text, msg.sender === "user")}
                  </div>

                  {/* Tarjeta estructurada de pre-confirmación en 2 pasos */}
                  {msg.pendingAction && (
                    <div className="w-full max-w-[92%]">
                      <CopilotActionCard
                        action={msg.pendingAction}
                        receipt={msg.receipt}
                        onConfirm={confirmAction}
                        onCancel={cancelAction}
                        isProcessing={isSending}
                      />
                    </div>
                  )}
                </div>
              ))}

              {isSending && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs py-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-500 ml-1">Procesando...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Previsualización de Imagen Pegada con Ctrl+V o Adjunta */}
            {attachedMedia && (
              <div className="mx-3.5 mb-2 px-3 py-2 rounded-2xl border border-slate-700/80 bg-slate-900/90 backdrop-blur-md flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2.5">
                  <img
                    src={attachedMedia.previewUrl}
                    alt="Adjunto efímero"
                    className="w-10 h-10 object-cover rounded-xl border border-slate-700"
                  />
                  <div className="text-[11px] text-slate-300">
                    <span className="block font-medium text-white">Comprobante / Ticket</span>
                    <span className="text-slate-400 text-[10px]">Listo para análisis con IA</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearAttachedMedia}
                  className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition active:scale-95"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            )}

            {/* Barra de Entrada Flotante Estilo iOS / Apple iMessage */}
            <form
              onSubmit={handleSend}
              className="px-3.5 pb-4 pt-2 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent flex items-center gap-2 select-none"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) attachImageFile(f); }}
              />

              {/* Botón Circular + Flotante */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Adjuntar pantallazo o ticket"
                aria-label="Adjuntar imagen o ticket"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center shrink-0 border border-slate-700/70 shadow-md transition-all duration-200 active:scale-90"
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
              </button>

              {/* Cápsula Flotante Unificada iMessage */}
              <div className="flex-1 min-h-[46px] flex items-center bg-slate-900/90 border border-slate-700/70 focus-within:border-amber-500/80 focus-within:ring-2 focus-within:ring-amber-500/20 rounded-full px-3.5 py-1.5 shadow-lg backdrop-blur-md transition-all duration-200">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSending || isCopilotDisabled}
                  placeholder={isRecording ? "Escuchando..." : "Dicta o escribe instrucción..."}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400/80 outline-none pr-1.5"
                />

                {/* Transición fluida: Botón de Enviar o Micrófono Integrado */}
                {Boolean(inputText.trim() || attachedMedia) ? (
                  <button
                    type="submit"
                    disabled={isSending || isCopilotDisabled}
                    className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-all duration-200 shadow-md active:scale-90 shrink-0 select-none animate-in zoom-in-75 duration-150"
                    aria-label="Enviar mensaje"
                  >
                    <ArrowUp className="w-4 h-4" strokeWidth={2.6} />
                  </button>
                ) : (
                  <CopilotVoiceMic
                    variant="inline"
                    isRecording={isRecording}
                    onStartRecording={startRecording}
                    onStopRecording={stopRecording}
                    disabled={isSending || isCopilotDisabled}
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FinanceCopilotSheet;
