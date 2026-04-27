'use client';

import Link from 'next/link';
import { Button, Card, Chip } from '@heroui/react';
import { getBloomLevelColor, getBloomLevelLabel } from '@/entities/exam';
import type { BloomLevel, ExamResult } from '@/entities/exam';
import { BloomBar } from './bloom-bar';

interface TopicAssessment {
	topic: string;
	bloom_level_achieved: BloomLevel | null;
	reasoning: string;
}

interface ExamResultReport extends ExamResult {
	exam_title: string;
	classroom_name: string;
	topic_assessments: TopicAssessment[];
	strengths: string[];
	weaknesses: string[];
}

const MOCK_RESULT: ExamResultReport = {
	id: 'r1',
	exam_id: '1',
	session_id: 's1',
	student_id: 'dev-student',
	status: 'completed',
	submitted_at: '2026-04-07T11:30:00Z',
	overall_score: 78,
	summary:
		'데이터베이스 인덱싱에 대한 기본 개념은 잘 이해하고 있으나, 인덱스의 내부 동작 원리와 트레이드오프에 대한 심층적인 이해가 부족했습니다. 쿼리 최적화 방향은 올바르게 파악하고 있으며, 추가 학습을 통해 성능 분석 역량을 강화할 수 있을 것으로 기대됩니다.',
	topic_assessments: [
		{
			topic: '인덱스 기본 개념',
			bloom_level_achieved: 'understand',
			reasoning: '인덱스가 검색 속도를 향상시킨다는 개념은 정확히 설명했으나, 내부 B-Tree 구조에 대한 설명은 미흡했습니다.',
		},
		{
			topic: '쿼리 최적화',
			bloom_level_achieved: 'apply',
			reasoning: '실제 쿼리 상황에서 인덱스 적용 방법을 제시하고 예시를 들어 설명했습니다.',
		},
		{
			topic: '인덱스 트레이드오프',
			bloom_level_achieved: 'remember',
			reasoning: '쓰기 성능 저하에 대한 개념은 언급했으나 구체적인 원인 분석이 부족했습니다.',
		},
	],
	strengths: [
		'인덱스의 기본 목적과 사용 시점을 명확히 이해하고 있음',
		'쿼리 최적화 방향을 올바르게 제시함',
		'실제 사례를 들어 설명하는 능력이 우수함',
	],
	weaknesses: [
		'인덱스 내부 동작 원리(B-Tree, 페이지 분할 등)에 대한 이해 부족',
		'인덱스 과다 설정 시 쓰기 성능 저하 원인 분석 미흡',
		'꼬리질문에서 심층적인 추가 설명이 어려웠음',
	],
	exam_title: '데이터 과학 개론 중간고사',
	classroom_name: '데이터 과학 개론',
};

export function StudentExamResultPage() {
	const result: ExamResultReport = MOCK_RESULT;

	const scoreColor =
		(result.overall_score ?? 0) >= 80
			? 'text-emerald-600'
			: (result.overall_score ?? 0) >= 60
				? 'text-amber-600'
				: 'text-red-600';

	return (
		<div className="bg-slate-50 px-6 py-10">
			<div className="mx-auto flex max-w-6xl flex-col gap-6">
				<div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<p className="text-sm font-medium text-emerald-600">Student Workspace</p>
							<p className="mt-1 text-xs text-slate-400">{result.classroom_name}</p>
							<h1 className="mt-1 text-2xl font-semibold text-slate-900">{result.exam_title}</h1>
							<p className="mt-1 text-sm text-slate-500">평가 결과 리포트</p>
						</div>
						<div className="text-center">
							<p className="text-xs text-slate-500">종합 점수</p>
							<p className={`text-5xl font-bold ${scoreColor}`}>{result.overall_score ?? '-'}</p>
							<p className="text-xs text-slate-400">/ 100</p>
						</div>
					</div>
				</div>

				<Card className="border border-slate-200 bg-white">
					<Card.Header>
						<Card.Title className="text-base font-semibold text-slate-900">종합 평가</Card.Title>
					</Card.Header>
					<Card.Content>
						<p className="text-sm leading-relaxed text-slate-600">{result.summary}</p>
					</Card.Content>
				</Card>

				<div className="grid gap-6 md:grid-cols-2">
					<Card className="border border-emerald-100 bg-emerald-50">
						<Card.Header>
							<Card.Title className="text-base font-semibold text-emerald-800">강점</Card.Title>
						</Card.Header>
						<Card.Content className="space-y-2">
							{result.strengths.map((s, i) => (
								<div key={i} className="flex items-start gap-2 text-sm text-emerald-700">
									<span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
									<span>{s}</span>
								</div>
							))}
						</Card.Content>
					</Card>

					<Card className="border border-red-100 bg-red-50">
						<Card.Header>
							<Card.Title className="text-base font-semibold text-red-800">개선 필요</Card.Title>
						</Card.Header>
						<Card.Content className="space-y-2">
							{result.weaknesses.map((w, i) => (
								<div key={i} className="flex items-start gap-2 text-sm text-red-700">
									<span className="mt-0.5 shrink-0 text-red-400">△</span>
									<span>{w}</span>
								</div>
							))}
						</Card.Content>
					</Card>
				</div>

				<Card className="border border-slate-200 bg-white">
					<Card.Header>
						<Card.Title className="text-base font-semibold text-slate-900">토픽별 역량 분석</Card.Title>
						<Card.Description className="text-sm text-slate-500">
							Bloom의 인지 단계 기준으로 각 토픽의 이해 수준을 평가합니다.
						</Card.Description>
					</Card.Header>
					<Card.Content className="space-y-5">
						{result.topic_assessments.map((assessment, i) => (
							<div key={i} className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium text-slate-900">{assessment.topic}</span>
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
								<p className="text-xs text-slate-500">{assessment.reasoning}</p>
							</div>
						))}
					</Card.Content>
				</Card>

				<div className="flex justify-end gap-3">
					<Link href="/student/exams">
						<Button variant="outline">목록으로</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
