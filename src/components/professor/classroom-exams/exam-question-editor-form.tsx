'use client';

import { useId, useMemo, useState } from 'react';

import { Button, ErrorMessage } from '@heroui/react';

import { ApiClientError } from '@/types/api';
import type { ClassroomMaterial } from '@/types/classroom';
import type { CreateExamQuestionRequest, ExamQuestion, UpdateExamQuestionRequest } from '@/types/exam';

import { createQuestionFormValues } from '@/lib/classrooms/exam-presentation';
import { useCreateExamQuestion, useUpdateExamQuestion } from '@/lib/hooks/use-classrooms';

import { ExamQuestionFormFields } from '@/components/professor/classroom-exams/exam-question-form-fields';
import { ExamQuestionMaterialSelector } from '@/components/professor/classroom-exams/exam-question-material-selector';

interface ExamQuestionEditorFormProps {
	classroomId: string;
	examId: string;
	materials: ClassroomMaterial[];
	question?: ExamQuestion;
	title: string;
	formId?: string;
	hideActions?: boolean;
	hideHeader?: boolean;
	onCancel?: () => void;
	onSuccess?: () => void;
}

export function ExamQuestionEditorForm({
	classroomId,
	examId,
	materials,
	question,
	title,
	formId,
	hideActions = false,
	hideHeader = false,
	onCancel,
	onSuccess,
}: ExamQuestionEditorFormProps) {
	const questionNumberId = useId();
	const questionTextId = useId();
	const scopeTextId = useId();
	const evaluationObjectiveId = useId();
	const answerKeyId = useId();
	const scoringCriteriaId = useId();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const initialForm = useMemo(() => createQuestionFormValues(question), [question]);
	const [form, setForm] = useState(initialForm);

	const createQuestionMutation = useCreateExamQuestion(classroomId, examId);
	const updateQuestionMutation = useUpdateExamQuestion(classroomId, examId);
	const isPending = createQuestionMutation.isPending || updateQuestionMutation.isPending;

	const handleCancel = () => {
		setErrorMessage(null);
		setForm(initialForm);
		onCancel?.();
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);

		const parsedQuestionNumber = Number(form.questionNumber);

		if (!Number.isInteger(parsedQuestionNumber) || parsedQuestionNumber <= 0) {
			setErrorMessage('문항 번호는 1 이상의 정수여야 합니다.');
			return;
		}

		const payload = {
			question_number: parsedQuestionNumber,
			bloom_level: form.bloomLevel,
			difficulty: form.difficulty,
			question_text: form.questionText.trim(),
			scope_text: form.scopeText.trim(),
			evaluation_objective: form.evaluationObjective.trim(),
			answer_key: form.answerKey.trim(),
			scoring_criteria: form.scoringCriteria.trim(),
			source_material_ids: form.sourceMaterialIds,
		};

		try {
			if (question) {
				await updateQuestionMutation.mutateAsync({
					payload: payload satisfies UpdateExamQuestionRequest,
					questionId: question.id,
				});
			} else {
				await createQuestionMutation.mutateAsync(payload satisfies CreateExamQuestionRequest);
			}

			onSuccess?.();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('문항 저장 중 오류가 발생했습니다.');
		}
	};

	return (
		<form className="space-y-4" id={formId} onSubmit={handleSubmit}>
			{hideHeader ? null : (
				<div>
					<h3 className="text-base font-semibold text-slate-900">{title}</h3>
					<p className="mt-1 text-sm text-slate-500">
						문항 내용과 연결 자료를 현재 시험 문맥에서 바로 수정합니다.
					</p>
				</div>
			)}

			<ExamQuestionFormFields
				answerKeyId={answerKeyId}
				evaluationObjectiveId={evaluationObjectiveId}
				form={form}
				onChange={setForm}
				questionNumberId={questionNumberId}
				questionTextId={questionTextId}
				scopeTextId={scopeTextId}
				scoringCriteriaId={scoringCriteriaId}
			/>

			<ExamQuestionMaterialSelector
				materials={materials}
				onChange={(nextIds) => setForm((prev) => ({ ...prev, sourceMaterialIds: nextIds }))}
				sourceMaterialIds={form.sourceMaterialIds}
			/>

			{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

			{hideActions ? null : (
				<div className="flex justify-end gap-3">
					<Button type="button" variant="secondary" onPress={handleCancel}>
						닫기
					</Button>
					<Button isPending={isPending} type="submit" variant="primary">
						저장
					</Button>
				</div>
			)}
		</form>
	);
}
