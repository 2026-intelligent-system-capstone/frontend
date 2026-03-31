import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/auth/login-form';
import { getDefaultRouteByRole } from '@/lib/auth/routes';
import { ACCESS_TOKEN_COOKIE_NAME, getSessionUser } from '@/lib/auth/session';

export default async function LoginPage() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const user = await getSessionUser(accessToken);

	if (user) {
		redirect(getDefaultRouteByRole(user.role));
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dbeafe,transparent_35%),linear-gradient(135deg,#0f172a,#1e293b)] px-4 py-16">
			<LoginForm />
		</div>
	);
}
