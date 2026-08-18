import { NextResponse } from 'next/server';
import { getSessionCookieName } from '@/lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicPath =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico';

  if (publicPath) {
    const token = request.cookies.get(getSessionCookieName())?.value;

    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  const token = request.cookies.get(getSessionCookieName())?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
