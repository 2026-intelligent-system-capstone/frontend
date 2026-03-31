import { ClassroomDetailPage } from '@/components/professor/classroom-detail-page';

interface ProfessorClassroomDetailPageProps {
	params: Promise<{
		classroomId: string;
	}>;
}

export default async function ProfessorClassroomDetailPage({ params }: ProfessorClassroomDetailPageProps) {
	const { classroomId } = await params;

	return <ClassroomDetailPage classroomId={classroomId} />;
}
