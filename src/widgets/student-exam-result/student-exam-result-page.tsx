'use client';

import type { ReactElement, ReactNode } from 'react';

import {
	type ExamCriterionResult,
	type StudentExamResult,
	type TopicAssessment,
	getBloomLevelColor,
	getBloomLevelLabel,
	useStudentExamResults,
	useStudentExamSessionResult,
} from '@/entities/exam';
import { ApiClientError } from '@/shared/api/types';
import { LinkButton, PageHeader, PageShell, StateBlock, SurfaceCard, cn } from '@/shared/ui';
import { Chip } from '@heroui/react';

import { BloomBar } from './bloom-bar';

interface StudentExamResultPageProps {
	examId: string;
	finalizeStatus: string | null;
	sessionId: string | null;
}

function getSubmittedAtTime(result: StudentExamResult): number {
	if (!result.submitted_at) return 0;

	const submittedAtTime = new Date(result.submitted_at).getTime();
	return Number.isFinite(submittedAtTime) ? submittedAtTime : 0;
}

function getLatestResult(results: StudentExamResult[]): StudentExamResult | null {
	if (results.length === 0) return null;

	return [...results].sort((left, right) => getSubmittedAtTime(right) - getSubmittedAtTime(left))[0];
}

function getFinalizePendingStorageKey(examId: string, sessionId: string): string {
	return `student-exam-finalize-pending:${examId}:${sessionId}`;
}

function getErrorMessage(error: unknown): string {
	if (error instanceof ApiClientError) {
		if (error.status === 401) return '로그인이 필요합니다. 다시 로그인한 뒤 결과를 확인해주세요.';
		if (error.status === 403) return '이 평가 결과를 확인할 권한이 없습니다.';
		if (error.status === 404) return '평가 결과를 찾을 수 없습니다. 결과 생성이 아직 완료되지 않았을 수 있습니다.';
		return error.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return '평가 결과를 불러오지 못했습니다.';
}

function getScoreClassName(score: number | null): string {
	if (score === null) return 'text-neutral-gray-500';
	if (score >= 80) return 'text-brand-deep';
	if (score >= 60) return 'text-amber-700';
	return 'text-red-700';
}

function LoadingState(): ReactElement {
	return (
		<ResultShell>
			<StateBlock
				tone="loading"
				title="평가 결과를 불러오는 중입니다."
				description="Bloom 역량 리포트와 종합 피드백을 준비하고 있습니다."
			/>
		</ResultShell>
	);
}

function EmptyState(): ReactElement {
	return (
		<ResultShell>
			<StateBlock title="확인할 평가 결과가 없습니다." description="시험을 완료한 뒤 결과를 다시 확인해주세요." />
		</ResultShell>
	);
}

function ErrorState({ error }: { error: unknown }): ReactElement {
	return (
		<ResultShell>
			<StateBlock tone="error" title="평가 결과를 불러오지 못했습니다." description={getErrorMessage(error)} />
		</ResultShell>
	);
}

function FinalizePendingState({ message }: { message: string | null }): ReactElement {
	return (
		<ResultShell>
			<StateBlock
				tone="disabled"
				title="평가 결과를 생성하는 중입니다."
				description={
					message ?? '결과 생성 요청이 완료되지 않아 결과가 준비되는 중입니다. 잠시 후 다시 확인해주세요.'
				}
			/>
		</ResultShell>
	);
}

function PendingState({ result }: { result: StudentExamResult }): ReactElement {
	const examTitle = result.exam_title ?? '평가 결과';
	const classroomName = result.classroom_name ?? 'Student Workspace';

	return (
		<ResultShell>
			<SurfaceCard className="space-y-4 border-amber-200 bg-amber-50">
				<p className="font-mono text-xs font-semibold tracking-[0.05em] text-amber-700 uppercase">
					Scoring in progress
				</p>
				<div className="space-y-2">
					<p className="text-sm font-medium text-amber-800">{classroomName}</p>
					<h1 className="text-2xl font-semibold tracking-[-0.02em] text-amber-950">{examTitle}</h1>
					<p className="text-sm leading-6 text-amber-800">
						평가 결과를 생성하는 중입니다. 점수와 피드백이 준비되면 결과 리포트가 표시됩니다.
					</p>
				</div>
			</SurfaceCard>
		</ResultShell>
	);
}

function ResultShell({ children }: { children: ReactNode }): ReactElement {
	return (
		<PageShell>
			{children}
			<div className="flex justify-end gap-3">
				<LinkButton href="/student/exams" variant="outline">
					목록으로
				</LinkButton>
			</div>
		</PageShell>
	);
}

function FeedbackList({ items, tone }: { items: string[]; tone: 'strength' | 'weakness' }): ReactElement {
	const isStrength = tone === 'strength';
	const title = isStrength ? '강점' : '개선 필요';
	const emptyMessage = isStrength ? '제공된 강점 피드백이 없습니다.' : '제공된 개선 피드백이 없습니다.';

	return (
		<SurfaceCard
			className={cn('space-y-4', isStrength ? 'border-brand/20 bg-brand-light' : 'border-red-200 bg-red-50')}
		>
			<div>
				<p
					className={cn(
						'font-mono text-xs font-semibold tracking-[0.05em] uppercase',
						isStrength ? 'text-brand-deep' : 'text-red-700',
					)}
				>
					Feedback
				</p>
				<h2
					className={cn(
						'mt-2 text-xl font-semibold tracking-[-0.01em]',
						isStrength ? 'text-neutral-text' : 'text-red-950',
					)}
				>
					{title}
				</h2>
			</div>
			{items.length > 0 ? (
				<ul className="space-y-3">
					{items.map((item) => (
						<li
							key={item}
							className={cn(
								'flex items-start gap-3 text-sm leading-6',
								isStrength ? 'text-brand-deep' : 'text-red-800',
							)}
						>
							<span aria-hidden="true" className="mt-1 size-1.5 shrink-0 rounded-full bg-current" />
							<span>{item}</span>
						</li>
					))}
				</ul>
			) : (
				<p className={cn('text-sm leading-6', isStrength ? 'text-brand-deep' : 'text-red-800')}>
					{emptyMessage}
				</p>
			)}
		</SurfaceCard>
	);
}

function TopicAssessments({ assessments }: { assessments: TopicAssessment[] }): ReactElement | null {
	if (assessments.length === 0) return null;

	return (
		<SurfaceCard className="space-y-5">
			<div className="space-y-2">
				<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.05em] uppercase">
					Bloom competency
				</p>
				<h2 className="text-neutral-text text-xl font-semibold tracking-[-0.01em]">Bloom 역량 분석</h2>
				<p className="text-neutral-gray-500 text-sm leading-6">
					각 토픽의 이해 수준을 Bloom의 인지 단계 기준으로 정리했습니다.
				</p>
			</div>
			<div className="space-y-5">
				{assessments.map((assessment) => (
					<article
						key={`${assessment.topic}-${assessment.reasoning}`}
						className="border-border-subtle bg-surface-muted rounded-2xl border p-4"
					>
						<div className="mb-3 flex items-center justify-between gap-3">
							<h3 className="text-neutral-text text-sm font-semibold">{assessment.topic}</h3>
							{assessment.bloom_level_achieved && (
								<Chip
									color={getBloomLevelColor(assessment.bloom_level_achieved)}
									size="sm"
									variant="soft"
								>
									<Chip.Label>{getBloomLevelLabel(assessment.bloom_level_achieved)}</Chip.Label>
								</Chip>
							)}
						</div>
						<BloomBar level={assessment.bloom_level_achieved} />
						<p className="text-neutral-gray-500 mt-3 text-sm leading-6">{assessment.reasoning}</p>
					</article>
				))}
			</div>
		</SurfaceCard>
	);
}

