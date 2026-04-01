'use client';

import { Card, Skeleton, Tabs } from '@heroui/react';

import { dayjs, SEOUL_TIME_ZONE } from '@/lib/dayjs';

import { ClassroomMaterialsPanel } from '@/components/professor/classroom-materials-panel';
import { ClassroomStudentsPanel } from '@/components/professor/classroom-students-panel';
import {
	useClassroomDetail,
	useClassroomExams,
	useClassroomMaterials,
	useUsers,
} from '@/lib/hooks/use-classrooms';
import type { Classroom, ClassroomMaterial } from '@/types/classroom';
import type { Exam } from '@/types/exam';
import type { User } from '@/types/user';

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

const formatDateTime = (value: string) => {
	return dayjs.utc(value).tz(SEOUL_TIME_ZONE).format('YYYY.MM.DD HH:mm');
};

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

	if ((classroomQuery.isLoading && !initialClassroom) || (!classroomQuery.data && !isClassroomError && !initialClassroom)) {
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

	if ((isClassroomError && !classroomQuery.isLoading && !classroomQuery.data) || classroomQuery.isError || !classroomQuery.data) {
		return (
			<div className="bg-slate-50 px-6 py-10">
				<Card className="mx-auto max-w-6xl">
					<Card.Content className="py-10 text-sm text-red-600">강의실 정보를 불러오지 못했습니다.</Card.Content>
				</Card>
			</div>
		);
	}

	const classroom = classroomQuery.data;
	const users = usersQuery.data ?? [];
	const students = users.filter((user) => classroom.student_ids.includes(user.id));
	const materials = materialsQuery.data ?? [];
	const exams = examsQuery.data ?? [];
	const showExamSkeleton = examsQuery.isLoading && exams.length === 0;

	return (
		<div className="bg-slate-50 px-6 py-10">
			<div className="mx-auto flex max-w-6xl flex-col gap-6">
				<Card>
					<Card.Header className="gap-3">
						<div className="flex flex-wrap items-start justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-blue-600">Classroom Detail</p>
								<Card.Title className="mt-2 text-2xl font-semibold text-slate-900">{classroom.name}</Card.Title>
								<Card.Description className="mt-2 text-sm text-slate-500">
									{classroom.grade}학년 · {classroom.semester} · {classroom.section}반
								</Card.Description>
							</div>
							<div className="flex flex-wrap gap-2 text-xs font-medium">
								<span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">교수자 {classroom.professor_ids.length}명</span>
								<span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">학생 {classroom.student_ids.length}명</span>
								<span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
									자료 열람 {classroom.allow_student_material_access ? '허용' : '제한'}
								</span>
							</div>
						</div>
					</Card.Header>
					<Card.Content className="grid gap-4 md:grid-cols-3">
						<Card className="border border-slate-200 bg-slate-50">
							<Card.Header>
								<Card.Title className="text-base">강의실 소개</Card.Title>
							</Card.Header>
							<Card.Content className="text-sm text-slate-600">
								{classroom.description ?? '강의실 설명이 아직 없습니다.'}
							</Card.Content>
						</Card>
						<Card className="border border-slate-200 bg-slate-50">
							<Card.Header>
								<Card.Title className="text-base">자료/시험 현황</Card.Title>
							</Card.Header>
							<Card.Content className="space-y-2 text-sm text-slate-600">
								<p>자료 {materials.length}건</p>
								<p>시험 {exams.length}건</p>
							</Card.Content>
						</Card>
						<Card className="border border-slate-200 bg-slate-50">
							<Card.Header>
								<Card.Title className="text-base">구성원</Card.Title>
							</Card.Header>
							<Card.Content className="space-y-2 text-sm text-slate-600">
								<p>교수자 {classroom.professor_ids.length}명</p>
								<p>학생 {classroom.student_ids.length}명</p>
							</Card.Content>
						</Card>
					</Card.Content>
				</Card>

				<Card>
					<Card.Content>
						<Tabs>
							<Tabs.ListContainer>
								<Tabs.List aria-label="강의실 관리 탭">
									<Tabs.Tab id="materials">자료</Tabs.Tab>
									<Tabs.Tab id="exams">
										<Tabs.Separator />
										시험
									</Tabs.Tab>
									<Tabs.Tab id="students">
										<Tabs.Separator />
										학생
									</Tabs.Tab>
								</Tabs.List>
							</Tabs.ListContainer>

							<Tabs.Panel id="materials" className="pt-6">
								<ClassroomMaterialsPanel
									classroomId={classroomId}
									materials={materials}
									isError={isMaterialsError || materialsQuery.isError}
									isLoading={materialsQuery.isLoading}
									canManageMaterials={canManageClassroom}
								/>
							</Tabs.Panel>

							<Tabs.Panel id="exams" className="pt-6">
								<div className="space-y-4">
									<h2 className="text-lg font-semibold text-slate-900">시험 목록</h2>
									{showExamSkeleton ? (
										<div className="space-y-3">
											{Array.from({ length: 2 }).map((_, index) => (
												<Card key={index} className="border border-slate-200 bg-slate-50">
													<Card.Content className="space-y-2 py-4 text-sm text-slate-600">
														<Skeleton className="h-5 w-40 rounded-lg" />
														<Skeleton className="h-4 w-56 rounded-lg" />
														<Skeleton className="h-4 w-48 rounded-lg" />
														<Skeleton className="h-4 w-44 rounded-lg" />
													</Card.Content>
												</Card>
											))}
										</div>
									) : isExamsError || examsQuery.isError ? (
										<p className="text-sm text-red-600">시험 목록을 불러오지 못했습니다.</p>
									) : exams.length === 0 ? (
										<p className="text-sm text-slate-500">생성된 시험이 없습니다.</p>
									) : (
										<div className="grid gap-3">
											{exams.map((exam) => (
												<Card key={exam.id} className="border border-slate-200 bg-slate-50">
													<Card.Content className="space-y-2 py-4 text-sm text-slate-600">
														<p className="font-medium text-slate-900">{exam.title}</p>
														<p>{exam.description ?? '설명 없음'}</p>
														<p>
															{exam.exam_type} · {exam.duration_minutes}분 · {exam.status}
														</p>
														<p>시작: {formatDateTime(exam.starts_at)}</p>
													</Card.Content>
												</Card>
											))}
										</div>
									)}
								</div>
							</Tabs.Panel>

							<Tabs.Panel id="students" className="pt-6">
								<ClassroomStudentsPanel
									classroomId={classroomId}
									students={students}
									users={users}
									isLoading={usersQuery.isLoading}
									isError={isUsersError || usersQuery.isError}
									canManageStudents={canManageClassroom}
								/>
							</Tabs.Panel>
						</Tabs>
					</Card.Content>
				</Card>
			</div>
		</div>
	);
}
