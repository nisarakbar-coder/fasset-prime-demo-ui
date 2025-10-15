import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for an investor-protected payment route
  if (pathname.startsWith('/payment/')) {
    // Check if user is authenticated by looking for the auth cookie/token
    // For now, we'll check if there's a user in localStorage (this is a simplified check)
    // In a real app, you would check for a valid session/token from cookies or headers
    
    // Since we can't access localStorage in middleware, we'll let the page handle the auth check
    // The investor layout will redirect to login if not authenticated
    // This allows the payment page to load and then redirect if needed
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