function CriteriaResults({ criteriaResults }: { criteriaResults: ExamCriterionResult[] }): ReactElement {
	return (
		<SurfaceCard className="space-y-5">
			<div className="space-y-2">
				<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.05em] uppercase">
					Rubric detail
				</p>
				<h2 className="text-neutral-text text-xl font-semibold tracking-[-0.01em]">평가 기준별 상세 결과</h2>
			</div>
			<div className="space-y-4">
				{criteriaResults.length > 0 ? (
					criteriaResults.map((criterion) => (
						<article
							key={criterion.criterion_id}
							className="border-border-subtle bg-surface-muted rounded-2xl border p-4"
						>
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<h3 className="text-neutral-text text-sm font-semibold">
									{criterion.title ?? '평가 기준'}
								</h3>
								<p
									className="bg-surface text-neutral-gray-500 ring-border-subtle rounded-full px-3
										py-1 text-xs font-semibold ring-1"
								>
									{criterion.score === null
										? '점수 산정 중'
										: `${criterion.score}${criterion.max_score ? ` / ${criterion.max_score}` : ''}`}
								</p>
							</div>
							<p className="text-neutral-gray-500 mt-3 text-sm leading-6">
								{criterion.feedback ?? '상세 피드백이 아직 제공되지 않았습니다.'}
							</p>
						</article>
					))
				) : (
					<p
						className="border-border-subtle bg-surface-muted text-neutral-gray-500 rounded-2xl border p-4
							text-sm"
					>
						평가 기준별 상세 결과는 아직 제공되지 않습니다.
					</p>
				)}
			</div>
		</SurfaceCard>
	);
}

