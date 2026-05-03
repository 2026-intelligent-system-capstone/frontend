import { formatExamDateTime } from '@/entities/exam';
import type { StudentExamPayload } from '@/entities/exam';
import { SurfaceCard } from '@/shared/ui';

type ExamInfoCardExam = Pick<
	StudentExamPayload,
	| 'starts_at'
	| 'ends_at'
	| 'duration_minutes'
	| 'max_attempts'
	| 'remaining_attempts'
	| 'is_completed'
	| 'can_enter'
	| 'has_result'
>;

interface ExamInfoCardProps {
	exam: ExamInfoCardExam;
}

function getAttemptLabel(exam: ExamInfoCardExam): string {
	if (exam.remaining_attempts === undefined || exam.remaining_attempts === null) {
		return exam.max_attempts > 1 ? `최대 ${exam.max_attempts}회` : '1회';
	}

	return `${exam.remaining_attempts}/${exam.max_attempts}회 남음`;
}

function getProgressLabel(exam: ExamInfoCardExam): string {
	if (exam.has_result) return '결과 확인 가능';
	if (exam.is_completed) return '채점 중 · 제출 완료 후 리포트 생성 대기';
	if (exam.can_enter) return '입장 가능 · 안내 확인 후 시작';
	return '입장 불가 · 일정 또는 응시 횟수 확인 필요';
}

const infoRows = (exam: ExamInfoCardExam) => [
	{ label: '시작 시간', value: formatExamDateTime(exam.starts_at) },
	{ label: '종료 시간', value: formatExamDateTime(exam.ends_at) },
	{ label: '제한 시간', value: `${exam.duration_minutes}분` },
	{ label: '응시 횟수', value: getAttemptLabel(exam) },
	{ label: '현재 상태', value: getProgressLabel(exam) },
];

export function ExamInfoCard({ exam }: ExamInfoCardProps) {
	return (
		<SurfaceCard className="space-y-5">
			<div className="space-y-2">
				<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.05em] uppercase">
					01 · Exam brief
				</p>
				<h2 className="text-neutral-text text-xl font-semibold tracking-[-0.01em]">시험 정보</h2>
				<p className="text-neutral-gray-500 text-sm leading-6">
					입장 전 일정, 제한 시간, 응시 가능 상태를 먼저 확인하세요.
				</p>
			</div>
			<dl className="divide-border-subtle border-border-subtle bg-surface-muted divide-y rounded-2xl border">
				{infoRows(exam).map((row) => (
					<div key={row.label} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[8rem_1fr] sm:gap-4">
						<dt className="text-neutral-gray-500 font-medium">{row.label}</dt>
						<dd className="text-neutral-text font-semibold">{row.value}</dd>
					</div>
				))}
			</dl>
		</SurfaceCard>
	);
}
