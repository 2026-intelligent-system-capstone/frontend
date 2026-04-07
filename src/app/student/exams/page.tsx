'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, Chip } from '@heroui/react';
import type { Exam, ExamStatus, ExamType } from '@/entities/exam';
import {
	formatExamDateTime,
	getExamStatusColor,
	getExamStatusLabel,
	getExamTypeColor,
	getExamTypeLabel,
} from '@/entities/exam';

const MOCK_EXAMS: (Exam & { classroom_name: string })[] = [
	{
		id: '1',
		classroom_id: 'c1',
		classroom_name: '데이터 과학 개론',
		title: '데이터 과학 개론 중간고사',
		description: '1-7주차 강의 내용 전반',
		exam_type: 'midterm',
		status: 'in_progress',
		duration_minutes: 40,
		week: 8,
		starts_at: '2026-04-07T09:00:00Z',
		ends_at: '2026-04-07T23:59:00Z',
		allow_retake: false,
		criteria: [],
		questions: [],
	},
	{
		id: '2',
		classroom_id: 'c2',
		classroom_name: '알고리즘',
		title: '알고리즘 3주차 퀴즈',
		description: '정렬 알고리즘 범위',
		exam_type: 'quiz',
		status: 'ready',
		duration_minutes: 20,
		week: 3,
		starts_at: '2026-04-10T10:00:00Z',
		ends_at: '2026-04-10T23:59:00Z',
		allow_retake: true,
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
		duration_minutes: 60,
		week: 16,
		starts_at: '2026-03-20T09:00:00Z',
		ends_at: '2026-03-20T23:59:00Z',
		allow_retake: false,
		criteria: [],
		questions: [],
	},
];

const STATUS_FILTERS: { label: string; value: ExamStatus | 'all' }[] = [
	{ label: '전체', value: 'all' },
	{ label: '진행 중', value: 'in_progress' },
	{ label: '준비', value: 'ready' },
	{ label: '종료', value: 'closed' },
];

const TYPE_FILTERS: { label: string; value: ExamType | 'all' }[] = [
	{ label: '전체', value: 'all' },
	{ label: '퀴즈', value: 'quiz' },
	{ label: '중간고사', value: 'midterm' },
	{ label: '기말고사', value: 'final' },
	{ label: '모의고사', value: 'mock' },
];

export default function StudentExamsPage() {
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
				{/* 헤더 */}
				<div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
					<p className="text-sm font-medium text-violet-600">Student Workspace</p>
					<h1 className="mt-2 text-2xl font-semibold text-slate-900">나의 평가</h1>
					<p className="mt-2 text-sm text-slate-500">수강 중인 과목의 평가 목록입니다.</p>
				</div>

				{/* 필터 */}
				<div className="flex flex-wrap gap-6">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-xs font-medium text-slate-500">상태</span>
						{STATUS_FILTERS.map((f) => (
							<Button
								key={f.value}
								size="sm"
								variant={statusFilter === f.value ? 'primary' : 'outline'}
								onPress={() => setStatusFilter(f.value)}
							>
								{f.label}
							</Button>
						))}
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-xs font-medium text-slate-500">유형</span>
						{TYPE_FILTERS.map((f) => (
							<Button
								key={f.value}
								size="sm"
								variant={typeFilter === f.value ? 'primary' : 'outline'}
								onPress={() => setTypeFilter(f.value)}
							>
								{f.label}
							</Button>
						))}
					</div>
				</div>

				{/* 시험 목록 */}
				{filtered.length === 0 ? (
					<Card>
						<Card.Content className="py-16 text-center text-sm text-slate-500">
							해당하는 평가가 없습니다.
						</Card.Content>
					</Card>
				) : (
					<div className="grid gap-4 xl:grid-cols-2">
						{filtered.map((exam) => (
							<Card key={exam.id} className="border border-slate-200 bg-white">
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
											<Card.Title className="text-base font-semibold text-slate-900">
												{exam.title}
											</Card.Title>
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
											<Button variant="primary" size="sm">
												입장하기
											</Button>
										</Link>
									)}
									{exam.status === 'ready' && (
										<Button variant="secondary" size="sm" isDisabled>
											시작 전
										</Button>
									)}
									{exam.status === 'closed' && (
										<Link href={`/student/exams/${exam.id}/result`}>
											<Button variant="outline" size="sm">
												결과 보기
											</Button>
										</Link>
									)}
								</Card.Footer>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
