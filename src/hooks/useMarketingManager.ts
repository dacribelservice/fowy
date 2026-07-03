"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { storageService } from "@/services/storageService";

export interface MarketingBanner {
  id: string;
  image_url: string;
  title: string | null;
  link_url: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  target_city?: string | null;
  target_business_id?: string | null;
  destination_business_id?: string | null;
}

export interface MarketingCTA {
  id: string;
  text: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export function useMarketingManager() {
  const [banners, setBanners] = useState<MarketingBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ctas, setCtas] = useState<MarketingCTA[]>([]);
  const [ctasLoading, setCtasLoading] = useState(false);
  const [ctasError, setCtasError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("marketing_banners")
        .select("*")
        .order("sort_order", { ascending: true });

      if (fetchError) throw fetchError;
      setBanners(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido al obtener banners";
      setError(errorMsg);
      console.error("Error fetching marketing banners:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const addBanner = async (
    file: File, 
    title: string, 
    linkUrl: string,
    targetCity?: string | null,
    targetBusinessId?: string | null,
    destinationBusinessId?: string | null
  ) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Sube el archivo comprimido usando storageService
      const imageUrl = await storageService.uploadFile(file, "marketing", {
        shouldCompress: true,
        maxWidth: 1200, // Los banners horizontales se benefician de una resolución mayor como 1200px
        quality: 0.8,
      });

      // 2. Calcula el siguiente sort_order
      const nextOrder = banners.length > 0 
        ? Math.max(...banners.map(b => b.sort_order)) + 1 
        : 0;

      // 3. Inserta el registro en la base de datos
      const { data, error: insertError } = await supabase
        .from("marketing_banners")
        .insert([{
          image_url: imageUrl,
          title: title || null,
          link_url: linkUrl || "/explorar",
          is_active: true,
          sort_order: nextOrder,
          target_city: targetCity || null,
          target_business_id: targetBusinessId || null,
          destination_business_id: destinationBusinessId || null
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      setBanners(prev => [...prev, data]);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al agregar banner";
      setError(errorMsg);
      console.error("Error adding banner:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBanner = async (id: string, updates: Partial<MarketingBanner>) => {
    setError(null);
    // Clonar estado actual para posible rollback
    const previousBanners = [...banners];

    // Actualización optimista instantánea
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

    try {
      const { data, error: updateError } = await supabase
        .from("marketing_banners")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Sincronizar el estado final real con lo retornado de la DB
      setBanners(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
      return data;
    } catch (err) {
      // Revertir en caso de error
      setBanners(previousBanners);
      const errorMsg = err instanceof Error ? err.message : "Error al actualizar banner";
      setError(errorMsg);
      console.error("Error updating banner:", err);
      return null;
    }
  };

  const deleteBanner = async (id: string, imageUrl: string) => {
    setError(null);
    // Guardar copia del estado para rollback
    const previousBanners = [...banners];

    // Actualización optimista instantánea (desaparece inmediatamente)
    setBanners(prev => prev.filter(b => b.id !== id));

    try {
      // 1. Elimina de la base de datos primero para que no sea visible públicamente
      const { error: deleteError } = await supabase
        .from("marketing_banners")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // 2. Elimina el archivo de storage de forma asíncrona y segura
      try {
        await storageService.deleteFileByUrl(imageUrl, "marketing");
      } catch (storageErr) {
        console.warn("No se pudo eliminar el archivo físico del storage (posiblemente ya no exista):", storageErr);
      }

      return true;
    } catch (err) {
      // Revertir en caso de error
      setBanners(previousBanners);
      const errorMsg = err instanceof Error ? err.message : "Error al eliminar banner";
      setError(errorMsg);
      console.error("Error deleting banner:", err);
      return false;
    }
  };

  const reorderBanners = async (newBanners: MarketingBanner[]) => {
    // Optimismo al actualizar el estado local
    setBanners(newBanners);
    setError(null);

    try {
      const updates = newBanners.map((banner, index) => ({
        id: banner.id,
        image_url: banner.image_url,
        title: banner.title,
        link_url: banner.link_url,
        is_active: banner.is_active,
        sort_order: index,
        created_at: banner.created_at,
        target_city: banner.target_city || null,
        target_business_id: banner.target_business_id || null,
        destination_business_id: banner.destination_business_id || null
      }));

      const { error: upsertError } = await supabase
        .from("marketing_banners")
        .upsert(updates);

      if (upsertError) throw upsertError;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al guardar el reordenamiento";
      setError(errorMsg);
      console.error("Error reordering banners:", err);
      fetchBanners(); // Rollback en caso de error
    }
  };

  // ==========================================
  // LÓGICA DE FRASES DINÁMICAS (MARKETING CTAs)
  // ==========================================

  const fetchCTAs = useCallback(async () => {
    setCtasLoading(true);
    setCtasError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("marketing_ctas")
        .select("*")
        .order("sort_order", { ascending: true });

      if (fetchError) throw fetchError;
      setCtas(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido al obtener frases publicitarias";
      setCtasError(errorMsg);
      console.error("Error fetching marketing CTAs:", err);
    } finally {
      setCtasLoading(false);
    }
  }, [supabase]);

  const addCTA = async (text: string) => {
    setCtasLoading(true);
    setCtasError(null);
    try {
      const nextOrder = ctas.length > 0 
        ? Math.max(...ctas.map(c => c.sort_order)) + 1 
        : 0;

      const { data, error: insertError } = await supabase
        .from("marketing_ctas")
        .insert([{
          text: text,
          is_active: true,
          sort_order: nextOrder
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      setCtas(prev => [...prev, data]);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al agregar frase publicitaria";
      setCtasError(errorMsg);
      console.error("Error adding marketing CTA:", err);
      return null;
    } finally {
      setCtasLoading(false);
    }
  };

  const updateCTA = async (id: string, updates: Partial<MarketingCTA>) => {
    setCtasError(null);
    const previousCtas = [...ctas];

    // Actualización optimista local
    setCtas(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

    try {
      const { data, error: updateError } = await supabase
        .from("marketing_ctas")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      setCtas(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      return data;
    } catch (err) {
      setCtas(previousCtas);
      const errorMsg = err instanceof Error ? err.message : "Error al actualizar frase publicitaria";
      setCtasError(errorMsg);
      console.error("Error updating marketing CTA:", err);
      return null;
    }
  };

  const deleteCTA = async (id: string) => {
    setCtasError(null);
    const previousCtas = [...ctas];

    // Actualización optimista local (eliminación inmediata)
    setCtas(prev => prev.filter(c => c.id !== id));

    try {
      const { error: deleteError } = await supabase
        .from("marketing_ctas")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      setCtas(previousCtas);
      const errorMsg = err instanceof Error ? err.message : "Error al eliminar frase publicitaria";
      setCtasError(errorMsg);
      console.error("Error deleting marketing CTA:", err);
      return false;
    }
  };

  const reorderCTAs = async (newCtas: MarketingCTA[]) => {
    setCtas(newCtas);
    setCtasError(null);

    try {
      const updates = newCtas.map((cta, index) => ({
        id: cta.id,
        text: cta.text,
        is_active: cta.is_active,
        sort_order: index,
        created_at: cta.created_at
      }));

      const { error: upsertError } = await supabase
        .from("marketing_ctas")
        .upsert(updates);

      if (upsertError) throw upsertError;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al guardar el reordenamiento de frases";
      setCtasError(errorMsg);
      console.error("Error reordering CTAs:", err);
      fetchCTAs(); // Rollback en caso de error
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchCTAs();
  }, [fetchBanners, fetchCTAs]);

  return {
    banners,
    loading,
    error,
    addBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
    refreshBanners: fetchBanners,

    // Exponer lógica de frases dinámicas
    ctas,
    ctasLoading,
    ctasError,
    addCTA,
    updateCTA,
    deleteCTA,
    reorderCTAs,
    refreshCTAs: fetchCTAs
  };
}
