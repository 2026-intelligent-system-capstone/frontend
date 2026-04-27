import { type NextRequest, NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_NAME, getDefaultRouteByRole, getSessionUser } from '@/entities/viewer/server';

const STUDENT_PREFIX = '/student';
const PROFESSOR_PREFIX = '/professor';
const PUBLIC_PATHS = new Set(['/login']);

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const needsAuth = false;
	const isPublicPath = PUBLIC_PATHS.has(pathname);
	const isRootPath = pathname === '/';

	if (!accessToken && needsAuth) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (!accessToken) {
		if (isRootPath) {
			return NextResponse.redirect(new URL('/login', request.url));
		}

		return NextResponse.next();
	}

	const user = await getSessionUser(accessToken);
	if (!user) {
		if (needsAuth || isRootPath) {
			return NextResponse.redirect(new URL('/login', request.url));
		}

		return NextResponse.next();
	}

	if (isRootPath || isPublicPath) {
		return NextResponse.redirect(new URL(getDefaultRouteByRole(user.role), request.url));
	}

	if (pathname.startsWith(STUDENT_PREFIX) && user.role !== 'student') {
		return NextResponse.redirect(new URL(getDefaultRouteByRole(user.role), request.url));
	}

	if (pathname.startsWith(PROFESSOR_PREFIX) && user.role === 'student') {
		return NextResponse.redirect(new URL(getDefaultRouteByRole(user.role), request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
