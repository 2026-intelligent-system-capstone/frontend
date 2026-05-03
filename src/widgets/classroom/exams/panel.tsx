'use client';

import { useRouter } from 'next/navigation';

import type { Exam } from '@/entities/exam';
import { CreateExamModal } from '@/features/create-exam';
import { StateBlock } from '@/shared/ui';
import { Card, Skeleton } from '@heroui/react';

import { ExamsTable } from './exams-table';

interface ClassroomExamsPanelProps {
	classroomId: string;
	exams: Exam[];
	isError: boolean;
	isLoading: boolean;
	canManageExams: boolean;
	showActions?: boolean;
	actionWeek?: number;
}

export function ClassroomExamsPanel({
	classroomId,
	exams,
	isError,
	isLoading,
	canManageExams,
	showActions = true,
	actionWeek,
}: ClassroomExamsPanelProps) {
	const router = useRouter();
	const showExamSkeleton = isLoading && exams.length === 0;
	const openExamDetail = (examId: string) => router.push(`/professor/classrooms/${classroomId}/exams/${examId}`);
	const canCreateExam = showActions && canManageExams && actionWeek !== undefined;

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="text-neutral-text text-lg font-semibold">시험 목록</h2>
				{canCreateExam ? <CreateExamModal classroomId={classroomId} week={actionWeek} /> : null}
			</div>

			{showExamSkeleton ? (
				<div className="space-y-3">
					{Array.from({ length: 2 }).map((_, index) => (
						<Card key={index} className="border-border-subtle bg-surface border">
							<Card.Content className="text-neutral-gray-500 space-y-2 py-4 text-sm">
								<Skeleton className="h-5 w-40 rounded-lg" />
								<Skeleton className="h-4 w-56 rounded-lg" />
								<Skeleton className="h-4 w-48 rounded-lg" />
								<Skeleton className="h-4 w-44 rounded-lg" />
							</Card.Content>
						</Card>
					))}
				</div>
			) : isError ? (
				<StateBlock
					className="py-8"
					description="시험 일정과 문항 현황을 확인할 수 없습니다."
					title="시험 목록을 불러오지 못했습니다."
					tone="error"
				/>
			) : (
				<ExamsTable exams={exams} onSelectExam={openExamDetail} />
			)}
		</div>
	);
}
