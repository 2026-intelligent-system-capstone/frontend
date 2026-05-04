import { type NextRequest, NextResponse } from 'next/server';

import {
	ACCESS_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_NAME,
	type RefreshedSession,
	getDefaultRouteByRole,
	getSessionUserWithRefresh,
} from '@/entities/viewer/server';

const STUDENT_PREFIX = '/student';
const PROFESSOR_PREFIX = '/professor';
const PUBLIC_PATHS = new Set(['/login']);
const AUTH_COOKIE_NAMES = new Set([ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME]);

const isProtectedPath = (pathname: string): boolean => {
	return pathname.startsWith(STUDENT_PREFIX) || pathname.startsWith(PROFESSOR_PREFIX);
};

const isAuthSetCookieHeader = (setCookieHeader: string): boolean => {
	const [cookiePair] = setCookieHeader.trimStart().split(';', 1);
	const [cookieName] = cookiePair.split('=', 1);
	return AUTH_COOKIE_NAMES.has(cookieName);
};

const appendSetCookieHeaders = (response: NextResponse, setCookieHeaders: string[]): NextResponse => {
	setCookieHeaders.filter(isAuthSetCookieHeader).forEach((setCookieHeader) => {
		response.headers.append('set-cookie', setCookieHeader);
	});

	return response;
};

const buildForwardedCookieHeader = (request: NextRequest, session: RefreshedSession): string => {
	const cookies = new Map(request.cookies.getAll().map((cookie) => [cookie.name, cookie.value]));

	if (session.accessToken) {
		cookies.set(ACCESS_TOKEN_COOKIE_NAME, session.accessToken);
	}

	if (session.refreshToken) {
		cookies.set(REFRESH_TOKEN_COOKIE_NAME, session.refreshToken);
	}

	return Array.from(cookies.entries())
		.map(([name, value]) => `${name}=${value}`)
		.join('; ');
};

const nextWithSessionCookies = (request: NextRequest, session: RefreshedSession): NextResponse => {
	const requestHeaders = new Headers(request.headers);
	const cookieHeader = buildForwardedCookieHeader(request, session);

	if (cookieHeader) {
		requestHeaders.set('cookie', cookieHeader);
	}

	return appendSetCookieHeaders(
		NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		}),
		session.setCookieHeaders,
	);
};

const redirectWithSessionCookies = (url: URL, session: RefreshedSession): NextResponse => {
	return appendSetCookieHeaders(NextResponse.redirect(url), session.setCookieHeaders);
};

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
	const needsAuth = isProtectedPath(pathname);
	const isPublicPath = PUBLIC_PATHS.has(pathname);
	const isRootPath = pathname === '/';
	const session = await getSessionUserWithRefresh({ accessToken, refreshToken });
	const user = session.user;

	if (!user) {
		if (needsAuth || isRootPath) {
			return redirectWithSessionCookies(new URL('/login', request.url), session);
		}

		return nextWithSessionCookies(request, session);
	}

	if (isRootPath || isPublicPath) {
		return redirectWithSessionCookies(new URL(getDefaultRouteByRole(user.role), request.url), session);
	}

	if (pathname.startsWith(STUDENT_PREFIX) && user.role !== 'student') {
		return redirectWithSessionCookies(new URL(getDefaultRouteByRole(user.role), request.url), session);
	}

	if (pathname.startsWith(PROFESSOR_PREFIX) && user.role === 'student') {
		return redirectWithSessionCookies(new URL(getDefaultRouteByRole(user.role), request.url), session);
	}

	return nextWithSessionCookies(request, session);
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
