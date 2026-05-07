import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * Hook para registrar de forma pasiva e indolora las visitas de clientes 
 * en la base de datos de analíticas.
 * 
 * @param businessId ID único del negocio
 */
export function useBusinessAnalytics(businessId: string | undefined) {
  useEffect(() => {
    if (!businessId) return;

    const supabase = createClient();

    async function recordVisit() {
      try {
        await supabase.from("analytics_visits").insert({
          business_id: businessId,
          path: window.location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || "direct"
        });
      } catch (e) {
        console.error("Error recording visit in useBusinessAnalytics:", e);
      }
    }

    recordVisit();
  }, [businessId]);
}
