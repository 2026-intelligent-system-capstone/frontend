'use client';

import type { ReactNode } from 'react';

import {
	getExamStatusColor,
	getExamStatusLabel,
	getExamTypeColor,
	getExamTypeLabel,
	useStudentExam,
} from '@/entities/exam';
import type { StudentExamPayload } from '@/entities/exam';
import { LinkButton, PageHeader, PageShell, StateBlock, SurfaceCard } from '@/shared/ui';
import { Button, Chip } from '@heroui/react';

import { ExamCriteriaCard } from './exam-criteria-card';
import { ExamEnvCheckCard } from './exam-env-check-card';
import { ExamGuideCard } from './exam-guide-card';
import { ExamInfoCard } from './exam-info-card';

interface StudentExamDetailPageProps {
	examId: string;
}

interface PrimaryCta {
	href: string;
	label: string;
	helperText: string;
	isDisabled: boolean;
}

function getPrimaryCta(exam: StudentExamPayload): PrimaryCta {
	if (exam.has_result) {
		return {
			href: `/student/exams/${exam.id}/result`,
			label: '결과 보기',
			helperText: '채점이 완료되어 결과 리포트를 다시 확인할 수 있습니다.',
			isDisabled: false,
		};
	}

	if (exam.is_completed) {
		return {
			href: `/student/exams/${exam.id}/result`,
			label: '채점 중',
			helperText: '제출은 완료되었습니다. 결과 생성이 끝나면 리포트가 열립니다.',
			isDisabled: true,
		};
	}

	if (exam.can_enter) {
		return {
			href: `/student/exams/${exam.id}/session`,
			label: '평가 입장하기',
			helperText: '아래 안내와 환경 점검을 확인한 뒤 입장하세요.',
			isDisabled: false,
		};
	}

	return {
		href: `/student/exams/${exam.id}/session`,
		label: '입장 불가',
		helperText: '아직 응시 시간이 아니거나 응시 가능 횟수가 남아 있지 않습니다.',
		isDisabled: true,
	};
}

function DetailStateCard({ children }: { children: ReactNode }) {
	return <PageShell>{children}</PageShell>;
}

export function StudentExamDetailPage({ examId }: StudentExamDetailPageProps) {
	const examQuery = useStudentExam(examId);
	const exam = examQuery.data;

	if (examQuery.isLoading) {
		return (
			<DetailStateCard>
				<StateBlock
					tone="loading"
					title="평가 정보를 불러오는 중입니다."
					description="입장 전 안내 문서를 준비하고 있습니다."
				/>
			</DetailStateCard>
		);
	}

	if (examQuery.isError) {
		return (
			<DetailStateCard>
				<StateBlock
					tone="error"
					title="평가 정보를 불러오지 못했습니다."
					description="네트워크 상태를 확인한 뒤 다시 시도해주세요."
					action={
						<Button size="sm" variant="outline" onPress={() => examQuery.refetch()}>
							다시 시도
						</Button>
					}
				/>
			</DetailStateCard>
		);
	}

	if (!exam) {
		return (
			<DetailStateCard>
				<StateBlock
					title="평가 정보를 찾을 수 없습니다."
					description="목록으로 돌아가 공개된 평가를 다시 선택해주세요."
				/>
			</DetailStateCard>
		);
	}

	const primaryCta = getPrimaryCta(exam);

	return (
		<PageShell>
			<PageHeader
				eyebrow="Student Workspace"
				title={exam.title}
				description={
					exam.description ?? '구술 평가 입장 전 시험 정보와 환경 점검, 평가 기준을 순서대로 확인하세요.'
				}
				actions={
					<>
						<LinkButton href="/student/exams" size="sm" variant="outline">
							목록으로
						</LinkButton>
						{primaryCta.isDisabled ? (
							<Button isDisabled variant="primary">
								{primaryCta.label}
							</Button>
						) : (
							<LinkButton href={primaryCta.href}>{primaryCta.label}</LinkButton>
						)}
					</>
				}
			/>

			<SurfaceCard className="flex flex-col gap-4 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
				<div className="space-y-3">
					<div className="flex flex-wrap items-center gap-2">
						<Chip color={getExamTypeColor(exam.exam_type)} size="sm" variant="soft">
							<Chip.Label>{getExamTypeLabel(exam.exam_type)}</Chip.Label>
						</Chip>
						<Chip color={getExamStatusColor(exam.status)} size="sm" variant="soft">
							<Chip.Label>{getExamStatusLabel(exam.status)}</Chip.Label>
						</Chip>
					</div>
					{exam.classroom_name ? (
						<p className="text-neutral-gray-500 text-sm font-medium">{exam.classroom_name}</p>
					) : null}
					<p className="text-neutral-gray-500 max-w-2xl text-sm leading-6">{primaryCta.helperText}</p>
				</div>
				<div
					className="border-border-subtle bg-surface-muted text-neutral-gray-500 rounded-2xl border px-4 py-3
						text-sm"
				>
					<p className="text-neutral-text font-semibold">입장 전 확인 순서</p>
					<p className="mt-1">시험 정보 → 환경 점검 → 평가 기준 → 안내사항</p>
				</div>
			</SurfaceCard>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
				<div className="space-y-6">
					<ExamInfoCard exam={exam} />
					<ExamEnvCheckCard />
					<ExamCriteriaCard criteria={exam.criteria} />
				</div>
				<div className="lg:sticky lg:top-6 lg:self-start">
					<ExamGuideCard />
				</div>
			</div>
		</PageShell>
	);
}
