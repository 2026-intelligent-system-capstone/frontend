'use client';

import { useState } from 'react';

import { useStudentExams } from '@/entities/exam';
import type { ExamStatus, ExamType } from '@/entities/exam';
import { PageHeader, PageShell, StateBlock, SurfaceCard } from '@/shared/ui';
import { Button } from '@heroui/react';

import { ExamCard } from './exam-card';
import { ExamFilters } from './exam-filters';

export function StudentExamListPage() {
	const [statusFilter, setStatusFilter] = useState<ExamStatus | 'all'>('all');
	const [typeFilter, setTypeFilter] = useState<ExamType | 'all'>('all');
	const examsQuery = useStudentExams();
	const exams = examsQuery.data ?? [];

	const filtered = exams.filter((exam) => {
		if (statusFilter !== 'all' && exam.status !== statusFilter) return false;
		if (typeFilter !== 'all' && exam.exam_type !== typeFilter) return false;
		return true;
	});

	const enterableCount = exams.filter((exam) => exam.can_enter && !exam.is_completed && !exam.has_result).length;
	const pendingCount = exams.filter((exam) => exam.is_completed && !exam.has_result).length;
	const resultCount = exams.filter((exam) => exam.has_result).length;

	return (
		<PageShell>
			<PageHeader
				eyebrow="Student Workspace"
				title="나의 평가"
				description="응시 가능한 평가, 채점 중인 제출물, 결과 리포트를 한 곳에서 확인하세요."
			/>

			<SurfaceCard className="grid gap-4 p-4 sm:grid-cols-3 sm:p-5">
				<div className="border-brand/20 bg-brand-light rounded-2xl border p-4">
					<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.05em] uppercase">Ready</p>
					<p className="text-neutral-text mt-2 text-3xl font-semibold tracking-[-0.02em]">{enterableCount}</p>
					<p className="text-neutral-gray-500 mt-1 text-sm">지금 안내 확인 후 입장 가능</p>
				</div>
				<div className="border-border-subtle bg-surface-muted rounded-2xl border p-4">
					<p className="text-neutral-gray-500 font-mono text-xs font-semibold tracking-[0.05em] uppercase">
						Scoring
					</p>
					<p className="text-neutral-text mt-2 text-3xl font-semibold tracking-[-0.02em]">{pendingCount}</p>
					<p className="text-neutral-gray-500 mt-1 text-sm">제출 완료, 결과 생성 대기</p>
				</div>
				<div className="border-border-subtle bg-surface rounded-2xl border p-4">
					<p className="text-neutral-gray-500 font-mono text-xs font-semibold tracking-[0.05em] uppercase">
						Reports
					</p>
					<p className="text-neutral-text mt-2 text-3xl font-semibold tracking-[-0.02em]">{resultCount}</p>
					<p className="text-neutral-gray-500 mt-1 text-sm">재확인 가능한 결과 리포트</p>
				</div>
			</SurfaceCard>

			<ExamFilters
				statusFilter={statusFilter}
				typeFilter={typeFilter}
				onStatusChange={setStatusFilter}
				onTypeChange={setTypeFilter}
			/>

			{examsQuery.isLoading ? (
				<StateBlock
					tone="loading"
					title="평가 목록을 불러오는 중입니다."
					description="수강 중인 과목의 평가 일정을 확인하고 있습니다."
				/>
			) : examsQuery.isError ? (
				<StateBlock
					tone="error"
					title="평가 목록을 불러오지 못했습니다."
					description="네트워크 상태를 확인한 뒤 다시 시도해주세요."
					action={
						<Button size="sm" variant="outline" onPress={() => examsQuery.refetch()}>
							다시 시도
						</Button>
					}
				/>
			) : filtered.length === 0 ? (
				<StateBlock
					title="조건에 맞는 평가가 없습니다."
					description="필터를 조정하거나 교수자가 평가를 공개한 뒤 다시 확인해주세요."
				/>
			) : (
				<section className="grid gap-5 xl:grid-cols-2" aria-label="평가 목록">
					{filtered.map((exam) => (
						<ExamCard key={exam.id} exam={exam} />
					))}
				</section>
			)}
		</PageShell>
	);
}
