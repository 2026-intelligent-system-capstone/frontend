import { Card } from '@heroui/react';
import type { ExamCriterion } from '@/entities/exam';

interface ExamCriteriaCardProps {
	criteria: ExamCriterion[];
}

export function ExamCriteriaCard({ criteria }: ExamCriteriaCardProps) {
	if (criteria.length === 0) return null;

	return (
		<Card className="border border-slate-200 bg-white">
			<Card.Header>
				<Card.Title className="text-base font-semibold text-slate-900">평가 기준</Card.Title>
				<Card.Description className="text-sm text-slate-500">
					아래 기준에 따라 답변이 평가됩니다.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div className="space-y-4">
					{[...criteria]
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
	);
}
