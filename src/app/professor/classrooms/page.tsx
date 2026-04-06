import { cookies } from 'next/headers';

import { type Classroom } from '@/entities/classroom';
import { ACCESS_TOKEN_COOKIE_NAME, getSessionApiDataOrNull } from '@/entities/viewer/server';
import { ClassroomListPage } from '@/widgets/classroom/classroom-list-page';

export default async function ProfessorClassroomsPage() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const classroomData = await getSessionApiDataOrNull<Classroom[]>('/api/classrooms', accessToken);

	return (
		<ClassroomListPage classrooms={classroomData ?? []} isError={Boolean(accessToken) && classroomData === null} />
	);
}
