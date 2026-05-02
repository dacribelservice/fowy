import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Business } from "@/components/admin/businesses/BusinessList";
import { useBusinessStats } from "@/hooks/useBusinessStats";
import { storageService } from "@/services/storageService";

const supabase = createClient();

interface ManagerOptions {
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  filterPlan: string;
  filterStatus: string;
}

export function useAdminBusinessManager(options: ManagerOptions) {
  const [categories, setCategories] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  const { globalStats, refreshStats } = useBusinessStats();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{ id: string, name: string, type: 'category' | 'business', imageUrl?: string } | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  // Refs for stable fetch - prevent stale closures in fetchData
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { currentPage, pageSize, searchTerm, filterPlan, filterStatus } = optionsRef.current;
      
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      setCategories(catData || []);

      let query = supabase
        .from('businesses')
        .select('*', { count: 'exact' });

      // Search Filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
      }

      // Plan Filter
      if (filterPlan !== "all") {
        query = query.eq('plan', filterPlan);
      }

      // Status Filter
      if (filterStatus !== "all") {
        query = query.eq('status', filterStatus === "active");
      }

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data: busData, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setBusinesses((busData as any) || []);
      setTotalCount(count || 0);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Stable fetch function

  // Initial fetch and fetch on option changes (throttled by page.tsx states)
  useEffect(() => {
    fetchData();
  }, [fetchData, options.currentPage, options.pageSize, options.searchTerm, options.filterPlan, options.filterStatus]);

  const handleDeleteCategory = useCallback((id: string) => {
    const cat = categories.find(c => c.id === id);
    setDeleteConfig({ id, name: cat?.name || 'esta categoría', type: 'category', imageUrl: cat?.image_url });
    setIsDeleteModalOpen(true);
  }, [categories]);

  const handleDeleteBusiness = useCallback((business: Business) => {
    setDeleteConfig({ id: business.id, name: business.name, type: 'business', imageUrl: business.logo_url });
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (!deleteConfig) return;
    
    try {
      // 1. Storage Cleanup
      if (deleteConfig.imageUrl) {
        try {
          const bucket = deleteConfig.type === 'category' ? 'categories' : 'logos';
          const fileName = deleteConfig.imageUrl.split('/').pop();
          if (fileName) {
            await supabase.storage.from(bucket).remove([fileName]);
          }
        } catch (storageErr) {
          console.error("Error cleaning up storage:", storageErr);
        }
      }

      // 2. Database Deletion
      const table = deleteConfig.type === 'category' ? 'categories' : 'businesses';
      const { error, count } = await supabase
        .from(table)
        .delete({ count: 'exact' })
        .eq('id', deleteConfig.id);
      
      if (error) throw error;
      
      if (count === 0) {
        setToast({ show: true, message: "⚠️ No se pudo eliminar: Permisos insuficientes." });
        return;
      }

      setToast({ show: true, message: "✅ Eliminado correctamente" });
      fetchData();
      refreshStats();
    } catch (error: any) {
      console.error(`Error deleting ${deleteConfig.type}:`, error);
      setToast({ show: true, message: `❌ Error: ${error.message || "Error desconocido"}` });
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteConfig(null);
    }
  };

  // Logic for approvals/rejections (skeleton as requested in checklist)
  const updateBusinessStatus = async (businessId: string, status: boolean) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ status })
        .eq('id', businessId);

      if (error) throw error;
      
      setToast({ show: true, message: `✅ Negocio ${status ? 'activado' : 'desactivado'} correctamente` });
      fetchData();
      refreshStats();
    } catch (error: any) {
      setToast({ show: true, message: `❌ Error al actualizar estatus: ${error.message}` });
    }
  };

  const createBusiness = async (data: {
    name: string;
    slug: string;
    city: string;
    country: string;
    phone: string;
    plan: string;
    ownerEmail: string;
    logo: File;
  }) => {
    try {
      // 1. Resolve Owner ID from Email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', data.ownerEmail.trim().toLowerCase())
        .single();

      if (profileError || !profile) {
        throw new Error("No se encontró ningún usuario con ese correo electrónico. El socio debe registrarse primero.");
      }

      // 2. Upload Logo
      const publicUrl = await storageService.uploadFile(data.logo, 'logos', {
        maxWidth: 800,
        quality: 0.7
      });

      // 3. Insert Business
      const { error: dbError } = await supabase
        .from('businesses')
        .insert([{
          name: data.name,
          slug: data.slug,
          logo_url: publicUrl,
          city: data.city,
          country: data.country,
          plan: data.plan,
          phone: data.phone,
          status: true,
          owner_id: profile.id,
          payment_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
          modules: {
            standard: true,
            pro: data.plan === "pro" || data.plan === "premium",
            premium: data.plan === "premium"
          }
        }]);

      if (dbError) throw dbError;

      setToast({ show: true, message: "✅ Negocio creado correctamente" });
      fetchData();
      refreshStats();
      return { success: true };
    } catch (error: any) {
      console.error("Error creating business:", error);
      setToast({ show: true, message: `❌ Error: ${error.message}` });
      return { success: false, error: error.message };
    }
  };

  return {
    categories,
    businesses,
    loading,
    totalCount,
    globalStats,
    fetchData,
    refreshStats,
    handleDeleteCategory,
    handleDeleteBusiness,
    confirmDelete,
    updateBusinessStatus,
    createBusiness,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteConfig,
    toast,
    setToast,
    supabase // Exported for modals that need it
  };
}
