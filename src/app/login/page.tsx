import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { Organization } from '@/entities/organization';
import {
	ACCESS_TOKEN_COOKIE_NAME,
	getApiDataOrNull,
	getDefaultRouteByRole,
	getSessionUser,
} from '@/entities/viewer/server';
import { SignInForm } from '@/features/sign-in';

export default async function LoginPage() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const [user, organizations] = await Promise.all([
		getSessionUser(accessToken),
		getApiDataOrNull<Organization[]>('/api/organizations'),
	]);

	if (user) {
		redirect(getDefaultRouteByRole(user.role));
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-[#252525] px-4 py-16">
			<SignInForm initialOrganizations={organizations ?? []} organizationsLoadFailed={organizations === null} />
		</div>
	);
}
