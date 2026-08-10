import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { getDistance } from "@/utils/geo";
import { isBusinessOpen } from "@/utils/businessTime";
import { parseSafeDate } from "@/utils/bogotaTimeUtils";

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
  const [locationError, setLocationError] = useState<"permission_denied" | "position_unavailable" | "unsupported" | "timeout" | null>(null);
  const [centerTrigger, setCenterTrigger] = useState(0);

  // Nuevo estado para los límites del mapa
  const [mapBounds, setMapBounds] = useState<{ minLat: number, minLng: number, maxLat: number, maxLng: number } | null>(null);
  const [debouncedBounds, setDebouncedBounds] = useState(mapBounds);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBounds(mapBounds), 300);
    return () => clearTimeout(timer);
  }, [mapBounds]);

  // Refs to hold latest state values (avoids stale closures in callbacks)
  const categoriesRef = useRef<any[]>([]);
  const selectedCategoryIdRef = useRef<string | null>(null);
  const userLocationRef = useRef<[number, number] | null>(null);
  const debouncedBoundsRef = useRef(debouncedBounds);
  const selectedBusinessRef = useRef<any | null>(null);

  // Keep refs in sync with state
  useEffect(() => { categoriesRef.current = categories; }, [categories]);
  useEffect(() => { selectedCategoryIdRef.current = selectedCategoryId; }, [selectedCategoryId]);
  useEffect(() => { userLocationRef.current = userLocation; }, [userLocation]);
  useEffect(() => { debouncedBoundsRef.current = debouncedBounds; }, [debouncedBounds]);
  useEffect(() => { selectedBusinessRef.current = selectedBusiness; }, [selectedBusiness]);

  // Helper de verificación geográfica en límites del mapa (Casteo estricto a Number y validación NaN)
  const isInsideBounds = (biz: any, bounds: any) => {
    if (!bounds || biz.latitude == null || biz.longitude == null) return true;
    const lat = Number(biz.latitude);
    const lng = Number(biz.longitude);
    if (isNaN(lat) || isNaN(lng)) return false;
    return lat >= bounds.minLat && lat <= bounds.maxLat && lng >= bounds.minLng && lng <= bounds.maxLng;
  };

  // Initial Geolocation
  useEffect(() => {
    const isGeolocationAvailable = typeof window !== "undefined" && navigator && "geolocation" in navigator && !!navigator.geolocation;
    if (isGeolocationAvailable) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          localStorage.setItem("fowy_user_location", JSON.stringify([latitude, longitude]));
          setLocationError(null);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.warn("User denied geolocation permission.");
              setLocationError("permission_denied");
              break;
            case error.POSITION_UNAVAILABLE:
              console.warn("Location information is unavailable (iOS/Safari might block non-HTTPS connections or GPS is disabled).");
              setLocationError("position_unavailable");
              break;
            case error.TIMEOUT:
              console.warn("Geolocation request timed out.");
              setLocationError("timeout");
              break;
            default:
              console.warn("An unknown geolocation error occurred:", error.message);
              setLocationError("position_unavailable");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      console.warn("Geolocation is not supported or blocked by this browser.");
      setLocationError("unsupported");
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
      const bounds = debouncedBoundsRef.current;

      let selectedCategoryName = null;
      if (currentCategoryId && currentCategories.length > 0) {
        const selectedCategory = currentCategories.find((c: any) => c.id === currentCategoryId);
        if (selectedCategory) {
          selectedCategoryName = selectedCategory.name;
        }
      }

      const query = supabase
        .rpc('get_businesses_in_viewport', {
          p_min_lat: bounds?.minLat ?? null,
          p_min_lng: bounds?.minLng ?? null,
          p_max_lat: bounds?.maxLat ?? null,
          p_max_lng: bounds?.maxLng ?? null,
          p_category: selectedCategoryName,
          p_user_lat: currentLocation ? currentLocation[0] : null,
          p_user_lng: currentLocation ? currentLocation[1] : null,
          p_limit: 150
        })
        .select('id, name, slug, city, logo_url, latitude, longitude, rating, category_id, status, color_identity, schedules, tags, created_at, categories(name)');

      const { data: busData, error } = await query;
      if (error) throw error;

      // Mapear category_name en la carga inicial para garantizar renderizado en ExplorerMap.tsx
      const mappedBus = (busData || []).map((biz: any) => ({
        ...biz,
        category_name: biz.categories?.name || biz.category_name || "Comercio"
      }));

      // Filtrar los negocios para mostrar solo los que actualmente están activos y abiertos
      const openBusinesses = mappedBus.filter((biz: any) => biz.status === true && isBusinessOpen(biz.schedules));
      setBusinesses(openBusinesses);
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
  }, [fetchBusinesses, selectedCategoryId, userLocation, categories, debouncedBounds]);

  // Realtime
  useEffect(() => {
    const channelId = `explorer-businesses-rt-${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'businesses' },
        (payload: any) => {
          const selectedCatId = selectedCategoryIdRef.current;
          const currentCats = categoriesRef.current;

          // Helper para enriquecer objeto de negocio con categoría viva
          const enrichBusiness = (rawBiz: any, prevCategoriesObj?: any) => {
            const catName = currentCats.find((c: any) => c.id === rawBiz.category_id)?.name || prevCategoriesObj?.name || "Comercio";
            return {
              ...rawBiz,
              categories: { name: catName },
              category_name: catName
            };
          };

          if (payload.eventType === 'UPDATE') {
            const updatedBiz = payload.new;
            const isOpen = updatedBiz.status === true && isBusinessOpen(updatedBiz.schedules);
            const matchesCategory = !selectedCatId || updatedBiz.category_id === selectedCatId;

            setBusinesses(prev => {
              const existingBiz = prev.find(b => b.id === updatedBiz.id);
              const exists = !!existingBiz;

              if (!isOpen || !matchesCategory) {
                return prev.filter(b => b.id !== updatedBiz.id);
              }

              const enriched = enrichBusiness(updatedBiz, existingBiz?.categories);

              if (exists) {
                return prev.map(biz => biz.id === updatedBiz.id ? { ...biz, ...enriched } : biz);
              } else if (isInsideBounds(updatedBiz, debouncedBoundsRef.current)) {
                return [enriched, ...prev];
              }
              return prev;
            });

            // Desacoplamiento seguro de estados React en deselección/cierre
            const currentSelected = selectedBusinessRef.current;
            if (currentSelected && currentSelected.id === updatedBiz.id) {
              if (!isOpen || !matchesCategory) {
                setSelectedBusiness(null);
                setIsSheetOpen(false);
              } else {
                setSelectedBusiness((prev: any) => prev ? enrichBusiness(updatedBiz, prev.categories) : null);
              }
            }

          } else if (payload.eventType === 'INSERT') {
            const newBiz = payload.new;
            const isOpen = newBiz.status === true && isBusinessOpen(newBiz.schedules);
            const matchesCategory = !selectedCatId || newBiz.category_id === selectedCatId;

            if (isOpen && matchesCategory && isInsideBounds(newBiz, debouncedBoundsRef.current)) {
              const enrichedNew = enrichBusiness(newBiz);
              setBusinesses(prev => [enrichedNew, ...prev]);
            }

          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setBusinesses(prev => prev.filter(biz => biz.id !== deletedId));
              
              const currentSelected = selectedBusinessRef.current;
              if (currentSelected && currentSelected.id === deletedId) {
                setSelectedBusiness(null);
                setIsSheetOpen(false);
              }
            }
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
    const isGeolocationAvailable = typeof window !== "undefined" && navigator && "geolocation" in navigator && !!navigator.geolocation;
    if (isGeolocationAvailable) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLocationError(null);
          setCenterTrigger((prev) => prev + 1);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setIsLocationModalOpen(true);
              setLocationError("permission_denied");
              break;
            case error.POSITION_UNAVAILABLE:
              console.warn("Ubicación no disponible en este dispositivo/red (iOS/Safari podría requerir HTTPS).");
              setLocationError("position_unavailable");
              break;
            case error.TIMEOUT:
              console.warn("La solicitud de geolocalización expiró.");
              setLocationError("timeout");
              break;
            default:
              console.warn("Error de ubicación:", error.message);
              setLocationError("position_unavailable");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      console.warn("Geolocation no está disponible en este navegador.");
      setLocationError("unsupported");
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
    locationError,
    setLocationError,
    centerTrigger,
    handleSelectCategory,
    handleCenterUser,
    handleSelectBusiness,
    setMapBounds
  };
}
