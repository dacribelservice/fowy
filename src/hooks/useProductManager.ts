"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface Product {
  id: string;
  business_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  in_stock: boolean;
  is_active: boolean;
  category_name: string;
  created_at?: string;
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
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
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
        .select()
        .single();

      if (addError) throw addError;
      setProducts(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      return data;
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const toggleStock = async (id: string, currentStock: boolean) => {
    return await updateProduct(id, { in_stock: !currentStock });
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
    refreshProducts: fetchProducts
  };
}
