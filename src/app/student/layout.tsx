import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { ACCESS_TOKEN_COOKIE_NAME, getSessionUser } from '@/lib/auth/session';

export default async function StudentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const user = await getSessionUser(accessToken);

	if (!user) {
		redirect('/login');
	}

	if (user.role !== 'student') {
		redirect('/professor/classrooms');
	}

	return <AppShell currentUser={user} role="student">{children}</AppShell>;
}
