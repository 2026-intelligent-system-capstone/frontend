import type { User } from '@/entities/user';
import { buildApiUrl } from '@/shared/api/client';
import type { BaseResponse } from '@/shared/api/types';

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

interface GetApiDataOptions {
	accessToken?: string | null;
	requireSession?: boolean;
	swallowError?: boolean;
}

interface SessionCookieInput {
	accessToken?: string | null;
	refreshToken?: string | null;
}

export interface RefreshedSession {
	user: User | null;
	setCookieHeaders: string[];
	accessToken?: string;
	refreshToken?: string;
}

const buildSessionHeaders = (accessToken?: string | null) => {
	const headers: Record<string, string> = {
		Accept: 'application/json',
	};

	if (accessToken) {
		headers.Cookie = `${ACCESS_TOKEN_COOKIE_NAME}=${accessToken}`;
	}

	return headers;
};

const buildRefreshHeaders = ({ accessToken, refreshToken }: SessionCookieInput) => {
	const cookieParts = [
		accessToken ? `${ACCESS_TOKEN_COOKIE_NAME}=${accessToken}` : null,
		refreshToken ? `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}` : null,
	].filter((cookiePart): cookiePart is string => cookiePart !== null);

	return {
		Accept: 'application/json',
		Cookie: cookieParts.join('; '),
	};
};

const fetchApiData = async <T>(path: string, options: GetApiDataOptions = {}): Promise<T | null> => {
	const { accessToken, requireSession = false, swallowError = false } = options;

	if (requireSession && !accessToken) {
		return null;
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 3000);

	try {
		const response = await fetch(buildApiUrl(path), {
			cache: 'no-store',
			headers: buildSessionHeaders(accessToken),
			signal: controller.signal,
		});

		if (response.status === 401 || response.status === 403 || response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status} ${path}`);
		}

		const payload = (await response.json()) as BaseResponse<T>;
		return payload.data;
	} catch (error) {
		if (swallowError) {
			return null;
		}

		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
};

const getSetCookieHeaders = (headers: Headers): string[] => {
	const headersWithGetter = headers as Headers & { getSetCookie?: () => string[] };
	const setCookieHeaders = headersWithGetter.getSetCookie?.();
	if (setCookieHeaders && setCookieHeaders.length > 0) {
		return setCookieHeaders;
	}

	const setCookieHeader = headers.get('set-cookie');
	if (!setCookieHeader) {
		return [];
	}

	return setCookieHeader.split(/,(?=\s*[^;,=]+=)/).map((cookie) => cookie.trim());
};

const getCookieValueFromSetCookie = (setCookieHeaders: string[], cookieName: string): string | undefined => {
	const targetHeader = setCookieHeaders.find((setCookieHeader) => {
		return setCookieHeader.trimStart().startsWith(`${cookieName}=`);
	});

	if (!targetHeader) {
		return undefined;
	}

	const [cookiePair] = targetHeader.split(';', 1);
	const [, ...valueParts] = cookiePair.split('=');
	return valueParts.join('=');
};

const refreshSession = async ({ accessToken, refreshToken }: SessionCookieInput): Promise<RefreshedSession> => {
	if (!refreshToken) {
		return { user: null, setCookieHeaders: [] };
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 3000);

	try {
		const response = await fetch(buildApiUrl('/api/auth/refresh'), {
			cache: 'no-store',
			headers: buildRefreshHeaders({ accessToken, refreshToken }),
			method: 'POST',
			signal: controller.signal,
		});
		const setCookieHeaders = getSetCookieHeaders(response.headers);

		if (!response.ok) {
			return { user: null, setCookieHeaders };
		}

		const nextAccessToken = getCookieValueFromSetCookie(setCookieHeaders, ACCESS_TOKEN_COOKIE_NAME);
		const nextRefreshToken = getCookieValueFromSetCookie(setCookieHeaders, REFRESH_TOKEN_COOKIE_NAME);
		if (!nextAccessToken) {
			return { user: null, setCookieHeaders };
		}

		const user = await getSessionUser(nextAccessToken);
		return {
			user,
			setCookieHeaders,
			accessToken: nextAccessToken,
			refreshToken: nextRefreshToken ?? refreshToken,
		};
	} catch {
		return { user: null, setCookieHeaders: [] };
	} finally {
		clearTimeout(timeoutId);
	}
};

export const getApiData = async <T>(path: string, accessToken?: string | null): Promise<T | null> => {
	return fetchApiData<T>(path, { accessToken });
};

export const getSessionApiData = async <T>(path: string, accessToken?: string | null): Promise<T | null> => {
	return fetchApiData<T>(path, { accessToken, requireSession: true });
};

export const getApiDataOrNull = async <T>(path: string, accessToken?: string | null): Promise<T | null> => {
	return fetchApiData<T>(path, { accessToken, swallowError: true });
};

export const getSessionApiDataOrNull = async <T>(path: string, accessToken?: string | null): Promise<T | null> => {
	return fetchApiData<T>(path, {
		accessToken,
		requireSession: true,
		swallowError: true,
	});
};

export const getSessionUser = async (accessToken?: string | null): Promise<User | null> => {
	return getSessionApiDataOrNull<User>('/api/users/me', accessToken);
};

export const getSessionUserWithRefresh = async ({
	accessToken,
	refreshToken,
}: SessionCookieInput): Promise<RefreshedSession> => {
	const user = await getSessionUser(accessToken);
	if (user) {
		return {
			user,
			setCookieHeaders: [],
			accessToken: accessToken ?? undefined,
			refreshToken: refreshToken ?? undefined,
		};
	}

	return refreshSession({ accessToken, refreshToken });
};
