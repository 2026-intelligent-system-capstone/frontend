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
	hasMaterials: boolean;
	hasExams: boolean;
	hasContent: boolean;
}

export function ClassroomProgressOverviewCard({ courseWeeks, materials, exams }: ClassroomProgressOverviewCardProps) {
	const weekSummaries = Array.from({ length: courseWeeks }, (_, index): WeekSummary => {
		const week = index + 1;
		const materialsCount = materials.filter((material) => material.week === week).length;
		const examsCount = exams.filter((exam) => exam.week === week).length;
		const hasMaterials = materialsCount > 0;
		const hasExams = examsCount > 0;

		return {
			week,
			materialsCount,
			examsCount,
			hasMaterials,
			hasExams,
			hasContent: hasMaterials || hasExams,
		};
	});

	const materialWeeksCount = weekSummaries.filter((summary) => summary.hasMaterials).length;
	const examWeeksCount = weekSummaries.filter((summary) => summary.hasExams).length;
	const emptyWeeksCount = weekSummaries.filter((summary) => !summary.hasContent).length;

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
							`focus-visible:outline-brand group rounded-2xl border p-4 transition-colors
							focus-visible:outline-2 focus-visible:outline-offset-3`,
							summary.hasContent
								? 'border-brand-border bg-brand-soft hover:border-brand-deep/30 hover:bg-emerald-50'
								: 'border-border-subtle bg-surface-muted hover:border-border-medium hover:bg-surface',
						)}
						href={`#week-${summary.week}`}
					>
						<div className="flex items-start justify-between gap-2">
							<span
								className={cn(
									`flex size-8 items-center justify-center rounded-full text-sm font-semibold
									transition-colors`,
									summary.hasContent
										? 'bg-brand-deep text-white group-hover:bg-emerald-700'
										: `bg-surface text-neutral-gray-400 border-border-subtle
											group-hover:text-neutral-gray-600 border`,
								)}
							>
								{summary.week}
							</span>
							<span className="flex gap-1" aria-hidden="true">
								<span
									className={cn(
										'size-2 rounded-full',
										summary.hasMaterials ? 'bg-brand-deep' : 'bg-neutral-gray-300',
									)}
								/>
								<span
									className={cn(
										'size-2 rounded-full',
										summary.hasExams ? 'bg-emerald-400' : 'bg-neutral-gray-300',
									)}
								/>
							</span>
						</div>
						<p
							className={cn(
								'mt-4 text-xs leading-5 font-medium',
								summary.hasContent ? 'text-brand-deep' : 'text-neutral-gray-400',
							)}
						>
							{summary.hasContent
								? `자료 ${summary.materialsCount} · 시험 ${summary.examsCount}`
								: '비어 있음'}
						</p>
					</a>
				))}
			</div>

			<div
				className="border-border-subtle text-neutral-gray-500 flex flex-wrap gap-3 border-t pt-5 text-xs
					font-medium"
			>
				<LegendItem dotClassName="bg-brand-deep" label={`자료 등록 주차 ${materialWeeksCount}주`} />
				<LegendItem dotClassName="bg-emerald-400" label={`시험 등록 주차 ${examWeeksCount}주`} />
				<LegendItem dotClassName="bg-neutral-gray-300" label={`비어 있는 주차 ${emptyWeeksCount}주`} />
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
		<span className="bg-surface-muted inline-flex items-center gap-2 rounded-full px-3 py-1.5">
			<span className={cn('size-2 rounded-full', dotClassName)} />
			{label}
		</span>
	);
}
