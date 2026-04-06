'use client';

import { type Classroom, useClassroomDetail } from '@/entities/classroom';
import { type ClassroomMaterial, useClassroomMaterials } from '@/entities/classroom-material';
import { type Exam, useClassroomExams } from '@/entities/exam';
import { type User, useUsers } from '@/entities/user';
import { Card, Skeleton } from '@heroui/react';

import { ClassroomOverviewCard } from './detail/overview-card';
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
			<div className="bg-slate-50 px-6 py-10">
				<Card className="mx-auto max-w-6xl">
					<Card.Content className="space-y-6 py-8">
						<div className="space-y-3">
							<Skeleton className="h-4 w-32 rounded-lg" />
							<Skeleton className="h-8 w-56 rounded-lg" />
							<Skeleton className="h-4 w-40 rounded-lg" />
						</div>
						<div className="grid gap-4 md:grid-cols-3">
							{Array.from({ length: 3 }).map((_, index) => (
								<Card key={index} className="border border-slate-200 bg-slate-50">
									<Card.Content className="space-y-3 py-6">
										<Skeleton className="h-5 w-24 rounded-lg" />
										<Skeleton className="h-4 w-full rounded-lg" />
										<Skeleton className="h-4 w-4/5 rounded-lg" />
									</Card.Content>
								</Card>
							))}
						</div>
					</Card.Content>
				</Card>
			</div>
		);
	}

	if ((isClassroomError && !classroomQuery.isLoading && !classroom) || classroomQuery.isError || !classroom) {
		return (
			<div className="bg-slate-50 px-6 py-10">
				<Card className="mx-auto max-w-6xl">
					<Card.Content className="py-10 text-sm text-red-600">
						강의실 정보를 불러오지 못했습니다.
					</Card.Content>
				</Card>
			</div>
		);
	}

	const students = users.filter((user) => classroom.student_ids.includes(user.id));

	return (
		<div className="bg-slate-50 px-6 py-10">
			<div className="mx-auto flex max-w-6xl flex-col gap-6">
				<ClassroomOverviewCard
					classroom={classroom}
					courseWeeks={COURSE_WEEKS}
					examsCount={exams.length}
					materialsCount={materials.length}
				/>

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

				<Card>
					<Card.Content className="pt-6">
						<ClassroomStudentsPanel
							canManageStudents={canManageClassroom}
							classroomId={classroomId}
							isError={isUsersError || usersQuery.isError}
							isLoading={usersQuery.isLoading}
							students={students}
							users={users}
						/>
					</Card.Content>
				</Card>
			</div>
		</div>
	);
}
