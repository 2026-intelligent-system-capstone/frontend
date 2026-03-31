import type { BaseResponse } from '@/types/api';
import type { User } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';

export const getSessionUser = async (accessToken?: string | null): Promise<User | null> => {
	if (!accessToken) {
		return null;
	}

	try {
		const response = await fetch(`${API_BASE_URL}/api/users/me`, {
			cache: 'no-store',
			headers: {
				Accept: 'application/json',
				Cookie: `${ACCESS_TOKEN_COOKIE_NAME}=${accessToken}`,
			},
		});

		if (!response.ok) {
			return null;
		}

		const payload = (await response.json()) as BaseResponse<User>;
		return payload.data;
	} catch {
		return null;
	}
};
