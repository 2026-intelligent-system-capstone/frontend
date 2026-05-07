'use client';

import { useMemo, useState } from 'react';

import { useInviteClassroomStudents, useRemoveClassroomStudent } from '@/entities/classroom';
import type { User } from '@/entities/user';
import { ApiClientError } from '@/shared/api/types';
import { StateBlock } from '@/shared/ui';
import { Card, Skeleton } from '@heroui/react';

import { StudentInviteModal } from './invite-modal';
import { StudentsTable } from './table';

interface ClassroomStudentsPanelProps {
	classroomId: string;
	students: User[];
	users: User[];
	isLoading: boolean;
	isError: boolean;
	canManageStudents: boolean;
}

export function ClassroomStudentsPanel({
	classroomId,
	students,
	users,
	isLoading,
	isError,
	canManageStudents,
}: ClassroomStudentsPanelProps) {
	const [isInviteOpen, setIsInviteOpen] = useState(false);
	const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { mutateAsync: inviteStudents, isPending: invitePending } = useInviteClassroomStudents(classroomId);
	const { mutate: removeStudent, isPending: removePending } = useRemoveClassroomStudent(classroomId);

	const enrolledIds = useMemo(() => new Set(students.map((student) => student.id)), [students]);
	const availableStudents = useMemo(
		() =>
			users.filter(
				(candidate) => candidate.role === 'student' && !candidate.is_deleted && !enrolledIds.has(candidate.id),
			),
		[enrolledIds, users],
	);

	const handleInviteOpenChange = (nextOpen: boolean) => {
		setIsInviteOpen(nextOpen);
		if (!nextOpen) {
			setErrorMessage(null);
			setSelectedStudentIds([]);
		}
	};

	const toggleStudentSelection = (studentId: string) => {
		setSelectedStudentIds((current) =>
			current.includes(studentId) ? current.filter((id) => id !== studentId) : [...current, studentId],
		);
	};

	const handleInvite = async (close: () => void) => {
		setErrorMessage(null);

		if (selectedStudentIds.length === 0) {
			setErrorMessage('초대할 학생을 한 명 이상 선택해주세요.');
			return;
		}

		try {
			await inviteStudents({ student_ids: selectedStudentIds });
			setSelectedStudentIds([]);
			close();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('학생 초대 중 오류가 발생했습니다.');
		}
	};

	return (
		<div id="students-management" className="scroll-mt-6 space-y-4 sm:scroll-mt-8">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-neutral-text text-lg font-semibold">학생 관리</h2>
					<p className="text-neutral-gray-500 mt-1 text-sm">
						강의실에 소속된 학생을 초대하거나 제거할 수 있습니다.
					</p>
				</div>
				{canManageStudents ? (
					<StudentInviteModal
						availableStudents={availableStudents}
						errorMessage={errorMessage}
						isOpen={isInviteOpen}
						isPending={invitePending}
						onInvite={handleInvite}
						onOpenChange={handleInviteOpenChange}
						onToggleStudentSelection={toggleStudentSelection}
						selectedStudentIds={selectedStudentIds}
					/>
				) : null}
			</div>

			{isLoading && students.length === 0 ? (
				<div className="grid gap-3 md:grid-cols-2">
					{Array.from({ length: 2 }).map((_, index) => (
						<Card key={index} className="border-border-subtle bg-surface border">
							<Card.Content className="space-y-3 py-4 text-sm text-slate-600">
								<div className="flex items-start justify-between gap-3">
									<div className="flex-1 space-y-2">
										<Skeleton className="h-5 w-24 rounded-lg" />
										<Skeleton className="h-4 w-20 rounded-lg" />
										<Skeleton className="h-4 w-32 rounded-lg" />
									</div>
									<Skeleton className="h-8 w-16 rounded-lg" />
								</div>
							</Card.Content>
						</Card>
					))}
				</div>
			) : isError ? (
				<StateBlock
					className="py-8"
					description="학생 초대와 구성원 상태를 확인할 수 없습니다."
					title="구성원 목록을 불러오지 못했습니다."
					tone="error"
				/>
			) : (
				<StudentsTable
					canManageStudents={canManageStudents}
					onRemoveStudent={removeStudent}
					removePending={removePending}
					students={students}
				/>
			)}
		</div>
	);
}
