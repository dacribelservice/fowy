import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { getDistance } from "@/utils/geo";

// Singleton supabase client
const supabase = createClient();

export function useExplorerManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Refs to hold latest state values (avoids stale closures in callbacks)
  const categoriesRef = useRef<any[]>([]);
  const selectedCategoryIdRef = useRef<string | null>(null);
  const userLocationRef = useRef<[number, number] | null>(null);

  // Keep refs in sync with state
  useEffect(() => { categoriesRef.current = categories; }, [categories]);
  useEffect(() => { selectedCategoryIdRef.current = selectedCategoryId; }, [selectedCategoryId]);
  useEffect(() => { userLocationRef.current = userLocation; }, [userLocation]);

  // Initial Geolocation
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      if (data) setCategories(data);
    };
    fetchCats();
  }, []);

  // Fetch businesses
  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      
      const currentCategories = categoriesRef.current;
      const currentCategoryId = selectedCategoryIdRef.current;
      const currentLocation = userLocationRef.current;

      let query = supabase
        .from('businesses')
        .select('*, categories(name)')
        .eq('status', true);

      if (currentCategoryId && currentCategories.length > 0) {
        const selectedCategory = currentCategories.find((c: any) => c.id === currentCategoryId);
        if (selectedCategory) {
          query = query.contains('tags', [selectedCategory.name]);
        }
      }

      const { data: busData, error } = await query;
      if (error) throw error;
      
      let sortedBus = busData || [];
      
      if (currentLocation && sortedBus.length > 0) {
        sortedBus = [...sortedBus].sort((a, b) => {
          const latA = Number(a.latitude);
          const lonA = Number(a.longitude);
          const latB = Number(b.latitude);
          const lonB = Number(b.longitude);
          const distA = getDistance(currentLocation[0], currentLocation[1], latA, lonA);
          const distB = getDistance(currentLocation[0], currentLocation[1], latB, lonB);
          return distA - distB;
        });
      } else {
        sortedBus = sortedBus.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      setBusinesses(sortedBus);
    } catch (error) {
      console.error("Error fetching explorer data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRef = useRef(fetchBusinesses);
  useEffect(() => { fetchRef.current = fetchBusinesses; }, [fetchBusinesses]);

  // Sync effect
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses, selectedCategoryId, userLocation, categories]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('explorer-businesses-rt')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'businesses' },
        (payload) => {
          fetchRef.current();
          if (payload.new && (payload.new as any).id) {
            setSelectedBusiness((prev: any) => {
              if (prev && prev.id === (payload.new as any).id) {
                return { ...prev, ...(payload.new as any) };
              }
              return prev;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSelectCategory = (id: string | null) => {
    setSelectedCategoryId(id);
    setSelectedBusiness(null);
    setIsSheetOpen(!!id);
  };

  const handleCenterUser = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          if (error.code === 1) setIsLocationModalOpen(true);
          else console.warn("Error de ubicación:", error.message);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleSelectBusiness = (biz: any) => {
    setSelectedBusiness(biz);
    setIsSheetOpen(true);
  };

  return {
    categories,
    businesses,
    loading,
    selectedCategoryId,
    isSheetOpen,
    setIsSheetOpen,
    userLocation,
    selectedBusiness,
    setSelectedBusiness,
    isLocationModalOpen,
    setIsLocationModalOpen,
    handleSelectCategory,
    handleCenterUser,
    handleSelectBusiness
  };
}
