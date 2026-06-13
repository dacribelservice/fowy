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

  // Keep refs in sync with state
  useEffect(() => { categoriesRef.current = categories; }, [categories]);
  useEffect(() => { selectedCategoryIdRef.current = selectedCategoryId; }, [selectedCategoryId]);
  useEffect(() => { userLocationRef.current = userLocation; }, [userLocation]);
  useEffect(() => { debouncedBoundsRef.current = debouncedBounds; }, [debouncedBounds]);

  // Initial Geolocation
  useEffect(() => {
    const isGeolocationAvailable = typeof window !== "undefined" && navigator && "geolocation" in navigator && !!navigator.geolocation;
    if (isGeolocationAvailable) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
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
          p_limit: 250
        })
        .select('*, categories(name)');

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
        sortedBus = [...sortedBus].sort((a, b) => {
          const dateB = parseSafeDate(b.created_at).getTime();
          const dateA = parseSafeDate(a.created_at).getTime();
          return dateB - dateA;
        });
      }

      // Filtrar los negocios para mostrar solo los que actualmente están activos y abiertos
      const openBusinesses = sortedBus.filter((biz: any) => biz.status === true && isBusinessOpen(biz.schedules));
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
          fetchRef.current();
          if (payload.new && (payload.new as { id?: string }).id) {
            const newBiz = payload.new as any;
            const isOpen = newBiz.status === true && isBusinessOpen(newBiz.schedules);
            
            setSelectedBusiness((prev: any) => {
              if (prev && prev.id === newBiz.id) {
                if (!isOpen) {
                  setIsSheetOpen(false);
                  return null;
                }
                return { ...prev, ...newBiz };
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
