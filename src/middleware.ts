import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

/**
 * Next.js 16 Proxy (formerly Middleware)
 * Reactivated to protect routes.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match only the routes that need auth check or session refresh.
     * This avoids touching images, static files, and other assets.
     */
    '/admin',
    '/admin/:path*',
    '/business',
    '/business/:path*',
    '/login',
    '/registro',
    '/auth/:path*',
  ],
}
