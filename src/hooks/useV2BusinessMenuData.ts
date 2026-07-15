import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr"; // Paso 1.1: Importar SWR

/**
 * Hook V2 personalizado para manejar el estado y la obtención de datos
 * del menú utilizando el RPC consolidado (Ley del Remolque).
 * 
 * @param slug Identificador del negocio
 * @param initialData Datos pre-renderizados opcionales del servidor (Paso 1.2)
 */
export function useV2BusinessMenuData(
  slug: string | string[] | undefined,
  initialData?: any // Paso 1.2: Parámetro de datos iniciales
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const supabase = createClient();
  const activeSlug = Array.isArray(slug) ? slug[0] : slug; // Paso 1.2: Sanitizar el slug

  // Fetcher consolidado para SWR (Paso 1.2)
  const fetcher = async () => {
    if (!activeSlug) return null;
    const { data, error } = await supabase.rpc("get_business_menu_payload", {
      p_slug: activeSlug,
    });
    if (error) throw new Error(error.message);
    if (!data || !data.business) throw new Error("Business not found");
    return data;
  };

  // Canalización de Caché con SWR (Paso 1.2)
  const { data: swrData, error: swrError, isLoading: swrIsLoading } = useSWR(
    activeSlug ? `menu-${activeSlug}` : null,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Debounce de búsqueda para optimizar peticiones al servidor
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Derivación directa de datos desde SWR (Paso 1.3)
  const business = swrData?.business ?? null;
  const categories = swrData?.categories ?? [];
  const banners = swrData?.banners ?? [];
  const votesCount = swrData?.votes_count ?? 0;

  // Mapeo unificado de productos con fallbacks en useMemo (Paso 1.4)
  const allProducts = useMemo(() => {
    const rawProducts = swrData?.products ?? [];
    return rawProducts.map((p: any) => {
      const gp = p.global_products;
      return {
        ...p,
        name: p.name || gp?.name || "",
        description: p.description ?? gp?.description ?? null,
        image_url: p.image_url || gp?.image_url || "",
        is_promo: p.is_offer
      };
    });
  }, [swrData?.products]);

  // Estados de carga calculados a partir de SWR (Paso 1.3)
  const loading = swrIsLoading && !swrData && !swrError;
  const productsLoading = loading;

  if (swrError) {
    console.error("Error loading menu via SWR:", swrError);
  }

  // Filtrado reactivo de productos del lado del cliente
  const products = useMemo(() => {
    return allProducts.filter((product: any) => {
      // 1. Filtro por categoría seleccionada
      if (selectedCategory !== "all") {
        const activeCat = categories.find((c: any) => c.id === selectedCategory);
        if (activeCat && product.category_name !== activeCat.name) {
          return false;
        }
      }

      // 2. Filtro por búsqueda de texto (busca en nombre y descripción, incluyendo fallbacks globales)
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const nameMatch = (product.name || "").toLowerCase().includes(query);
        const descMatch = (product.description || "").toLowerCase().includes(query);
        return nameMatch || descMatch;
      }

      return true;
    });
  }, [allProducts, selectedCategory, debouncedSearchQuery, categories]);

  return {
    business,
    categories,
    products,
    banners,
    loading,
    productsLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    debouncedSearchQuery,
    votesCount,
  };
}
