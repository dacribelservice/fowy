import { useState, useEffect, useRef } from "react";
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
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [productsLoading, setProductsLoading] = useState(true);
  const [votesCount, setVotesCount] = useState<number>(0);
  const initialLoadDone = useRef(false);

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
          setProducts(mappedInitialProducts);
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

  // Filtrado reactivo de productos del lado del servidor (Intacto)
  useEffect(() => {
    if (!business?.id) return;

    if (!initialLoadDone.current && selectedCategory === "all" && !debouncedSearchQuery) {
      initialLoadDone.current = true;
      return;
    }

    async function fetchFilteredProducts() {
      try {
        setProductsLoading(true);
        let query = supabase
          .from("products")
          .select("*, global_products(*)")
          .eq("business_id", business.id)
          .eq("is_active", true);

        // Filtro por categoría seleccionada
        if (selectedCategory !== "all") {
          const activeCat = categories.find((c) => c.id === selectedCategory);
          if (activeCat) {
            query = query.eq("category_name", activeCat.name);
          }
        }

        // Filtro por búsqueda de texto
        if (debouncedSearchQuery) {
          query = query.or(
            `name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%,global_products.name.ilike.%${debouncedSearchQuery}%,global_products.description.ilike.%${debouncedSearchQuery}%`
          );
        }

        // Ordenamiento consistente
        query = query.order("category_name", { ascending: true });

        const { data, error } = await query;
        if (error) {
          console.error("Error fetching filtered products:", error);
        } else {
          // Mapeamos is_offer a is_promo para que el frontend visualice la etiqueta de promoción correctamente y aplicamos fallback del catálogo global
          const mappedProducts = (data || []).map((p: any) => {
            const gp = p.global_products;
            return {
              ...p,
              name: p.name || gp?.name || "",
              description: p.description ?? gp?.description ?? null,
              image_url: p.image_url || gp?.image_url || "",
              is_promo: p.is_offer
            };
          });
          setProducts(mappedProducts);
        }
      } catch (err) {
        console.error("Error in fetchFilteredProducts:", err);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [business?.id, debouncedSearchQuery, selectedCategory, categories, supabase]);

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
