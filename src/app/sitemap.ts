import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fowy.pro'

  // Rutas estáticas de la aplicación
  const staticPaths = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explorar`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  try {
    const supabase = await createClient()
    
    // Obtener todos los negocios activos para generar sus sitemaps
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('slug, created_at')
      .eq('status', true)
      .range(0, 1000)

    if (error || !businesses) {
      console.error('Error cargando negocios para sitemap:', error)
      return staticPaths
    }

    const businessPaths = businesses.map((business) => ({
      url: `${baseUrl}/${business.slug}`,
      lastModified: business.created_at ? new Date(business.created_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPaths, ...businessPaths]
  } catch (error) {
    console.error('Error silencioso en generación de sitemap:', error)
    return staticPaths
  }
}
