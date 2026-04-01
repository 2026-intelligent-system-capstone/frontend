import { cookies } from 'next/headers';

import { ClassroomListPage } from '@/components/professor/classroom-list-page';
import { ACCESS_TOKEN_COOKIE_NAME, getSessionApiData } from '@/lib/auth/session';
import type { Classroom } from '@/types/classroom';

export default async function ProfessorClassroomsPage() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const classroomData = await getSessionApiData<Classroom[]>('/api/classrooms', accessToken);

	return <ClassroomListPage classrooms={classroomData ?? []} isError={Boolean(accessToken) && classroomData === null} />;
}
