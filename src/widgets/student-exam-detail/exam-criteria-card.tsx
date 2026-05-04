import type { ExamCriterion } from '@/entities/exam';
import { SurfaceCard } from '@/shared/ui';

interface ExamCriteriaCardProps {
	criteria: ExamCriterion[];
}

export function ExamCriteriaCard({ criteria }: ExamCriteriaCardProps) {
	if (criteria.length === 0) return null;

	return (
		<SurfaceCard className="space-y-5">
			<div className="space-y-2">
				<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.05em] uppercase">
					03 · Rubric
				</p>
				<h2 className="text-neutral-text text-xl font-semibold tracking-[-0.01em]">평가 기준</h2>
				<p className="text-neutral-gray-500 text-sm leading-6">
					답변은 아래 기준과 Bloom 역량 단계에 맞춰 평가됩니다.
				</p>
			</div>
			<div className="space-y-4">
				{[...criteria]
					.sort((a, b) => a.sort_order - b.sort_order)
					.map((criterion) => (
						<article
							key={criterion.id}
							className="border-border-subtle bg-surface-muted rounded-2xl border p-4"
						>
							<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
								<div>
									<h3 className="text-neutral-text font-semibold">{criterion.title}</h3>
									{criterion.description ? (
										<p className="text-neutral-gray-500 mt-1 text-sm leading-6">
											{criterion.description}
										</p>
									) : null}
								</div>
								<span
									className="border-brand-border bg-brand-soft text-brand-deep inline-flex w-fit rounded-full border px-3
										py-1 text-xs font-semibold"
								>
									가중치 {criterion.weight}%
								</span>
							</div>
							<div className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
								{criterion.excellent_definition && (
									<div className="border-brand-border bg-brand-soft rounded-xl border p-3">
										<p className="text-brand-deep mb-1 font-semibold">우수</p>
										<p className="text-neutral-gray-500 leading-5">
											{criterion.excellent_definition}
										</p>
									</div>
								)}
								{criterion.average_definition && (
									<div className="border-warning-soft bg-warning-soft rounded-xl border p-3">
										<p className="text-warning-text mb-1 font-semibold">보통</p>
										<p className="text-neutral-gray-500 leading-5">
											{criterion.average_definition}
										</p>
									</div>
								)}
								{criterion.poor_definition && (
									<div className="border-danger-soft bg-danger-soft rounded-xl border p-3">
										<p className="text-danger-text mb-1 font-semibold">미흡</p>
										<p className="text-neutral-gray-500 leading-5">{criterion.poor_definition}</p>
									</div>
								)}
							</div>
						</article>
					))}
			</div>
		</SurfaceCard>
	);
}
