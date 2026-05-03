import {
	formatExamDateTime,
	getExamStatusColor,
	getExamStatusLabel,
	getExamTypeColor,
	getExamTypeLabel,
} from '@/entities/exam';
import type { StudentExam } from '@/entities/exam';
import { LinkButton, SurfaceCard, cn } from '@/shared/ui';
import { Button, Chip } from '@heroui/react';

interface ExamCardProps {
	exam: StudentExam;
}

interface ExamCta {
	href: string;
	label: string;
	helperText: string;
	isDisabled: boolean;
}

const getExamCta = (exam: StudentExam): ExamCta => {
	if (exam.has_result) {
		return {
			href: `/student/exams/${exam.id}/result`,
			label: '결과 보기',
			helperText: '채점이 완료되어 결과 리포트를 확인할 수 있습니다.',
			isDisabled: false,
		};
	}

	if (exam.is_completed) {
		return {
			href: `/student/exams/${exam.id}/result`,
			label: '채점 중',
			helperText: '제출은 완료되었습니다. 결과가 준비되면 리포트가 열립니다.',
			isDisabled: true,
		};
	}

	if (exam.can_enter) {
		return {
			href: `/student/exams/${exam.id}`,
			label: '입장 안내 보기',
			helperText: '입장 전 안내와 환경 점검을 확인한 뒤 시작하세요.',
			isDisabled: false,
		};
	}

	return {
		href: `/student/exams/${exam.id}`,
		label: '입장 불가',
		helperText: '아직 응시 시간이 아니거나 응시 가능 횟수가 남아 있지 않습니다.',
		isDisabled: true,
	};
};

export function ExamCard({ exam }: ExamCardProps) {
	const isActive = exam.status === 'in_progress';
	const cta = getExamCta(exam);

	return (
		<SurfaceCard
			className={cn(
				'group hover:border-brand/45 hover:bg-surface p-0 shadow-none transition-colors',
				isActive && 'border-brand/35 ring-brand/15 ring-1',
			)}
		>
			<div className="flex h-full flex-col">
				<div className="border-border-subtle border-b px-5 pt-5 pb-4 sm:px-6">
					<div className="flex items-start justify-between gap-4">
						<div className="min-w-0 flex-1 space-y-3">
							<div className="flex flex-wrap items-center gap-2">
								<Chip color={getExamTypeColor(exam.exam_type)} size="sm" variant="soft">
									<Chip.Label>{getExamTypeLabel(exam.exam_type)}</Chip.Label>
								</Chip>
								<Chip color={getExamStatusColor(exam.status)} size="sm" variant="soft">
									<Chip.Label>{getExamStatusLabel(exam.status)}</Chip.Label>
								</Chip>
								{isActive ? (
									<span
										className="bg-brand-light text-brand-deep inline-flex items-center gap-1
											rounded-full px-2.5 py-1 text-xs font-medium"
									>
										<span className="bg-brand-deep size-1.5 rounded-full" aria-hidden="true" />
										지금 응시 가능
									</span>
								) : null}
							</div>
							<div className="space-y-1.5">
								<p
									className="text-neutral-gray-500 font-mono text-xs font-semibold tracking-[0.05em]
										uppercase"
								>
									{exam.classroom_name ?? '강의실 정보 없음'}
								</p>
								<h2 className="text-neutral-text text-xl leading-snug font-semibold tracking-[-0.01em]">
									{exam.title}
								</h2>
								{exam.description ? (
									<p className="text-neutral-gray-500 line-clamp-2 text-sm leading-6">
										{exam.description}
									</p>
								) : null}
							</div>
						</div>
					</div>
				</div>

				<div className="grid gap-3 px-5 py-5 text-sm sm:grid-cols-3 sm:px-6">
					<div className="border-border-subtle bg-surface-muted rounded-2xl border p-3">
						<p className="text-neutral-gray-500 text-xs font-medium">시작</p>
						<p className="text-neutral-text mt-1 font-semibold">{formatExamDateTime(exam.starts_at)}</p>
					</div>
					<div className="border-border-subtle bg-surface-muted rounded-2xl border p-3">
						<p className="text-neutral-gray-500 text-xs font-medium">종료</p>
						<p className="text-neutral-text mt-1 font-semibold">{formatExamDateTime(exam.ends_at)}</p>
					</div>
					<div className="border-border-subtle bg-surface-muted rounded-2xl border p-3">
						<p className="text-neutral-gray-500 text-xs font-medium">제한 시간</p>
						<p className="text-neutral-text mt-1 font-semibold">{exam.duration_minutes}분</p>
					</div>
				</div>

				<div
					className="border-border-subtle mt-auto flex flex-col gap-3 border-t px-5 py-4 sm:flex-row
						sm:items-center sm:justify-between sm:px-6"
				>
					<p className="text-neutral-gray-500 max-w-lg text-sm leading-6">{cta.helperText}</p>
					{cta.isDisabled ? (
						<Button isDisabled size="sm" variant="secondary">
							{cta.label}
						</Button>
					) : (
						<LinkButton href={cta.href} size="sm">
							{cta.label}
						</LinkButton>
					)}
				</div>
			</div>
		</SurfaceCard>
	);
}
