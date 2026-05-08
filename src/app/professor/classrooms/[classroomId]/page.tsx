import { cookies } from 'next/headers';

import { type Classroom } from '@/entities/classroom';
import { type ClassroomMaterial } from '@/entities/classroom-material';
import { type Exam } from '@/entities/exam';
import { ACCESS_TOKEN_COOKIE_NAME, getSessionApiDataOrNull } from '@/entities/viewer/server';
import { ClassroomDetailPage } from '@/widgets/classroom/classroom-detail-page';

interface ProfessorClassroomDetailPageProps {
	params: Promise<{
		classroomId: string;
	}>;
}

export default async function ProfessorClassroomDetailPage({ params }: ProfessorClassroomDetailPageProps) {
	const { classroomId } = await params;
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const [classroomData, materialsData, examsData] = await Promise.all([
		getSessionApiDataOrNull<Classroom>(`/api/classrooms/${classroomId}`, accessToken),
		getSessionApiDataOrNull<ClassroomMaterial[]>(`/api/classrooms/${classroomId}/materials`, accessToken),
		getSessionApiDataOrNull<Exam[]>(`/api/classrooms/${classroomId}/exams`, accessToken),
	]);

	return (
		<ClassroomDetailPage
			classroomId={classroomId}
			initialClassroom={classroomData}
			initialMaterials={materialsData ?? []}
			initialExams={examsData ?? []}
			canManageClassroom
			isClassroomError={classroomData === null}
			isMaterialsError={materialsData === null}
			isExamsError={examsData === null}
		/>
	);
}
