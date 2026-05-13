"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface Product {
  id: string;
  business_id: string;
  global_product_id?: string | null;
  name: string;
  description: string;
  price: number;
  image_url: string;
  in_stock: boolean;
  is_active: boolean;
  is_new: boolean;
  is_offer: boolean;
  is_recommended: boolean;
  category_name: string;
  created_at?: string;
  global_products?: any;
}

export function useProductManager(businessId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    if (!businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*, global_products(*)')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Mapeamos los productos aplicando el fallback del catálogo global
      const mappedData = (data || []).map((p: any) => {
        const gp = p.global_products;
        return {
          ...p,
          name: p.name || gp?.name || "",
          description: p.description ?? gp?.description ?? "",
          image_url: p.image_url || gp?.image_url || ""
        };
      });

      setProducts(mappedData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [businessId, supabase]);

  const addProduct = async (product: Omit<Product, 'id' | 'business_id' | 'created_at'>) => {
    if (!businessId) return null;
    
    try {
      const { data, error: addError } = await supabase
        .from('products')
        .insert([{ ...product, business_id: businessId }])
        .select('*, global_products(*)')
        .single();

      if (addError) throw addError;

      // Aplicar fallback para el registro insertado para mantener la consistencia en el estado local del frontend
      const gp = data.global_products;
      const mappedData = {
        ...data,
        name: data.name || gp?.name || "",
        description: data.description ?? gp?.description ?? "",
        image_url: data.image_url || gp?.image_url || ""
      };

      setProducts(prev => [mappedData, ...prev]);
      return mappedData;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select('*, global_products(*)')
        .single();

      if (updateError) throw updateError;

      // Aplicar fallback para el registro actualizado
      const gp = data.global_products;
      const mappedData = {
        ...data,
        name: data.name || gp?.name || "",
        description: data.description ?? gp?.description ?? "",
        image_url: data.image_url || gp?.image_url || ""
      };

      setProducts(prev => prev.map(p => p.id === id ? mappedData : p));
      return mappedData;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      return false;
    }
  };

  const toggleStock = async (id: string, currentStock: boolean) => {
    return await updateProduct(id, { in_stock: !currentStock });
  };

  const toggleOffer = async (id: string, currentOffer: boolean) => {
    return await updateProduct(id, { is_offer: !currentOffer });
  };

  useEffect(() => {
    if (businessId) {
      fetchProducts();
    }
  }, [businessId, fetchProducts]);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    toggleOffer,
    refreshProducts: fetchProducts
  };
}
