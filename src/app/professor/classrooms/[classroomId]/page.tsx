import { cookies } from 'next/headers';

import { ClassroomDetailPage } from '@/components/professor/classroom-detail-page';
import { ACCESS_TOKEN_COOKIE_NAME, getSessionApiData } from '@/lib/auth/session';
import type { Classroom, ClassroomMaterial } from '@/types/classroom';
import type { Exam } from '@/types/exam';
import type { User } from '@/types/user';

interface ProfessorClassroomDetailPageProps {
	params: Promise<{
		classroomId: string;
	}>;
}

export default async function ProfessorClassroomDetailPage({ params }: ProfessorClassroomDetailPageProps) {
	const { classroomId } = await params;
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const [classroomData, materialsData, examsData, usersData] = await Promise.all([
		getSessionApiData<Classroom>(`/api/classrooms/${classroomId}`, accessToken),
		getSessionApiData<ClassroomMaterial[]>(`/api/classrooms/${classroomId}/materials`, accessToken),
		getSessionApiData<Exam[]>(`/api/classrooms/${classroomId}/exams`, accessToken),
		getSessionApiData<User[]>('/api/users', accessToken),
	]);

	return (
		<ClassroomDetailPage
			classroomId={classroomId}
			initialClassroom={classroomData}
			initialMaterials={materialsData ?? []}
			initialExams={examsData ?? []}
			initialUsers={usersData ?? []}
			canManageClassroom
			isClassroomError={classroomData === null}
			isMaterialsError={materialsData === null}
			isExamsError={examsData === null}
			isUsersError={usersData === null}
		/>
	);
}
