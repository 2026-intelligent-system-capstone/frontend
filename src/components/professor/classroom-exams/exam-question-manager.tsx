'use client';

import { useState } from 'react';

import type { ClassroomMaterial } from '@/types/classroom';
import type { Exam } from '@/types/exam';

import { useDeleteExamQuestion } from '@/lib/hooks/use-classrooms';

import { PlusIcon } from '@/components/professor/classroom-exams/exam-icons';
import { ExamQuestionEditorModal } from '@/components/professor/classroom-exams/exam-question-editor-modal';
import { ExamQuestionGenerationModal } from '@/components/professor/classroom-exams/exam-question-generation-modal';
import { ExamQuestionsTable } from '@/components/professor/classroom-exams/exam-questions-table';

interface ExamQuestionManagerProps {
	canManageExams: boolean;
	classroomId: string;
	exam: Exam;
	materials: ClassroomMaterial[];
}

export function ExamQuestionManager({ canManageExams, classroomId, exam, materials }: ExamQuestionManagerProps) {
	const deleteQuestionMutation = useDeleteExamQuestion(classroomId, exam.id);
	const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

	const handleDeleteQuestion = async (questionId: string) => {
		setDeletingQuestionId(questionId);
		try {
			await deleteQuestionMutation.mutateAsync(questionId);
		} finally {
			setDeletingQuestionId(null);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h3 className="text-lg font-semibold text-slate-900">문항 관리</h3>
					<p className="mt-2 text-sm text-slate-500">총 {exam.questions.length}개</p>
				</div>
				{canManageExams ? (
					<div className="flex flex-wrap gap-2">
						<ExamQuestionGenerationModal classroomId={classroomId} examId={exam.id} materials={materials} />
						<ExamQuestionEditorModal
							buttonAriaLabel={`${exam.title} 문항 추가`}
							buttonChildren={
								<>
									<PlusIcon className="size-4" />
									문항 추가
								</>
							}
							classroomId={classroomId}
							examId={exam.id}
							materials={materials}
							title="문항 추가"
						/>
					</div>
				) : null}
			</div>
			<ExamQuestionsTable
				canManageExams={canManageExams}
				classroomId={classroomId}
				deletingQuestionId={deletingQuestionId}
				exam={exam}
				isDeletePending={deleteQuestionMutation.isPending}
				materials={materials}
				onDeleteQuestion={(questionId) => void handleDeleteQuestion(questionId)}
			/>
		</div>
	);
}