function ImprovementSuggestions({ suggestions }: { suggestions: string[] }): ReactElement | null {
	if (suggestions.length === 0) return null;

	return (
		<SurfaceCard className="space-y-4 border-violet-200 bg-violet-50">
			<div>
				<p className="font-mono text-xs font-semibold tracking-[0.05em] text-violet-700 uppercase">
					Next review
				</p>
				<h2 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-violet-950">학습 개선 제안</h2>
			</div>
			<div className="space-y-3">
				{suggestions.map((suggestion) => (
					<div key={suggestion} className="flex items-start gap-3 text-sm leading-6 text-violet-800">
						<span className="mt-1 size-1.5 shrink-0 rounded-full bg-violet-500" aria-hidden="true" />
						<span>{suggestion}</span>
					</div>
				))}
			</div>
		</SurfaceCard>
	);
}

function CompletedResult({ result }: { result: StudentExamResult }): ReactElement {
	const examTitle = result.exam_title ?? '평가 결과';
	const classroomName = result.classroom_name ?? 'Student Workspace';
	const scoreClassName = getScoreClassName(result.overall_score);
	const strengths = result.strengths ?? [];
	const weaknesses = result.weaknesses ?? [];
	const criteriaResults = result.criteria_results ?? [];
	const improvementSuggestions = result.improvement_suggestions ?? [];
	const topicAssessments = result.topic_assessments ?? [];

	return (
		<ResultShell>
			<PageHeader
				eyebrow="Result report"
				title={examTitle}
				description={`${classroomName} 평가 결과입니다. Bloom 역량, 점수, 피드백, 재확인 액션을 순서대로 확인하세요.`}
				actions={
					<LinkButton href="/student/exams" variant="outline">
						평가 목록 재확인
					</LinkButton>
				}
			/>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<SurfaceCard className="space-y-4">
					<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.05em] uppercase">
						Summary
					</p>
					<h2 className="text-neutral-text text-xl font-semibold tracking-[-0.01em]">종합 평가</h2>
					<p className="text-neutral-gray-500 text-sm leading-7">
						{result.summary ?? '종합 평가 요약이 아직 제공되지 않았습니다.'}
					</p>
				</SurfaceCard>

				<SurfaceCard className="bg-surface-muted flex flex-col justify-between gap-5">
					<div>
						<p className="text-neutral-gray-500 font-mono text-xs font-semibold tracking-[0.05em] uppercase">
							Overall score
						</p>
						<p className={cn('mt-3 text-6xl font-semibold tracking-[-0.05em]', scoreClassName)}>
							{result.overall_score ?? '-'}
						</p>
						<p className="text-neutral-gray-500 text-sm font-medium">/ 100</p>
					</div>
					<p className="text-neutral-gray-500 text-sm leading-6">
						{result.overall_score === null
							? '점수는 아직 산정 중입니다. 결과 생성이 끝나면 이 영역에 표시됩니다.'
							: '점수는 아래 기준별 피드백과 함께 재확인하세요.'}
					</p>
				</SurfaceCard>
			</div>

			<TopicAssessments assessments={topicAssessments} />

			<div className="grid gap-6 md:grid-cols-2">
				<FeedbackList items={strengths} tone="strength" />
				<FeedbackList items={weaknesses} tone="weakness" />
			</div>

			<CriteriaResults criteriaResults={criteriaResults} />
			<ImprovementSuggestions suggestions={improvementSuggestions} />
		</ResultShell>
	);
}

function readFinalizePendingMessage(examId: string, sessionId: string | null): string | null {
	if (!sessionId || typeof window === 'undefined') return null;

	try {
		return sessionStorage.getItem(getFinalizePendingStorageKey(examId, sessionId));
	} catch {
		return null;
	}
}

export function StudentExamResultPage({ examId, finalizeStatus, sessionId }: StudentExamResultPageProps) {
	const shouldUseSessionResult = Boolean(sessionId);
	const isFinalizePending = finalizeStatus === 'pending';
	const sessionResultQuery = useStudentExamSessionResult(examId, sessionId);
	const resultsQuery = useStudentExamResults(examId, { enabled: !shouldUseSessionResult, refetchPending: true });
	const isLoading = shouldUseSessionResult ? sessionResultQuery.isLoading : resultsQuery.isLoading;
	const error = shouldUseSessionResult ? sessionResultQuery.error : resultsQuery.error;
	const isError = shouldUseSessionResult ? sessionResultQuery.isError : resultsQuery.isError;
	const result = shouldUseSessionResult
		? (sessionResultQuery.data ?? null)
		: getLatestResult(resultsQuery.data ?? []);

	if (isLoading) return <LoadingState />;
	if (isFinalizePending && (isError || !result)) {
		return <FinalizePendingState message={readFinalizePendingMessage(examId, sessionId)} />;
	}
	if (isError) return <ErrorState error={error} />;
	if (!result) return <EmptyState />;
	if (result.status === 'pending') return <PendingState result={result} />;
	return <CompletedResult result={result} />;
}
