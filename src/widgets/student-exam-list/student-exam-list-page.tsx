'use client';

import { useState } from 'react';

import type { Exam, ExamStatus, ExamType } from '@/entities/exam';
import { Card } from '@heroui/react';

import { ExamCard } from './exam-card';
import { ExamFilters } from './exam-filters';

const MOCK_EXAMS: (Exam & { classroom_name: string })[] = [
	{
		id: '1',
		classroom_id: 'c1',
		classroom_name: '데이터 과학 개론',
		title: '데이터 과학 개론 중간고사',
		description: '1-7주차 강의 내용 전반',
		exam_type: 'midterm',
		status: 'in_progress',
		generation_status: 'idle',
		generation_error: null,
		generation_job_id: null,
		generation_requested_at: null,
		generation_completed_at: null,
		duration_minutes: 40,
		week: 8,
		starts_at: '2026-04-07T09:00:00Z',
		ends_at: '2026-04-07T23:59:00Z',
		max_attempts: 1,
		criteria: [],
		questions: [],
	},
	{
		id: '2',
		classroom_id: 'c2',
		classroom_name: '알고리즘',
		title: '알고리즘 3주차 퀴즈',
		description: '정렬 알고리즘 범위',
		exam_type: 'weekly',
		status: 'ready',
		generation_status: 'idle',
		generation_error: null,
		generation_job_id: null,
		generation_requested_at: null,
		generation_completed_at: null,
		duration_minutes: 20,
		week: 3,
		starts_at: '2026-04-10T10:00:00Z',
		ends_at: '2026-04-10T23:59:00Z',
		max_attempts: 2,
		criteria: [],
		questions: [],
	},
	{
		id: '3',
		classroom_id: 'c3',
		classroom_name: '소프트웨어 공학',
		title: '소프트웨어 공학 기말고사',
		description: '전체 범위',
		exam_type: 'final',
		status: 'closed',
		generation_status: 'idle',
		generation_error: null,
		generation_job_id: null,
		generation_requested_at: null,
		generation_completed_at: null,
		duration_minutes: 60,
		week: 16,
		starts_at: '2026-03-20T09:00:00Z',
		ends_at: '2026-03-20T23:59:00Z',
		max_attempts: 1,
		criteria: [],
		questions: [],
	},
];

export function StudentExamListPage() {
	const [statusFilter, setStatusFilter] = useState<ExamStatus | 'all'>('all');
	const [typeFilter, setTypeFilter] = useState<ExamType | 'all'>('all');

	const filtered = MOCK_EXAMS.filter((exam) => {
		if (statusFilter !== 'all' && exam.status !== statusFilter) return false;
		if (typeFilter !== 'all' && exam.exam_type !== typeFilter) return false;
		return true;
	});

	return (
		<div className="bg-slate-50 px-6 py-10">
			<div className="mx-auto flex max-w-6xl flex-col gap-6">
				<div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
					<p className="text-sm font-medium text-violet-600">Student Workspace</p>
					<h1 className="mt-2 text-2xl font-semibold text-slate-900">나의 평가</h1>
					<p className="mt-2 text-sm text-slate-500">수강 중인 과목의 평가 목록입니다.</p>
				</div>

				<ExamFilters
					statusFilter={statusFilter}
					typeFilter={typeFilter}
					onStatusChange={setStatusFilter}
					onTypeChange={setTypeFilter}
				/>

				{filtered.length === 0 ? (
					<Card>
						<Card.Content className="py-16 text-center text-sm text-slate-500">
							해당하는 평가가 없습니다.
						</Card.Content>
					</Card>
				) : (
					<div className="grid gap-4 xl:grid-cols-2">
						{filtered.map((exam) => (
							<ExamCard key={exam.id} exam={exam} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
