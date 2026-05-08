import { cookies } from 'next/headers';

import { type Classroom } from '@/entities/classroom';
import { type User } from '@/entities/user';
import { ACCESS_TOKEN_COOKIE_NAME, getSessionApiDataOrNull } from '@/entities/viewer/server';
import { ClassroomStudentsManagementPage } from '@/widgets/classroom';

interface ProfessorClassroomStudentsPageProps {
	params: Promise<{
		classroomId: string;
	}>;
}

export default async function ProfessorClassroomStudentsPage({ params }: ProfessorClassroomStudentsPageProps) {
	const { classroomId } = await params;
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const [classroomData, usersData] = await Promise.all([
		getSessionApiDataOrNull<Classroom>(`/api/classrooms/${classroomId}`, accessToken),
		getSessionApiDataOrNull<User[]>('/api/users', accessToken),
	]);

	return (
		<ClassroomStudentsManagementPage
			classroomId={classroomId}
			initialClassroom={classroomData}
			initialUsers={usersData ?? []}
			canManageStudents
			isClassroomError={classroomData === null}
			isUsersError={usersData === null}
		/>
	);
}
