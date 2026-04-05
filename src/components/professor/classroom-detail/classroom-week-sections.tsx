import { Card } from '@heroui/react';

import type { ClassroomMaterial } from '@/types/classroom';
import type { Exam } from '@/types/exam';

import { ClassroomExamsPanel } from '@/components/professor/classroom-exams-panel';
import { ClassroomMaterialsPanel } from '@/components/professor/classroom-materials-panel';

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
		<Card>
			<Card.Header>
				<div>
					<Card.Title className="text-xl font-semibold text-slate-900">주차별 자료 · 시험 관리</Card.Title>
					<Card.Description className="mt-2 text-sm text-slate-500">
						각 주차에서 강의 자료와 시험을 함께 생성·관리합니다.
					</Card.Description>
				</div>
			</Card.Header>
			<Card.Content className="space-y-6">
				{weekSections.map((section) => (
					<Card key={section.week} className="border border-slate-200 bg-slate-50">
						<Card.Header className="flex flex-wrap items-start justify-between gap-4">
							<div>
								<Card.Title className="text-lg font-semibold text-slate-900">
									{section.week}주차
								</Card.Title>
								<Card.Description className="mt-1 text-sm text-slate-500">
									자료 {section.materials.length}건 · 시험 {section.exams.length}건
								</Card.Description>
							</div>
						</Card.Header>
						<Card.Content className="space-y-6">
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
						</Card.Content>
					</Card>
				))}
			</Card.Content>
		</Card>
	);
}
