'use client';

import { useRouter } from 'next/navigation';

import type { Exam } from '@/entities/exam';
import { CreateExamModal } from '@/features/create-exam';
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
				<h2 className="text-lg font-semibold text-slate-900">시험 목록</h2>
				{canCreateExam ? <CreateExamModal classroomId={classroomId} week={actionWeek} /> : null}
			</div>

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
			) : isError ? (
				<p className="text-sm text-red-600">시험 목록을 불러오지 못했습니다.</p>
			) : (
				<ExamsTable exams={exams} onSelectExam={openExamDetail} />
			)}
		</div>
	);
}
