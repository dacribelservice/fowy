import { createBrowserClient } from '@supabase/ssr'
import { safeLocalStorage } from '@/utils/storage'

let supabaseClientInstance: any = null;

export function createClient() {
  // En SSR (Server-Side Rendering), siempre retornamos una nueva instancia 
  // para evitar fugas de estado entre diferentes peticiones de usuarios.
  if (typeof window === 'undefined') {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storage: safeLocalStorage,
        },
      }
    )
  }

  // En el navegador, creamos la instancia una sola vez y la reutilizamos (Singleton)
  if (!supabaseClientInstance) {
    supabaseClientInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storage: safeLocalStorage,
        },
      }
    )
  }

  return supabaseClientInstance;
}
