import type { User } from '@/entities/user';
import { buildApiUrl } from '@/shared/api/client';
import type { BaseResponse } from '@/shared/api/types';

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';

interface GetApiDataOptions {
	accessToken?: string | null;
	requireSession?: boolean;
	swallowError?: boolean;
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

const fetchApiData = async <T>(path: string, options: GetApiDataOptions = {}): Promise<T | null> => {
	const { accessToken, requireSession = false, swallowError = false } = options;

	if (requireSession && !accessToken) {
		return null;
	}

	try {
		const response = await fetch(buildApiUrl(path), {
			cache: 'no-store',
			headers: buildSessionHeaders(accessToken),
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
