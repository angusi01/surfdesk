import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/pricing', '/onboarding/:path*'],
};

export function middleware(req) {
  return NextResponse.redirect(new URL('/', req.url));
}
