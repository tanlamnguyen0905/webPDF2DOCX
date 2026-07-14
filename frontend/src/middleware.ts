import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/pricing',
  '/guide',
  '/support',
  '/upload',
];

const adminPaths = ['/admin'];
const userPaths = ['/dashboard', '/conversions', '/wallet', '/payments', '/tickets', '/profile'];

function isPublicPath(pathname: string) {
  if (publicPaths.includes(pathname)) return true;
  if (pathname.startsWith('/reset-password/')) return true;
  return false;
}

function isAdminPath(pathname: string) {
  return adminPaths.some((p) => pathname.startsWith(p));
}

function isUserPath(pathname: string) {
  return userPaths.some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  // Public paths - allow access
  if (isPublicPath(pathname)) {
    // If logged in and trying to access auth pages, redirect to dashboard
    if (accessToken && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // No token - redirect to login
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For protected routes, we'd need to validate token and check role
  // Since we can't decode JWT in middleware without a secret,
  // we'll let the client-side AuthProvider handle role checks
  // but we can at least check if user is logged in

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};