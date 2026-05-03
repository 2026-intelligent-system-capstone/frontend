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
		<div
			className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white
				to-white px-4 py-16"
		>
			<div className="flex w-full max-w-xl flex-col items-center gap-6">
				<div className="text-center">
					<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600">
						<span className="text-sm font-bold text-white">D</span>
					</div>
					<p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Dialearn</p>
				</div>
				<SignInForm
					initialOrganizations={organizations ?? []}
					organizationsLoadFailed={organizations === null}
				/>
			</div>
		</div>
	);
}
