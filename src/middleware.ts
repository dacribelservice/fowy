import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- LÓGICA DE SUBDOMINIOS (MOTOR DE TENANTS) ---
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Definir dominios base para ignorar (Plataforma Central)
  const mainDomains = ['fowy.co', 'localhost:3000', 'www.fowy.co']
  const isMainDomain = mainDomains.includes(hostname)

  // Extraer el subdominio (ej: 'pizzeria' de 'pizzeria.fowy.co')
  const currentHost = hostname
    .replace(`.localhost:3000`, '')
    .replace(`.fowy.co`, '')
    .replace('www.', '')

  // Si no es el dominio principal, reescribimos la ruta internamente hacia /[domain]
  if (!isMainDomain && currentHost.length > 0) {
    console.log(`[Middleware] Mapeando subdominio: ${currentHost} -> /${currentHost}${url.pathname}`)
    return NextResponse.rewrite(
      new URL(`/${currentHost}${url.pathname}${url.search}`, request.url)
    )
  }

  // Protección de rutas administrativas (Solo en dominio principal o admin)
  if (url.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
