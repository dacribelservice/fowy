import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * Hook personalizado para manejar todo el estado y la obtención de datos 
 * en tiempo real del menú de negocios en Crave Vision.
 * 
 * @param slug Identificador del negocio
 */
export function useBusinessMenuData(slug: string | string[] | undefined) {
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

  const supabase = createClient();

  // Debounce de búsqueda para optimizar peticiones al servidor
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Carga inicial del Negocio, Categorías y Banners
  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      try {
        setLoading(true);

        const activeSlug = Array.isArray(slug) ? slug[0] : slug;

        // Obtener datos del negocio
        const { data: busData, error: busError } = await supabase
          .from("businesses")
          .select("*")
          .eq("slug", activeSlug)
          .single();

        if (busError || !busData) {
          console.error("Business not found in Production Menu:", busError);
          setBusiness(null);
          return;
        }
        setBusiness(busData);

        // Obtener categorías del menú
        const { data: catData } = await supabase
          .from("product_menu_categories")
          .select("*")
          .eq("business_id", busData.id)
          .order("order_index", { ascending: true });

        setCategories(catData || []);

        // Obtener banners publicitarios
        const { data: bannersData } = await supabase
          .from("business_banners")
          .select("*")
          .eq("business_id", busData.id)
          .order("order_index", { ascending: true });

        setBanners(bannersData || []);
      } catch (error) {
        console.error("Error fetching data in Production Menu:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, supabase]);

  // Filtrado reactivo de productos del lado del servidor (Supabase)
  useEffect(() => {
    if (!business?.id) return;

    async function fetchFilteredProducts() {
      try {
        setProductsLoading(true);
        let query = supabase
          .from("products")
          .select("*")
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
            `name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`
          );
        }

        // Ordenamiento consistente
        query = query.order("category_name", { ascending: true });

        const { data, error } = await query;
        if (error) {
          console.error("Error fetching filtered products:", error);
        } else {
          setProducts(data || []);
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
  };
}
