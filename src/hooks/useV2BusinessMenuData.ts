import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * Hook V2 personalizado para manejar el estado y la obtención de datos
 * del menú utilizando el RPC consolidado (Ley del Remolque).
 * 
 * @param slug Identificador del negocio
 */
export function useV2BusinessMenuData(slug: string | string[] | undefined) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Database States
  const [business, setBusiness] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [productsLoading, setProductsLoading] = useState(true);
  const [votesCount, setVotesCount] = useState<number>(0);

  const supabase = createClient();

  // Debounce de búsqueda para optimizar peticiones al servidor
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Carga inicial Consolidada V2 (Un solo viaje a Base de Datos)
  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      try {
        setLoading(true);

        const activeSlug = Array.isArray(slug) ? slug[0] : slug;

        // Llamada única al RPC consolidado
        const { data, error } = await supabase.rpc("get_business_menu_payload", {
          p_slug: activeSlug,
        });

        if (error || !data || !data.business) {
          console.error("Error fetching consolidated payload:", error);
          setBusiness(null);
          return;
        }

        setBusiness(data.business);
        setCategories(data.categories || []);
        setBanners(data.banners || []);
        setVotesCount(data.votes_count || 0);

        if (data.products) {
          const mappedInitialProducts = data.products.map((p: any) => {
            const gp = p.global_products;
            return {
              ...p,
              name: p.name || gp?.name || "",
              description: p.description ?? gp?.description ?? null,
              image_url: p.image_url || gp?.image_url || "",
              is_promo: p.is_offer
            };
          });
          setAllProducts(mappedInitialProducts);
          setProductsLoading(false);
        }

      } catch (error) {
        console.error("Error fetching data in V2 Production Menu:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, supabase]);

  // Filtrado reactivo de productos del lado del cliente
  const products = useMemo(() => {
    return allProducts.filter((product) => {
      // 1. Filtro por categoría seleccionada
      if (selectedCategory !== "all") {
        const activeCat = categories.find((c) => c.id === selectedCategory);
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
