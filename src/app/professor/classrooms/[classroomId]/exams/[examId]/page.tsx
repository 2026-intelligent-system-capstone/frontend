import { cookies } from 'next/headers';

import { type Classroom } from '@/entities/classroom';
import { type ClassroomMaterial } from '@/entities/classroom-material';
import { type Exam } from '@/entities/exam';
import { ACCESS_TOKEN_COOKIE_NAME, getSessionApiDataOrNull } from '@/entities/viewer/server';
import { ExamManagementScreen } from '@/widgets/exam-management';

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
		getSessionApiDataOrNull<Classroom>(`/api/classrooms/${classroomId}`, accessToken),
		getSessionApiDataOrNull<ClassroomMaterial[]>(`/api/classrooms/${classroomId}/materials`, accessToken),
		getSessionApiDataOrNull<Exam>(`/api/classrooms/${classroomId}/exams/${examId}`, accessToken),
	]);

	return (
		<ExamManagementScreen
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
