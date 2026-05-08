'use client';

import { useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { type Classroom, useClassroomDetail } from '@/entities/classroom';
import { type User, useUsers } from '@/entities/user';
import { PageHeader, PageShell, StateBlock, SurfaceCard } from '@/shared/ui';
import { Button, Skeleton } from '@heroui/react';

import { ClassroomStudentsPanel } from './panel';

interface ClassroomStudentsManagementPageProps {
	classroomId: string;
	initialClassroom: Classroom | null;
	initialUsers: User[];
	isClassroomError: boolean;
	isUsersError: boolean;
	canManageStudents: boolean;
}

export function ClassroomStudentsManagementPage({
	classroomId,
	initialClassroom,
	initialUsers,
	isClassroomError,
	isUsersError,
	canManageStudents,
}: ClassroomStudentsManagementPageProps) {
	const router = useRouter();
	const classroomQuery = useClassroomDetail(classroomId, initialClassroom ?? undefined);
	const usersQuery = useUsers(initialUsers);
	const classroom = classroomQuery.data;
	const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);

	const enrolledIds = useMemo(() => new Set(classroom?.student_ids ?? []), [classroom?.student_ids]);
	const students = useMemo(
		() => users.filter((user) => classroom?.student_ids.includes(user.id)),
		[classroom?.student_ids, users],
	);
	const availableStudents = useMemo(
		() => users.filter((user) => user.role === 'student' && !user.is_deleted && !enrolledIds.has(user.id)),
		[enrolledIds, users],
	);
	const enrollmentStatus = students.length > 0 ? '운영 가능' : '초대 필요';
	const enrollmentDescription =
		students.length > 0
			? '등록 학생 기준으로 강의실 운영을 시작할 수 있습니다.'
			: '학생을 초대해 강의실 운영 대상을 구성해주세요.';

	const handleBackToClassroom = () => {
		router.push(`/professor/classrooms/${classroomId}`);
	};

	if ((classroomQuery.isLoading && !initialClassroom) || (!classroom && !isClassroomError && !initialClassroom)) {
		return (
			<PageShell>
				<SurfaceCard className="space-y-6">
					<div className="space-y-3">
						<Skeleton className="h-4 w-36 rounded-lg" />
						<Skeleton className="h-8 w-48 rounded-lg" />
						<Skeleton className="h-4 w-64 rounded-lg" />
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						{Array.from({ length: 3 }).map((_, index) => (
							<Skeleton key={index} className="h-32 rounded-2xl" />
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
					action={
						<Button
							className="rounded-full"
							type="button"
							variant="secondary"
							onPress={handleBackToClassroom}
						>
							강의실로 돌아가기
						</Button>
					}
					description="강의실이 삭제되었거나 접근 권한이 변경되었을 수 있습니다."
					title="학생 관리 정보를 불러오지 못했습니다."
					tone="error"
				/>
			</PageShell>
		);
	}

	return (
		<PageShell>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<Button className="rounded-full" type="button" variant="ghost" onPress={handleBackToClassroom}>
					강의실로 돌아가기
				</Button>
				<p className="text-neutral-gray-500 text-sm">{classroom.name}</p>
			</div>

			<PageHeader
				description={`${classroom.name} · ${classroom.grade}학년 · ${classroom.semester} · ${classroom.section}반`}
				eyebrow="Student Operations Document"
				title="학생 관리"
			/>

			<SurfaceCard className="space-y-6">
				<section aria-labelledby="student-management-summary-heading" className="space-y-4">
					<div>
						<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.08em] uppercase">
							Operations Summary
						</p>
						<h2
							id="student-management-summary-heading"
							className="text-neutral-text mt-2 text-2xl font-semibold tracking-[-0.01em]"
						>
							등록 현황 요약
						</h2>
					</div>
					<dl className="grid gap-4 md:grid-cols-3">
						<div className="border-border-subtle bg-surface-muted rounded-2xl border p-5">
							<dt className="text-neutral-gray-500 text-sm font-medium">등록 학생</dt>
							<dd className="text-neutral-text mt-3 text-3xl font-semibold tracking-[-0.02em]">
								{students.length}명
							</dd>
							<dd className="text-neutral-gray-500 mt-2 text-sm">현재 강의실에 배정된 학생 수입니다.</dd>
						</div>
						<div className="border-border-subtle bg-surface-muted rounded-2xl border p-5">
							<dt className="text-neutral-gray-500 text-sm font-medium">초대 가능</dt>
							<dd className="text-neutral-text mt-3 text-3xl font-semibold tracking-[-0.02em]">
								{availableStudents.length}명
							</dd>
							<dd className="text-neutral-gray-500 mt-2 text-sm">
								아직 이 강의실에 등록되지 않은 활성 학생입니다.
							</dd>
						</div>
						<div className="border-brand-border bg-brand-soft rounded-2xl border p-5">
							<dt className="text-brand-deep text-sm font-medium">관리 진행률</dt>
							<dd className="text-neutral-text mt-3 text-3xl font-semibold tracking-[-0.02em]">
								{enrollmentStatus}
							</dd>
							<dd className="text-neutral-gray-700 mt-2 text-sm">
								{enrollmentDescription} 시험별 성적 대시보드는 후속 화면에서 연결됩니다.
							</dd>
						</div>
					</dl>
				</section>
			</SurfaceCard>

			<SurfaceCard>
				<ClassroomStudentsPanel
					canManageStudents={canManageStudents}
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
