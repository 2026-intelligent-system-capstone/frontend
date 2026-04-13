import { StudentExamDetailPage } from '@/widgets/student-exam-detail';

export default async function ExamDetailPage({ params }: { params: Promise<{ examId: string }> }) {
	const { examId } = await params;
	return <StudentExamDetailPage examId={examId} />;
}
