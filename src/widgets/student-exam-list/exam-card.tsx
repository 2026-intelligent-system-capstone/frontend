import Link from 'next/link';
import { Button, Card, Chip } from '@heroui/react';
import {
	formatExamDateTime,
	getExamStatusColor,
	getExamStatusLabel,
	getExamTypeColor,
	getExamTypeLabel,
} from '@/entities/exam';
import type { Exam } from '@/entities/exam';

interface ExamCardProps {
	exam: Exam & { classroom_name: string };
}

export function ExamCard({ exam }: ExamCardProps) {
	const isActive = exam.status === 'in_progress';

	return (
		<Card
			className={`border bg-white transition-shadow hover:shadow-md ${
				isActive
					? 'border-emerald-200 shadow-sm ring-1 ring-emerald-100'
					: 'border-slate-200 shadow-sm'
			}`}
		>
			<Card.Header className="gap-2 pb-2">
				<div className="flex w-full items-start justify-between gap-4">
					<div className="min-w-0 flex-1 space-y-1.5">
						<div className="flex flex-wrap items-center gap-2">
							<Chip color={getExamTypeColor(exam.exam_type)} size="sm" variant="soft">
								<Chip.Label>{getExamTypeLabel(exam.exam_type)}</Chip.Label>
							</Chip>
							<Chip color={getExamStatusColor(exam.status)} size="sm" variant="soft">
								<Chip.Label>{getExamStatusLabel(exam.status)}</Chip.Label>
							</Chip>
						</div>
						<p className="text-xs font-medium text-slate-400">{exam.classroom_name}</p>
						<Card.Title className="text-base font-semibold text-slate-900">{exam.title}</Card.Title>
					</div>
					{isActive && (
						<span className="mt-0.5 flex h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
					)}
				</div>
			</Card.Header>
			<Card.Content className="space-y-3 pb-4 text-sm text-slate-600">
				{exam.description && <p className="text-slate-500">{exam.description}</p>}
				<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
					<span>시작 {formatExamDateTime(exam.starts_at)}</span>
					<span>종료 {formatExamDateTime(exam.ends_at)}</span>
					<span>제한시간 {exam.duration_minutes}분</span>
				</div>
			</Card.Content>
			<Card.Footer className="border-t border-slate-100 pt-3">
				{exam.status === 'in_progress' && (
					<Link href={`/student/exams/${exam.id}`}>
						<Button size="sm" variant="primary">
							입장하기
						</Button>
					</Link>
				)}
				{exam.status === 'ready' && (
					<Button isDisabled size="sm" variant="secondary">
						시작 전
					</Button>
				)}
				{exam.status === 'closed' && (
					<Link href={`/student/exams/${exam.id}/result`}>
						<Button size="sm" variant="outline">
							결과 보기
						</Button>
					</Link>
				)}
			</Card.Footer>
		</Card>
	);
}
