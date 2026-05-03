import { StudentExamResultPage } from '@/widgets/student-exam-result';

interface ExamResultPageProps {
	params: Promise<{ examId: string }>;
	searchParams: Promise<{ finalize?: string | string[]; sessionId?: string | string[] }>;
}

function getSearchParamValue(value: string | string[] | undefined): string | null {
	return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

export default async function ExamResultPage({ params, searchParams }: ExamResultPageProps) {
	const [{ examId }, resolvedSearchParams] = await Promise.all([params, searchParams]);
	return (
		<StudentExamResultPage
			examId={examId}
			finalizeStatus={getSearchParamValue(resolvedSearchParams.finalize)}
			sessionId={getSearchParamValue(resolvedSearchParams.sessionId)}
		/>
	);
}
