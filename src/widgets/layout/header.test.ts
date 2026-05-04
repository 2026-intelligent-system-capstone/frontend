import { describe, expect, test } from 'vitest';

import { shouldRedirectUnauthenticatedViewer } from './header';

describe('shouldRedirectUnauthenticatedViewer', () => {
	test('redirects when viewer query resolves unauthenticated even with an initial user', () => {
		expect(shouldRedirectUnauthenticatedViewer(true)).toBe(true);
	});

	test('does not redirect while viewer query has not resolved unauthenticated', () => {
		expect(shouldRedirectUnauthenticatedViewer(false)).toBe(false);
	});
});
