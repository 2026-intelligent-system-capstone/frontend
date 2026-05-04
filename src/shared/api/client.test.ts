import { afterEach, describe, expect, test, vi } from 'vitest';

import { apiClient } from './client';
import { ApiClientError } from './types';

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

const jsonResponse = (status: number, body: unknown): Response => {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' },
	});
};

const emptyJsonResponse = (status: number): Response => {
	return new Response('null', {
		status,
		headers: { 'content-type': 'application/json' },
	});
};

const unauthorizedResponse = (): Response => {
	return jsonResponse(401, {
		error_code: 'AUTH__UNAUTHORIZED',
		message: '인증이 필요합니다.',
		detail: null,
	});
};

describe('apiClient auth refresh', () => {
	afterEach(() => {
		mockFetch.mockReset();
	});

	test('refreshes once after an unauthorized response and retries the original request', async () => {
		mockFetch
			.mockResolvedValueOnce(unauthorizedResponse())
			.mockResolvedValueOnce(emptyJsonResponse(200))
			.mockResolvedValueOnce(
				jsonResponse(200, {
					data: { id: 'user-1' },
					message: 'ok',
					meta: null,
				}),
			);

		const result = await apiClient.get<{
			data: { id: string };
			message: string;
			meta: null;
		}>('/api/users/me');

		expect(result.data.id).toBe('user-1');
		expect(mockFetch).toHaveBeenCalledTimes(3);
		expect(mockFetch).toHaveBeenNthCalledWith(
			2,
			'http://localhost:8000/api/auth/refresh',
			expect.objectContaining({
				credentials: 'include',
				method: 'POST',
			}),
		);
	});

	test('throws the original unauthorized error when refresh fails', async () => {
		mockFetch
			.mockResolvedValueOnce(unauthorizedResponse())
			.mockResolvedValueOnce(
				jsonResponse(401, {
					error_code: 'AUTH__INVALID_REFRESH_TOKEN',
					message: '리프레시 토큰이 유효하지 않습니다.',
					detail: null,
				}),
			);

		await expect(apiClient.get('/api/users/me')).rejects.toMatchObject({
			status: 401,
			errorCode: 'AUTH__UNAUTHORIZED',
		} satisfies Partial<ApiClientError>);
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	test('throws the retried request error when refresh succeeds but retry fails', async () => {
		mockFetch
			.mockResolvedValueOnce(unauthorizedResponse())
			.mockResolvedValueOnce(emptyJsonResponse(200))
			.mockResolvedValueOnce(
				jsonResponse(403, {
					error_code: 'AUTH__FORBIDDEN',
					message: '접근 권한이 없습니다.',
					detail: null,
				}),
			);

		await expect(apiClient.get('/api/users/me')).rejects.toMatchObject({
			status: 403,
			errorCode: 'AUTH__FORBIDDEN',
		} satisfies Partial<ApiClientError>);
		expect(mockFetch).toHaveBeenCalledTimes(3);
	});

	test('shares a single refresh request across concurrent unauthorized responses', async () => {
		mockFetch
			.mockResolvedValueOnce(unauthorizedResponse())
			.mockResolvedValueOnce(unauthorizedResponse())
			.mockResolvedValueOnce(emptyJsonResponse(200))
			.mockResolvedValueOnce(
				jsonResponse(200, {
					data: { id: 'first' },
					message: 'ok',
					meta: null,
				}),
			)
			.mockResolvedValueOnce(
				jsonResponse(200, {
					data: { id: 'second' },
					message: 'ok',
					meta: null,
				}),
			);

		const [first, second] = await Promise.all([
			apiClient.get<{ data: { id: string }; message: string; meta: null }>('/api/users/me'),
			apiClient.get<{ data: { id: string }; message: string; meta: null }>('/api/users/me'),
		]);

		expect(first.data.id).toBe('first');
		expect(second.data.id).toBe('second');
		expect(mockFetch).toHaveBeenCalledTimes(5);
		expect(
			mockFetch.mock.calls.filter(([url]) => url === 'http://localhost:8000/api/auth/refresh'),
		).toHaveLength(1);
	});

	test('does not attempt refresh for login failures', async () => {
		mockFetch.mockResolvedValueOnce(
			jsonResponse(401, {
				error_code: 'AUTH__INVALID_CREDENTIALS',
				message: '학교 계정 정보가 올바르지 않습니다.',
				detail: null,
			}),
		);

		await expect(apiClient.post('/api/auth/login', {})).rejects.toMatchObject({
			status: 401,
			errorCode: 'AUTH__INVALID_CREDENTIALS',
		} satisfies Partial<ApiClientError>);
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});
});
