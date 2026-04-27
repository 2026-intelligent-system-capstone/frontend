'use client';

import Link from 'next/link';

import { getExamStatusColor, getExamStatusLabel, getExamTypeColor, getExamTypeLabel } from '@/entities/exam';
import type { Exam } from '@/entities/exam';
import { Button, Chip } from '@heroui/react';

import { ExamEnvCheckCard } from './exam-env-check-card';
import { ExamGuideCard } from './exam-guide-card';
import { ExamInfoCard } from './exam-info-card';

const MOCK_EXAM: Exam & { classroom_name: string } = {
	id: '1',
	classroom_id: 'c1',
	classroom_name: '데이터 과학 개론',
	title: '데이터 과학 개론 중간고사',
	description: '1-7주차 강의 내용 전반에 걸쳐 데이터베이스, 인덱싱, 쿼리 최적화 등을 평가합니다.',
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
	criteria: [
		{
			id: 'cr1',
			title: '개념 이해도',
			description: '핵심 개념을 정확히 설명할 수 있는가',
			weight: 40,
			sort_order: 1,
			excellent_definition: '개념을 정확히 설명하고 예시를 들 수 있음',
			average_definition: '개념을 대략적으로 설명할 수 있음',
			poor_definition: '개념 설명이 불명확하거나 틀림',
		},
		{
			id: 'cr2',
			title: '문제 해결 능력',
			description: '주어진 상황에서 적절한 해결책을 제시할 수 있는가',
			weight: 35,
			sort_order: 2,
			excellent_definition: '최적의 해결책을 논리적으로 제시',
			average_definition: '적절한 해결책을 제시하나 설명 부족',
			poor_definition: '해결책 제시 불가 또는 부적절',
		},
		{
			id: 'cr3',
			title: '심층 사고력',
			description: '꼬리질문에 대해 깊이 있는 답변을 할 수 있는가',
			weight: 25,
			sort_order: 3,
			excellent_definition: '다각도로 분석하고 비판적 사고 가능',
			average_definition: '기본적인 추가 설명 가능',
			poor_definition: '추가 질문에 답변 어려움',
		},
	],
	questions: [],
};

interface StudentExamDetailPageProps {
	examId: string;
}

export function StudentExamDetailPage({ examId }: StudentExamDetailPageProps) {
	const exam = MOCK_EXAM;
	const canEnter = exam.status === 'in_progress';

	return (
		<div className="bg-slate-50 px-6 py-10">
			<div className="mx-auto flex max-w-6xl flex-col gap-6">
				<div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
					<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
						<div className="space-y-2">
							<p className="text-sm font-medium text-emerald-600">Student Workspace</p>
							<div className="flex flex-wrap items-center gap-2">
								<Chip color={getExamTypeColor(exam.exam_type)} size="sm" variant="soft">
									<Chip.Label>{getExamTypeLabel(exam.exam_type)}</Chip.Label>
								</Chip>
								<Chip color={getExamStatusColor(exam.status)} size="sm" variant="soft">
									<Chip.Label>{getExamStatusLabel(exam.status)}</Chip.Label>
								</Chip>
							</div>
							<p className="text-sm text-slate-400">{exam.classroom_name}</p>
							<h1 className="text-2xl font-semibold text-slate-900">{exam.title}</h1>
							{exam.description && <p className="text-sm text-slate-500">{exam.description}</p>}
						</div>
						<div className="flex shrink-0 flex-col items-end gap-2">
							<Link href={`/student/exams/${examId}/session`}>
								<Button isDisabled={!canEnter} variant="primary">
									평가 입장하기
								</Button>
							</Link>
							<Link href="/student/exams">
								<Button size="sm" variant="outline">
									목록으로
								</Button>
							</Link>
						</div>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<ExamInfoCard exam={exam} />
					<ExamGuideCard />
				</div>

				<ExamEnvCheckCard />
			</div>
		</div>
	);
}
