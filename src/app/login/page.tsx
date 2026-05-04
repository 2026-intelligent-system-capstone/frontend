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
		<main
			id="main-content"
			className="from-brand-soft via-surface to-surface flex min-h-screen items-center justify-center
				bg-[radial-gradient(circle_at_top,var(--color-brand-light),transparent_42%)] px-4 py-16"
		>
			<div className="flex w-full max-w-xl flex-col items-center gap-6">
				<div className="text-center">
					<div
						className="border-brand-border bg-brand-light mx-auto mb-3 flex h-10 w-10 items-center
							justify-center rounded-2xl border"
					>
						<span className="text-brand-deep text-sm font-semibold">D</span>
					</div>
					<p className="text-neutral-gray-500 font-mono text-xs font-semibold tracking-[0.08em] uppercase">
						Dialearn
					</p>
				</div>
				<SignInForm
					initialOrganizations={organizations ?? []}
					organizationsLoadFailed={organizations === null}
				/>
			</div>
		</main>
	);
}
