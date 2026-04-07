'use client';

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

const MOCK_EXAM: Exam & { classroom_name: string } = {
	id: '1',
	classroom_id: 'c1',
	classroom_name: '데이터 과학 개론',
	title: '데이터 과학 개론 중간고사',
	description: '1-7주차 강의 내용 전반에 걸쳐 데이터베이스, 인덱싱, 쿼리 최적화 등을 평가합니다.',
	exam_type: 'midterm',
	status: 'in_progress',
	duration_minutes: 40,
	week: 8,
	starts_at: '2026-04-07T09:00:00Z',
	ends_at: '2026-04-07T23:59:00Z',
	allow_retake: false,
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

export default function ExamDetailPage({ params }: { params: { examId: string } }) {
	const exam = MOCK_EXAM;
	const canEnter = exam.status === 'in_progress';

	return (
		<div className="bg-slate-50 px-6 py-10">
			<div className="mx-auto flex max-w-6xl flex-col gap-6">
				{/* 헤더 */}
				<div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
					<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
						<div className="space-y-2">
							<p className="text-sm font-medium text-violet-600">Student Workspace</p>
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
							{exam.description && (
								<p className="text-sm text-slate-500">{exam.description}</p>
							)}
						</div>
						<div className="flex shrink-0 flex-col items-end gap-2">
							<Link href={`/student/exams/${params.examId}/session`}>
								<Button variant="primary" isDisabled={!canEnter}>
									평가 입장하기
								</Button>
							</Link>
							<Link href="/student/exams">
								<Button variant="outline" size="sm">
									목록으로
								</Button>
							</Link>
						</div>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					{/* 시험 정보 */}
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
								<span className="font-medium text-slate-900">{exam.allow_retake ? '가능' : '불가'}</span>
							</div>
						</Card.Content>
					</Card>

					{/* 응시 안내 */}
					<Card className="border border-slate-200 bg-white">
						<Card.Header>
							<Card.Title className="text-base font-semibold text-slate-900">응시 안내</Card.Title>
						</Card.Header>
						<Card.Content className="space-y-2 text-sm text-slate-600">
							<p>• AI가 질문을 제시하면 자유롭게 답변하세요.</p>
							<p>• 답변에 따라 AI가 심층 꼬리질문을 이어갑니다.</p>
							<p>• 텍스트 또는 음성으로 답변할 수 있습니다.</p>
							<p>• 제한 시간 내에 모든 질문에 답변해주세요.</p>
							<p>• 평가 중 새로고침 시 진행 상황이 초기화될 수 있습니다.</p>
						</Card.Content>
					</Card>
				</div>

				{/* 평가 기준 */}
				{exam.criteria.length > 0 && (
					<Card className="border border-slate-200 bg-white">
						<Card.Header>
							<Card.Title className="text-base font-semibold text-slate-900">평가 기준</Card.Title>
							<Card.Description className="text-sm text-slate-500">
								아래 기준에 따라 답변이 평가됩니다.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div className="space-y-4">
								{exam.criteria
									.sort((a, b) => a.sort_order - b.sort_order)
									.map((criterion) => (
										<div key={criterion.id} className="rounded-xl border border-slate-100 p-4">
											<div className="mb-2 flex items-center justify-between">
												<span className="font-medium text-slate-900">{criterion.title}</span>
												<span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
													{criterion.weight}%
												</span>
											</div>
											{criterion.description && (
												<p className="mb-3 text-sm text-slate-500">{criterion.description}</p>
											)}
											<div className="grid gap-2 text-xs sm:grid-cols-3">
												{criterion.excellent_definition && (
													<div className="rounded-lg bg-emerald-50 p-2">
														<p className="mb-1 font-medium text-emerald-700">우수</p>
														<p className="text-emerald-600">{criterion.excellent_definition}</p>
													</div>
												)}
												{criterion.average_definition && (
													<div className="rounded-lg bg-amber-50 p-2">
														<p className="mb-1 font-medium text-amber-700">보통</p>
														<p className="text-amber-600">{criterion.average_definition}</p>
													</div>
												)}
												{criterion.poor_definition && (
													<div className="rounded-lg bg-red-50 p-2">
														<p className="mb-1 font-medium text-red-700">미흡</p>
														<p className="text-red-600">{criterion.poor_definition}</p>
													</div>
												)}
											</div>
										</div>
									))}
							</div>
						</Card.Content>
					</Card>
				)}
			</div>
		</div>
	);
}
