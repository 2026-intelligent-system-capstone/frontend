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
	return (
		<Card className="border border-slate-200 bg-white">
			<Card.Header className="gap-2">
				<div className="flex w-full items-start justify-between gap-4">
					<div className="space-y-1">
						<div className="flex flex-wrap items-center gap-2">
							<Chip color={getExamTypeColor(exam.exam_type)} size="sm" variant="soft">
								<Chip.Label>{getExamTypeLabel(exam.exam_type)}</Chip.Label>
							</Chip>
							<Chip color={getExamStatusColor(exam.status)} size="sm" variant="soft">
								<Chip.Label>{getExamStatusLabel(exam.status)}</Chip.Label>
							</Chip>
						</div>
						<p className="text-xs text-slate-400">{exam.classroom_name}</p>
						<Card.Title className="text-base font-semibold text-slate-900">{exam.title}</Card.Title>
					</div>
				</div>
			</Card.Header>
			<Card.Content className="space-y-3 text-sm text-slate-600">
				{exam.description && <p>{exam.description}</p>}
				<div className="flex flex-wrap gap-4 text-xs text-slate-400">
					<span>시작 {formatExamDateTime(exam.starts_at)}</span>
					<span>종료 {formatExamDateTime(exam.ends_at)}</span>
					<span>제한시간 {exam.duration_minutes}분</span>
				</div>
			</Card.Content>
			<Card.Footer>
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
