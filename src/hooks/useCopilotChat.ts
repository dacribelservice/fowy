"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { CopilotChatMessage, PendingActionDTO } from "@/types/finance";

export interface AttachedMedia {
  mimeType: string;
  data: string; // Base64 en memoria RAM
  previewUrl: string;
}

const INITIAL_WELCOME: CopilotChatMessage = {
  id: "welcome-1",
  sender: "assistant",
  text: "Hola Cristian. Estoy lista para asistirte en finanzas, cobros y tareas. Puedes dictarme, escribirme o pegarme pantallazos de pagos.",
  timestamp: new Date().toISOString(),
};

/**
 * Hook directivo para gestión del Copilot IA FOWY.
 * Soporta dictado Web Audio API, pegado de capturas Ctrl+V en RAM y confirmación en 2 pasos.
 */
export function useCopilotChat() {
  const [messages, setMessages] = useState<CopilotChatMessage[]>([INITIAL_WELCOME]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<AttachedMedia | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => { if (attachedMedia?.previewUrl) URL.revokeObjectURL(attachedMedia.previewUrl); };
  }, [attachedMedia]);

  const attachImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const previewUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const data = (reader.result as string)?.split(",")[1];
      if (data) {
        setAttachedMedia((prev) => {
          if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
          return { mimeType: file.type, data, previewUrl };
        });
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent | ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) { attachImageFile(file); e.preventDefault(); break; }
      }
    }
  }, [attachImageFile]);

  const clearAttachedMedia = useCallback(() => {
    setAttachedMedia((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  }, []);

  const sendMessage = useCallback(async (customText?: string, customMedia?: { mimeType: string; data: string }) => {
    const textToSend = (customText ?? inputText).trim();
    const mediaToSend = customMedia ?? (attachedMedia ? { mimeType: attachedMedia.mimeType, data: attachedMedia.data } : undefined);
    if (!textToSend && !mediaToSend) return;

    const userMsg: CopilotChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend || (mediaToSend?.mimeType.startsWith("audio/") ? "🎤 Nota de voz enviada" : "📷 Comprobante adjunto"),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    clearAttachedMedia();
    setIsSending(true);

    try {
      const res = await fetch("/api/admin/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, media: mediaToSend }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          text: data.text || (data.error ? `⚠️ ${data.error}` : "Instrucción recibida."),
          pendingAction: data.pendingAction || null,
          receipt: data.receipt || null,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error conectando con Copilot";
      setMessages((prev) => [...prev, { id: `err-${Date.now()}`, sender: "assistant", text: `⚠️ Error: ${errMsg}`, timestamp: new Date().toISOString() }]);
    } finally {
      setIsSending(false);
    }
  }, [inputText, attachedMedia, clearAttachedMedia]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        stream.getTracks().forEach((t) => t.stop());
        const reader = new FileReader();
        reader.onloadend = () => {
          const data = (reader.result as string)?.split(",")[1];
          if (data) sendMessage("", { mimeType, data });
        };
        reader.readAsDataURL(blob);
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("[useCopilotChat] Permiso de micrófono denegado:", err);
    }
  }, [sendMessage]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const confirmAction = useCallback(async (action: PendingActionDTO) => {
    setIsSending(true);
    try {
      const res = await fetch("/api/admin/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm", actionId: action.id }),
      });
      const data = await res.json();
      setMessages((prev) =>
        prev.map((m) => m.pendingAction?.id === action.id ? { ...m, pendingAction: { ...m.pendingAction, status: "executed" }, receipt: data.receipt || m.receipt } : m)
      );
    } catch (err) {
      console.error("[useCopilotChat] Error confirmando acción:", err);
    } finally {
      setIsSending(false);
    }
  }, []);

  const cancelAction = useCallback(async (actionId: string) => {
    setIsSending(true);
    try {
      await fetch("/api/admin/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", actionId }),
      });
      setMessages((prev) =>
        prev.map((m) => m.pendingAction?.id === actionId ? { ...m, pendingAction: { ...m.pendingAction, status: "cancelled" } } : m)
      );
    } catch (err) {
      console.error("[useCopilotChat] Error cancelando acción:", err);
    } finally {
      setIsSending(false);
    }
  }, []);

  const clearHistory = useCallback(() => setMessages([INITIAL_WELCOME]), []);

  return {
    messages, inputText, setInputText, isSending, isRecording, attachedMedia,
    startRecording, stopRecording, handlePaste, attachImageFile,
    clearAttachedMedia, sendMessage, confirmAction, cancelAction, clearHistory,
  };
}

export default useCopilotChat;
