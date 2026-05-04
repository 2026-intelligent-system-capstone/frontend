import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { RefreshedSession } from '@/entities/viewer/server';
import { proxy } from './proxy';

const getSessionUserWithRefreshMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/viewer/server', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@/entities/viewer/server')>();

	return {
		...actual,
		getSessionUserWithRefresh: getSessionUserWithRefreshMock,
	};
});

const createRequest = (path: string, cookie = ''): NextRequest => {
	return new NextRequest(`http://localhost:3000${path}`, {
		headers: cookie ? { cookie } : undefined,
	});
};

const unauthenticatedSession = (setCookieHeaders: string[] = []): RefreshedSession => ({
	user: null,
	setCookieHeaders,
});

describe('proxy auth refresh guard', () => {
	beforeEach(() => {
		getSessionUserWithRefreshMock.mockReset();
	});

	test('redirects unauthenticated professor routes to login', async () => {
		getSessionUserWithRefreshMock.mockResolvedValueOnce(unauthenticatedSession());

		const response = await proxy(createRequest('/professor/classrooms'));

		expect(response.status).toBe(307);
		expect(response.headers.get('location')).toBe('http://localhost:3000/login');
	});

	test('forwards only auth Set-Cookie headers from refresh responses', async () => {
		getSessionUserWithRefreshMock.mockResolvedValueOnce(
			unauthenticatedSession([
				'access_token=next-access; Path=/; HttpOnly',
				'tracking_id=unexpected; Path=/',
				'refresh_token=next-refresh; Path=/; HttpOnly',
			]),
		);

		const response = await proxy(createRequest('/student/exams'));
		const setCookie = response.headers.get('set-cookie') ?? '';

		expect(setCookie).toContain('access_token=next-access');
		expect(setCookie).toContain('refresh_token=next-refresh');
		expect(setCookie).not.toContain('tracking_id=unexpected');
	});
});
