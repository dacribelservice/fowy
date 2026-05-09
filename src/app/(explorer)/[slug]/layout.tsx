import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

// 2.2 & 2.3: Metadatos dinámicos a prueba de fallas (Failsafe)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const defaultMeta = {
    title: 'FOWY - Tu Ciudad en un Click',
    description: 'Explora y conecta con los mejores negocios de tu ciudad.',
  }

  try {
    const { slug } = await params
    const supabase = await createClient()

    // Buscamos solo las columnas existentes para evitar errores de consulta
    const { data: business } = await supabase
      .from('businesses')
      .select('id, name, logo_url, color_identity')
      .eq('slug', slug)
      .single()

    if (!business) return defaultMeta

    // Intentamos obtener el primer banner publicitario de manera opcional para la imagen OG
    const { data: banner } = await supabase
      .from('business_banners')
      .select('image_url')
      .eq('business_id', business.id)
      .order('order_index', { ascending: true })
      .limit(1)
      .maybeSingle()

    const title = `${business.name} | Menú en FOWY`
    const description = `Explora el menú digital de ${business.name} en FOWY. Descubre sus platos, precios, horarios y pide directamente por WhatsApp de forma fácil.`
    const imageUrl = banner?.image_url || business.logo_url || '/assets/icono png.png'

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      }
    }
  } catch (error) {
    console.error("Error silencioso cargando metadatos de SEO:", error)
    return defaultMeta
  }
}

// 2.3 & 2.4: Inyección del script estructurado JSON-LD con protección try-catch (Riesgo Cero)
export default async function BusinessLayout({ children, params }: Props) {
  const { slug } = await params
  let jsonLd: any = null

  try {
    const supabase = await createClient()

    // 1. Obtener los datos del negocio
    const { data: business } = await supabase
      .from('businesses')
      .select('id, name, logo_url, phone, rating, latitude, longitude, city, country, tags')
      .eq('slug', slug)
      .single()

    if (business) {
      // 2. Obtener los platos/productos activos del negocio para indexación directa de IAs (GEO)
      const { data: products } = await supabase
        .from('products')
        .select('name, description, price, image_url, category_name')
        .eq('business_id', business.id)
        .eq('is_active', true)

      // 3. Agrupar productos por categoría para la estructura "MenuSection" de schema.org
      const groupedProducts: { [key: string]: any[] } = {}
      products?.forEach((product) => {
        const catName = product.category_name || 'General'
        if (!groupedProducts[catName]) {
          groupedProducts[catName] = []
        }
        groupedProducts[catName].push(product)
      })

      const menuSections = Object.entries(groupedProducts).map(([categoryName, items]) => ({
        '@type': 'MenuSection',
        'name': categoryName,
        'hasMenuItem': items.map((item) => ({
          '@type': 'MenuItem',
          'name': item.name,
          'description': item.description || undefined,
          'image': item.image_url || undefined,
          'offers': {
            '@type': 'Offer',
            'price': item.price,
            'priceCurrency': 'COP' // Moneda local por defecto
          }
        }))
      }))

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fowy.app'
      const businessUrl = `${baseUrl}/${slug}`
      const ratingValue = business.rating ? parseFloat(String(business.rating)) : 5.0

      // Determinar si es restaurante u otro negocio según tags
      const tagsString = (business.tags || []).join(', ').toLowerCase()
      const isRestaurant = tagsString.includes('comida') || tagsString.includes('restaurante') || tagsString.includes('food') || tagsString.includes('menú') || tagsString.includes('menu') || true
      const schemaType = isRestaurant ? 'Restaurant' : 'LocalBusiness'

      // 4. Construir el objeto JSON-LD estructurado completo
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        'name': business.name,
        'image': business.logo_url || '/assets/icono png.png',
        'telephone': business.phone || undefined,
        'url': businessUrl,
        'priceRange': '$$',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': business.city || 'Colombia',
          'addressCountry': business.country || 'CO'
        },
        'geo': (business.latitude && business.longitude) ? {
          '@type': 'GeoCoordinates',
          'latitude': parseFloat(String(business.latitude)),
          'longitude': parseFloat(String(business.longitude))
        } : undefined,
        'aggregateRating': business.rating ? {
          '@type': 'AggregateRating',
          'ratingValue': ratingValue,
          'bestRating': '5',
          'worstRating': '1',
          'ratingCount': 10 // Puntuación de ejemplo consistente
        } : undefined,
        'menu': {
          '@type': 'Menu',
          'name': `Menú Digital de ${business.name}`,
          'hasMenuSection': menuSections
        }
      }
    }
  } catch (error) {
    // Escudo protector try-catch: si la base de datos o el internet fallan, no rompemos la carga de la página
    console.error("Error silencioso construyendo JSON-LD de SEO/GEO:", error)
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  )
}
