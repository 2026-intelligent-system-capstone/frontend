'use client';

import { type Classroom, useClassroomDetail } from '@/entities/classroom';
import { type ClassroomMaterial, useClassroomMaterials } from '@/entities/classroom-material';
import { type Exam, useClassroomExams } from '@/entities/exam';
import { type User, useUsers } from '@/entities/user';
import { LinkButton, PageHeader, PageShell, StateBlock, SurfaceCard } from '@/shared/ui';
import { Skeleton } from '@heroui/react';

import { ClassroomOverviewCard } from './detail/overview-card';
import { ClassroomProgressOverviewCard } from './detail/progress-overview-card';
import { ClassroomWeekSections } from './detail/week-sections';
import { ClassroomStudentsPanel } from './students/panel';

interface ClassroomDetailPageProps {
	classroomId: string;
	initialClassroom: Classroom | null;
	initialMaterials: ClassroomMaterial[];
	initialExams: Exam[];
	initialUsers: User[];
	canManageClassroom: boolean;
	isClassroomError: boolean;
	isMaterialsError: boolean;
	isExamsError: boolean;
	isUsersError: boolean;
}

const COURSE_WEEKS = 16;

export function ClassroomDetailPage({
	classroomId,
	initialClassroom,
	initialMaterials,
	initialExams,
	initialUsers,
	canManageClassroom,
	isClassroomError,
	isMaterialsError,
	isExamsError,
	isUsersError,
}: ClassroomDetailPageProps) {
	const classroomQuery = useClassroomDetail(classroomId, initialClassroom ?? undefined);
	const materialsQuery = useClassroomMaterials(classroomId, initialMaterials);
	const examsQuery = useClassroomExams(classroomId, initialExams);
	const usersQuery = useUsers(initialUsers);
	const classroom = classroomQuery.data;
	const users = usersQuery.data ?? [];
	const materials = materialsQuery.data ?? [];
	const exams = examsQuery.data ?? [];

	if ((classroomQuery.isLoading && !initialClassroom) || (!classroom && !isClassroomError && !initialClassroom)) {
		return (
			<PageShell>
				<SurfaceCard className="space-y-6">
					<div className="space-y-3">
						<Skeleton className="h-4 w-32 rounded-lg" />
						<Skeleton className="h-8 w-56 rounded-lg" />
						<Skeleton className="h-4 w-40 rounded-lg" />
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
								className="border-border-subtle bg-surface-muted space-y-3 rounded-2xl border p-6"
							>
								<Skeleton className="h-5 w-24 rounded-lg" />
								<Skeleton className="h-4 w-full rounded-lg" />
								<Skeleton className="h-4 w-4/5 rounded-lg" />
							</div>
						))}
					</div>
				</SurfaceCard>
			</PageShell>
		);
	}

	if ((isClassroomError && !classroomQuery.isLoading && !classroom) || classroomQuery.isError || !classroom) {
		return (
			<PageShell>
				<StateBlock
					description="강의실이 삭제되었거나 접근 권한이 변경되었을 수 있습니다."
					title="강의실 정보를 불러오지 못했습니다."
					tone="error"
				/>
			</PageShell>
		);
	}

	const students = users.filter((user) => classroom.student_ids.includes(user.id));

	return (
		<PageShell>
			<PageHeader
				actions={
					<div className="flex flex-wrap items-center gap-3">
						<span className="text-neutral-gray-500 text-sm font-medium">학생 {students.length}명</span>
						<LinkButton href="#students-management" variant="secondary">
							학생 관리
						</LinkButton>
					</div>
				}
				description={`${classroom.grade}학년 · ${classroom.semester} · ${classroom.section}반`}
				eyebrow="Classroom Operations"
				title={classroom.name}
			/>

			<ClassroomOverviewCard
				classroom={classroom}
				courseWeeks={COURSE_WEEKS}
				examsCount={exams.length}
				materialsCount={materials.length}
			/>

			<ClassroomProgressOverviewCard courseWeeks={COURSE_WEEKS} exams={exams} materials={materials} />

			<ClassroomWeekSections
				canManageClassroom={canManageClassroom}
				classroomId={classroomId}
				courseWeeks={COURSE_WEEKS}
				exams={exams}
				isExamsError={isExamsError || examsQuery.isError}
				isExamsLoading={examsQuery.isLoading}
				isMaterialsError={isMaterialsError || materialsQuery.isError}
				isMaterialsLoading={materialsQuery.isLoading}
				materials={materials}
			/>

			<SurfaceCard>
				<ClassroomStudentsPanel
					canManageStudents={canManageClassroom}
					classroomId={classroomId}
					isError={isUsersError || usersQuery.isError}
					isLoading={usersQuery.isLoading}
					students={students}
					users={users}
				/>
			</SurfaceCard>
		</PageShell>
	);
}
