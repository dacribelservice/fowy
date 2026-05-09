import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fowy.app'
  
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/explorar'],
      disallow: ['/admin/', '/business/', '/login', '/registro'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
