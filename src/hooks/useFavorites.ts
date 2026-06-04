"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function useFavorites() {
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  // Fetch current authenticated user and their favorites
  useEffect(() => {
    let active = true;

    const fetchFavorites = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("user_favorites")
          .select("product_id")
          .eq("user_id", userId);

        if (error) throw error;

        if (active) {
          const ids = data ? data.map((fav: any) => fav.product_id) : [];
          setFavoriteProductIds(ids);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (active) {
        setUser(user);
        if (user) {
          await fetchFavorites(user.id);
        } else {
          setFavoriteProductIds([]);
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      const newUser = session?.user ?? null;
      if (active) {
        setUser(newUser);
        if (newUser) {
          fetchFavorites(newUser.id);
        } else {
          setFavoriteProductIds([]);
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (productId: string) => {
    if (!user) {
      // Gate de Login: Redirect to login page with return URL
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    const isFav = favoriteProductIds.includes(productId);

    // Optimistic Update
    setFavoriteProductIds(prev =>
      isFav ? prev.filter(id => id !== productId) : [...prev, productId]
    );

    try {
      if (isFav) {
        // Delete from DB
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;
      } else {
        // Insert into DB
        const { error } = await supabase
          .from("user_favorites")
          .insert({
            user_id: user.id,
            product_id: productId
          });

        if (error) throw error;
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      // Revert optimistic update on failure
      setFavoriteProductIds(prev =>
        isFav ? [...prev, productId] : prev.filter(id => id !== productId)
      );
    }
  }, [user, favoriteProductIds, supabase, router]);

  const isProductFavorite = useCallback((productId: string) => {
    return favoriteProductIds.includes(productId);
  }, [favoriteProductIds]);

  return {
    favoriteProductIds,
    loading,
    toggleFavorite,
    isProductFavorite,
  };
}
