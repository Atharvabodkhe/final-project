import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is for the admin area (excluding the login page)
  const isAdminPath = path.startsWith('/admin') && !path.startsWith('/admin/login')
  
  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has('admin-auth')
  
  console.log(`Middleware: Path=${path}, isAdminPath=${isAdminPath}, isAuthenticated=${isAuthenticated}`)

  // If trying to access admin pages without authentication, redirect to login
  if (isAdminPath && !isAuthenticated) {
    console.log('Redirecting to login page due to no authentication')
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If already authenticated and trying to access login page, redirect to admin dashboard
  if (path === '/admin/login' && isAuthenticated) {
    console.log('Redirecting authenticated user from login to dashboard')
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // For the root admin path with authentication, redirect to dashboard for consistency
  if (path === '/admin' && isAuthenticated) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/admin/:path*'],
}