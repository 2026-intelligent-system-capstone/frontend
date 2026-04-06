import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ACCESS_TOKEN_COOKIE_NAME, getSessionUser } from '@/entities/viewer/server';

export default async function Page() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const user = await getSessionUser(accessToken);

	if (!user) {
		redirect('/login');
	}

	if (user.role === 'student') {
		redirect('/student/exams');
	}

	redirect('/professor/classrooms');
}
