'use client';

import { useState } from 'react';

import { Card, Skeleton } from '@heroui/react';

import type { ClassroomMaterial } from '@/types/classroom';
import type { Exam } from '@/types/exam';

import { ExamDetailModal } from '@/components/professor/classroom-exams/exam-detail-modal';
import { ExamQuestionManager } from '@/components/professor/classroom-exams/exam-question-manager';
import { ExamsTable } from '@/components/professor/classroom-exams/exams-table';
import { ExamCreateModal } from '@/components/professor/exam-create-modal';

interface ClassroomExamsPanelProps {
	classroomId: string;
	exams: Exam[];
	materials: ClassroomMaterial[];
	isError: boolean;
	isLoading: boolean;
	canManageExams: boolean;
	showActions?: boolean;
	actionWeek?: number;
}

export function ClassroomExamsPanel({
	classroomId,
	exams,
	materials,
	isError,
	isLoading,
	canManageExams,
	showActions = true,
	actionWeek,
}: ClassroomExamsPanelProps) {
	const showExamSkeleton = isLoading && exams.length === 0;
	const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
	const selectedExam = exams.find((exam) => exam.id === selectedExamId) ?? null;
	const openExamDetail = (examId: string) => setSelectedExamId(examId);
	const canCreateExam = showActions && canManageExams && actionWeek !== undefined;

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="text-lg font-semibold text-slate-900">시험 목록</h2>
				{canCreateExam ? <ExamCreateModal classroomId={classroomId} week={actionWeek} /> : null}
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
				<>
					<ExamsTable exams={exams} onSelectExam={openExamDetail} />

					<ExamDetailModal
						exam={selectedExam}
						isOpen={selectedExam !== null}
						onOpenChange={(isOpen) => {
							if (!isOpen) {
								setSelectedExamId(null);
							}
						}}
					>
						{selectedExam ? (
							<ExamQuestionManager
								canManageExams={canManageExams}
								classroomId={classroomId}
								exam={selectedExam}
								materials={materials}
							/>
						) : null}
					</ExamDetailModal>
				</>
			)}
		</div>
	);
}
