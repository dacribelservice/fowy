"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface MenuCategory {
  id: string;
  business_id: string;
  name: string;
  order_index: number;
  created_at?: string;
}

export function useCategoryManager(businessId: string | null) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    if (!businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('product_menu_categories')
        .select('*')
        .eq('business_id', businessId)
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, [businessId, supabase]);

  const addCategory = async (name: string) => {
    if (!businessId) return null;
    
    try {
      const nextOrder = categories.length > 0 
        ? Math.max(...categories.map(c => c.order_index)) + 1 
        : 0;

      const { data, error: addError } = await supabase
        .from('product_menu_categories')
        .insert([{ 
          name, 
          business_id: businessId,
          order_index: nextOrder
        }])
        .select()
        .single();

      if (addError) throw addError;
      setCategories(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateCategory = async (id: string, updates: Partial<MenuCategory>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('product_menu_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('product_menu_categories')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setCategories(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const reorderCategories = async (newOrder: MenuCategory[]) => {
    // Optimistic update
    setCategories(newOrder);
    
    try {
      const updates = newOrder.map((cat, index) => ({
        id: cat.id,
        business_id: businessId,
        name: cat.name,
        order_index: index
      }));

      const { error: upsertError } = await supabase
        .from('product_menu_categories')
        .upsert(updates);

      if (upsertError) throw upsertError;
    } catch (err: any) {
      setError(err.message);
      fetchCategories(); // Rollback
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchCategories();
    }
  }, [businessId, fetchCategories]);

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    refreshCategories: fetchCategories
  };
}
