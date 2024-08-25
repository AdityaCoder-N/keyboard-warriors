import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token) {

    // Authenticated users should not access sign-in or sign-up
    if (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up')) {
      return NextResponse.redirect(new URL('/home', request.url));
    }


  } else {
    
    // Unauthenticated users should not access home, play, and practice
    if (url.pathname.startsWith('/home') || url.pathname.startsWith('/play') || url.pathname.startsWith('/practice')) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Allow the request to proceed if none of the conditions match
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/play/:path*',
    '/practice',
    '/home',
  ],
};
