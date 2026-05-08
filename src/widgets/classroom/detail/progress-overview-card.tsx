import type { ClassroomMaterial } from '@/entities/classroom-material';
import type { Exam } from '@/entities/exam';
import { SurfaceCard, cn } from '@/shared/ui';

interface ClassroomProgressOverviewCardProps {
	courseWeeks: number;
	materials: ClassroomMaterial[];
	exams: Exam[];
}

interface WeekSummary {
	week: number;
	materialsCount: number;
	examsCount: number;
	isEmpty: boolean;
}

export function ClassroomProgressOverviewCard({ courseWeeks, materials, exams }: ClassroomProgressOverviewCardProps) {
	const weekSummaries: WeekSummary[] = Array.from({ length: courseWeeks }, (_, index) => {
		const week = index + 1;
		const materialsCount = materials.filter((material) => material.week === week).length;
		const examsCount = exams.filter((exam) => exam.week === week).length;

		return {
			week,
			materialsCount,
			examsCount,
			isEmpty: materialsCount === 0 && examsCount === 0,
		};
	});

	const materialWeeksCount = weekSummaries.filter((summary) => summary.materialsCount > 0).length;
	const examWeeksCount = weekSummaries.filter((summary) => summary.examsCount > 0).length;
	const emptyWeeksCount = weekSummaries.filter((summary) => summary.isEmpty).length;

	return (
		<SurfaceCard className="space-y-6">
			<div className="space-y-2">
				<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.08em] uppercase">
					Course Progress
				</p>
				<div className="space-y-2">
					<h2 className="text-neutral-text text-2xl font-semibold tracking-[-0.01em]">진도현황</h2>
					<p className="text-neutral-gray-500 text-sm leading-6">
						주차를 선택하면 해당 운영 섹션으로 이동합니다.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
				{weekSummaries.map((summary) => (
					<a
						key={summary.week}
						aria-label={`${summary.week}주차로 이동`}
						className={cn(
							`group border-border-subtle bg-surface-muted focus-visible:outline-brand
							hover:border-brand-border hover:bg-brand-soft rounded-2xl border p-4 transition-colors
							focus-visible:outline-2 focus-visible:outline-offset-3`,
							!summary.isEmpty && 'border-brand-border bg-brand-soft',
						)}
						href={`#week-${summary.week}`}
					>
						<div className="flex items-start justify-between gap-2">
							<span
								className={cn(
									`text-neutral-gray-500 group-hover:border-brand-border group-hover:text-brand-deep
									flex size-8 items-center justify-center rounded-full border text-sm font-semibold
									transition-colors`,
									summary.isEmpty
										? 'border-border-subtle bg-surface text-neutral-gray-400'
										: 'border-brand-border bg-surface text-brand-deep',
								)}
							>
								{summary.week}
							</span>
							<span
								className={cn(
									'size-2 rounded-full',
									summary.isEmpty ? 'bg-neutral-gray-300' : 'bg-brand-deep',
								)}
							/>
						</div>
						<p
							className={cn(
								'mt-4 text-xs font-medium',
								summary.isEmpty ? 'text-neutral-gray-400' : 'text-brand-deep',
							)}
						>
							{summary.isEmpty
								? '비어 있음'
								: `자료 ${summary.materialsCount} · 시험 ${summary.examsCount}`}
						</p>
					</a>
				))}
			</div>

			<div
				className="border-border-subtle text-neutral-gray-500 flex flex-wrap gap-3 border-t pt-5 text-xs
					font-medium"
			>
				<LegendItem dotClassName="bg-emerald-500" label={`자료 등록 주차 ${materialWeeksCount}개`} />
				<LegendItem dotClassName="bg-brand-deep" label={`시험 등록 주차 ${examWeeksCount}개`} />
				<LegendItem dotClassName="bg-neutral-gray-300" label={`비어 있는 주차 ${emptyWeeksCount}개`} />
			</div>
		</SurfaceCard>
	);
}

interface LegendItemProps {
	dotClassName: string;
	label: string;
}

function LegendItem({ dotClassName, label }: LegendItemProps) {
	return (
		<span
			className="border-border-subtle bg-surface-muted inline-flex items-center gap-2 rounded-full border px-3
				py-1.5"
		>
			<span className={cn('size-2 rounded-full', dotClassName)} />
			{label}
		</span>
	);
}
