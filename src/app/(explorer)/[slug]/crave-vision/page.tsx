"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

/**
 * CraveVisionRedirect: Redirección elegante y automática para liberar la caché de Turbopack
 * y guiar a cualquier usuario activo de vuelta al menú premium unificado de producción.
 */
export default function CraveVisionRedirect() {
  const router = useRouter();
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      router.replace(`/${slug}`);
    }
  }, [slug, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ededed]">
      <div className="text-center p-8 space-y-4">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
          Redirigiendo al Menú Premium...
        </p>
      </div>
    </div>
  );
}
