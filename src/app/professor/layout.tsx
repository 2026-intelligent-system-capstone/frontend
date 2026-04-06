import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ACCESS_TOKEN_COOKIE_NAME, getSessionUser } from '@/entities/viewer/server';
import { AppShell } from '@/widgets/layout';

export default async function ProfessorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const user = await getSessionUser(accessToken);

	if (!user) {
		redirect('/login');
	}

	if (user.role === 'student') {
		redirect('/student/exams');
	}

	return (
		<AppShell currentUser={user} role={user.role === 'admin' ? 'admin' : 'professor'}>
			{children}
		</AppShell>
	);
}
