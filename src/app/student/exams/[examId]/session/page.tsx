import { StudentExamSessionPage } from '@/widgets/student-exam-session';

export default async function ExamSessionPage({ params }: { params: Promise<{ examId: string }> }) {
	const { examId } = await params;
	return <StudentExamSessionPage examId={examId} />;
}
