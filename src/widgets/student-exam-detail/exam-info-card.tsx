import { Card } from '@heroui/react';
import { formatExamDateTime } from '@/entities/exam';
import type { Exam } from '@/entities/exam';

interface ExamInfoCardProps {
	exam: Pick<Exam, 'starts_at' | 'ends_at' | 'duration_minutes' | 'max_attempts'>;
}

export function ExamInfoCard({ exam }: ExamInfoCardProps) {
	return (
		<Card className="border border-slate-200 bg-white">
			<Card.Header>
				<Card.Title className="text-base font-semibold text-slate-900">시험 정보</Card.Title>
			</Card.Header>
			<Card.Content className="space-y-3 text-sm">
				<div className="flex justify-between">
					<span className="text-slate-500">시작 시간</span>
					<span className="font-medium text-slate-900">{formatExamDateTime(exam.starts_at)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-500">종료 시간</span>
					<span className="font-medium text-slate-900">{formatExamDateTime(exam.ends_at)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-500">제한 시간</span>
					<span className="font-medium text-slate-900">{exam.duration_minutes}분</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-500">재응시</span>
					<span className="font-medium text-slate-900">{exam.max_attempts > 1 ? '가능' : '불가'}</span>
				</div>
			</Card.Content>
		</Card>
	);
}
