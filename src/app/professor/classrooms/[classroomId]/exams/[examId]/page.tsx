import { cookies } from 'next/headers';

import type { Classroom, ClassroomMaterial } from '@/types/classroom';
import type { Exam } from '@/types/exam';

import { ACCESS_TOKEN_COOKIE_NAME, getSessionApiData } from '@/lib/auth/session';

import { ExamManagementPage } from '@/components/professor/classroom-exams/exam-management-page';

interface ProfessorExamManagementPageProps {
	params: Promise<{
		classroomId: string;
		examId: string;
	}>;
}

export default async function ProfessorExamManagementPage({ params }: ProfessorExamManagementPageProps) {
	const { classroomId, examId } = await params;
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const [classroomData, materialsData, examData] = await Promise.all([
		getSessionApiData<Classroom>(`/api/classrooms/${classroomId}`, accessToken),
		getSessionApiData<ClassroomMaterial[]>(`/api/classrooms/${classroomId}/materials`, accessToken),
		getSessionApiData<Exam>(`/api/classrooms/${classroomId}/exams/${examId}`, accessToken),
	]);

	return (
		<ExamManagementPage
			classroomId={classroomId}
			examId={examId}
			initialClassroom={classroomData}
			initialExam={examData}
			initialMaterials={materialsData ?? []}
			isClassroomError={classroomData === null}
			isExamError={examData === null}
			isMaterialsError={materialsData === null}
		/>
	);
}
