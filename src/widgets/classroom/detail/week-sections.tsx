import type { ClassroomMaterial } from '@/entities/classroom-material';
import type { Exam } from '@/entities/exam';
import { SurfaceCard } from '@/shared/ui';

import { ClassroomExamsPanel } from '../exams/panel';
import { ClassroomMaterialsPanel } from '../materials/panel';

interface ClassroomWeekSectionsProps {
	classroomId: string;
	materials: ClassroomMaterial[];
	exams: Exam[];
	isMaterialsError: boolean;
	isMaterialsLoading: boolean;
	isExamsError: boolean;
	isExamsLoading: boolean;
	canManageClassroom: boolean;
	courseWeeks: number;
}

export function ClassroomWeekSections({
	classroomId,
	materials,
	exams,
	isMaterialsError,
	isMaterialsLoading,
	isExamsError,
	isExamsLoading,
	canManageClassroom,
	courseWeeks,
}: ClassroomWeekSectionsProps) {
	const weekSections = Array.from({ length: courseWeeks }, (_, index) => {
		const week = index + 1;

		return {
			week,
			materials: materials.filter((material) => material.week === week),
			exams: exams.filter((exam) => exam.week === week),
		};
	});

	return (
		<SurfaceCard className="space-y-8">
			<div>
				<h2 className="text-neutral-text text-2xl font-semibold tracking-[-0.01em]">주차별 자료 · 시험 관리</h2>
				<p className="text-neutral-gray-500 mt-2 text-sm leading-6">
					각 주차에서 강의 자료와 시험을 함께 생성·관리합니다.
				</p>
			</div>
			<div className="space-y-6">
				{weekSections.map((section) => (
					<section
						key={section.week}
						className="border-border-subtle bg-surface-muted rounded-3xl border p-5 sm:p-6"
					>
						<div className="mb-6 flex flex-wrap items-start justify-between gap-4">
							<div>
								<h3 className="text-neutral-text text-lg font-semibold">{section.week}주차</h3>
								<p className="text-neutral-gray-500 mt-1 text-sm">
									자료 {section.materials.length}건 · 시험 {section.exams.length}건
								</p>
							</div>
						</div>
						<div className="flex flex-col space-y-4">
							<ClassroomMaterialsPanel
								actionWeek={section.week}
								canManageMaterials={canManageClassroom}
								classroomId={classroomId}
								isError={isMaterialsError}
								isLoading={isMaterialsLoading}
								materials={section.materials}
								showActions
							/>
							<ClassroomExamsPanel
								actionWeek={section.week}
								canManageExams={canManageClassroom}
								classroomId={classroomId}
								exams={section.exams}
								isError={isExamsError}
								isLoading={isExamsLoading}
								showActions
							/>
						</div>
					</section>
				))}
			</div>
		</SurfaceCard>
	);
}
