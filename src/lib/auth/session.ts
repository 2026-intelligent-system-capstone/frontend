import type { BaseResponse } from '@/types/api';
import type { User } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';

const buildApiUrl = (path: string) => {
	return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const buildSessionHeaders = (accessToken?: string | null) => {
	const headers: Record<string, string> = {
		Accept: 'application/json',
	};

	if (accessToken) {
		headers.Cookie = `${ACCESS_TOKEN_COOKIE_NAME}=${accessToken}`;
	}

	return headers;
};

export const getApiData = async <T>(path: string, accessToken?: string | null): Promise<T | null> => {
	try {
		const response = await fetch(buildApiUrl(path), {
			cache: 'no-store',
			headers: buildSessionHeaders(accessToken),
		});

		if (!response.ok) {
			return null;
		}

		const payload = (await response.json()) as BaseResponse<T>;
		return payload.data;
	} catch {
		return null;
	}
};

export const getSessionApiData = async <T>(path: string, accessToken?: string | null): Promise<T | null> => {
	if (!accessToken) {
		return null;
	}

	return getApiData<T>(path, accessToken);
};

export const getSessionUser = async (accessToken?: string | null): Promise<User | null> => {
	return getSessionApiData<User>('/api/users/me', accessToken);
};
