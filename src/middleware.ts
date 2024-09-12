import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';  // Import NextRequest
import { getToken } from 'next-auth/jwt';

interface Token {
    id: string;
    email: string;
    name: string;
    role: string;
    profilePhotoUrl?: string;
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as Token | null;

    // If trying to access `/signin` or `/signup` and the user is already logged in, redirect to '/'
    if ((pathname === '/signin' || pathname === '/signup') && token) {
        const homeUrl = new URL('/', req.url);
        return NextResponse.redirect(homeUrl);
    }

    // If trying to access `/signin` or `/signup`, allow everyone
    if (pathname === '/signin' || pathname === '/signup') {
        return NextResponse.next();
    }

    // Redirect to '/signin' if not logged in for protected routes
    if (!token && pathname === '/') {
        const signInUrl = new URL('/signin', req.url);
        return NextResponse.redirect(signInUrl);
    }

    // If trying to access '/admin/[...]', only allow admins
    if (pathname.startsWith('/admin')) {
        if (!token || token.role !== 'Admin') {
            const homeUrl = new URL('/', req.url);
            return NextResponse.redirect(homeUrl);
        }
    }
    if (pathname.startsWith('/product') ) {
        if (!token) {
            const homeUrl = new URL('/signin', req.url);
            return NextResponse.redirect(homeUrl);
        }
    }
    if (pathname.startsWith('/profile') ) {
        if (!token) {
            const homeUrl = new URL('/signin', req.url);
            return NextResponse.redirect(homeUrl);
        }
    }

    // Allow all other requests
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/admin/:path*', '/signin', '/signup','/product/:path*,','/profile/:path*'],
};
