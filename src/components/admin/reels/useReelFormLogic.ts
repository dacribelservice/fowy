"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { storageService } from "@/services/storageService";
import { sanitizeInstagramUrl } from "@/utils/instagram";
import { BusinessReel } from "@/types/reels";

export interface UseReelFormLogicParams {
  initialBusinessId?: string;
  initialReel?: BusinessReel | null;
  onSuccess?: (savedReel: BusinessReel) => void;
  onClose?: () => void;
}

export function useReelFormLogic({
  initialBusinessId,
  initialReel,
  onSuccess,
  onClose,
}: UseReelFormLogicParams) {
  const supabase = createClient();
  const [title, setTitle] = useState(initialReel?.title || "");
  const [instagramUrl, setInstagramUrl] = useState(initialReel?.instagramUrl || "");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialReel?.thumbnailUrl || null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(initialBusinessId || initialReel?.businessId || "");
  const [businessInputValue, setBusinessInputValue] = useState("");
  const [businessOptions, setBusinessOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const businessMapRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (initialBusinessId || initialReel?.businessId) return;
    async function loadBusinesses() {
      const { data } = await supabase.from("businesses").select("id, name, city").eq("status", true).order("name");
      const map = new Map<string, string>();
      const rows = (data || []) as Array<{ id: string; name: string; city: string | null }>;
      const opts = rows.map((b) => {
        const label = `${b.name} — ${b.city || "Sede Principal"}`;
        map.set(label, b.id);
        return label;
      });
      businessMapRef.current = map;
      setBusinessOptions(opts);
    }
    loadBusinesses();
  }, [initialBusinessId, initialReel?.businessId, supabase]);

  const handleFileSelect = (file: File) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleClearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleBusinessSelect = (label: string) => {
    setBusinessInputValue(label);
    const id = businessMapRef.current.get(label);
    if (id) setSelectedBusinessId(id);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      if (!selectedBusinessId) throw new Error("Debes seleccionar un restaurante.");
      if (!title.trim()) throw new Error("El título del video es obligatorio.");
      const cleanUrl = sanitizeInstagramUrl(instagramUrl);
      if (!thumbnailFile && !thumbnailPreview) throw new Error("La portada 9:16 es obligatoria.");

      let thumbUrl = thumbnailPreview || "";
      if (thumbnailFile) {
        thumbUrl = await storageService.uploadFile(thumbnailFile, "reels-thumbnails", { maxWidth: 720, quality: 0.85 });
        if (initialReel?.thumbnailUrl && initialReel.thumbnailUrl !== thumbUrl) {
          await storageService.deleteFileByUrl(initialReel.thumbnailUrl, "reels-thumbnails");
        }
      }

      let saved: BusinessReel;
      if (initialReel?.id) {
        const { data, error: uErr } = await supabase
          .from("business_reels")
          .update({ title: title.trim(), instagram_url: cleanUrl, thumbnail_url: thumbUrl, updated_at: new Date().toISOString() })
          .eq("id", initialReel.id)
          .select().single();
        if (uErr) throw uErr;
        saved = { ...initialReel, title: data.title, instagramUrl: data.instagram_url, thumbnailUrl: data.thumbnail_url, updatedAt: data.updated_at };
      } else {
        const { data, error: iErr } = await supabase
          .from("business_reels")
          .insert({ business_id: selectedBusinessId, title: title.trim(), instagram_url: cleanUrl, thumbnail_url: thumbUrl, is_active: true })
          .select().single();
        if (iErr) throw iErr;
        saved = { id: data.id, businessId: data.business_id, title: data.title, instagramUrl: data.instagram_url, thumbnailUrl: data.thumbnail_url, isActive: true, viewsCount: 0, clicksToMenuCount: 0, createdAt: data.created_at, updatedAt: data.updated_at };
      }
      onSuccess?.(saved);
      onClose?.();
    } catch (err: any) {
      setError(err.message || "Error al guardar el reel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { title, setTitle, instagramUrl, setInstagramUrl, thumbnailPreview, handleFileSelect, handleClearThumbnail, selectedBusinessId, businessInputValue, handleBusinessSelect, businessOptions, isSubmitting, error, handleSubmit };
}
