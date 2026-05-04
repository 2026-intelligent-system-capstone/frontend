'use client';

import { useId, useMemo, useState } from 'react';

import type { ClassroomMaterial } from '@/entities/classroom-material';
import type { CreateExamQuestionRequest, ExamQuestion, UpdateExamQuestionRequest } from '@/entities/exam';
import { ApiClientError } from '@/shared/api/types';
import { Button, ErrorMessage } from '@heroui/react';

import { createQuestionFormValues } from '../lib/form';
import { useCreateExamQuestion, useUpdateExamQuestion } from '../model/use-upsert-question';
import { UpsertExamQuestionFormFields } from './form-fields';
import { UpsertExamQuestionMaterialSelector } from './material-selector';

interface UpsertExamQuestionFormProps {
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

export function UpsertExamQuestionForm({
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
}: UpsertExamQuestionFormProps) {
	const questionNumberId = useId();
	const questionTextId = useId();
	const intentTextId = useId();
	const rubricTextId = useId();
	const answerOptionsId = useId();
	const correctAnswerTextId = useId();
	const maxScoreId = useId();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const initialForm = useMemo(() => createQuestionFormValues(question), [question]);
	const initialQuestionType = question?.question_type;
	const [form, setForm] = useState(initialForm);

	const createQuestionMutation = useCreateExamQuestion(classroomId, examId);
	const updateQuestionMutation = useUpdateExamQuestion(classroomId, examId);
	const isPending = createQuestionMutation.isPending || updateQuestionMutation.isPending;

	const normalizedAnswerOptions = form.answerOptionsText
		.split('\n')
		.map((option) => option.trim())
		.filter(Boolean);
	const normalizedCorrectAnswerText = form.correctAnswerText.trim();

	const handleCancel = () => {
		setErrorMessage(null);
		setForm(initialForm);
		onCancel?.();
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);

		const parsedQuestionNumber = Number(form.questionNumber);
		const parsedMaxScore = Number(form.maxScore);
		const normalizedRubricText = form.rubricText.trim();

		if (!Number.isInteger(parsedQuestionNumber) || parsedQuestionNumber <= 0) {
			setErrorMessage('문항 번호는 1 이상의 정수여야 합니다.');
			return;
		}

		if (!Number.isFinite(parsedMaxScore) || parsedMaxScore <= 0) {
			setErrorMessage('배점은 0보다 큰 숫자여야 합니다.');
			return;
		}

		if (form.questionType === 'oral' && !normalizedRubricText) {
			setErrorMessage('구술형은 루브릭을 입력해주세요.');
			return;
		}

		if (form.questionType === 'multiple_choice') {
			if (normalizedAnswerOptions.length < 2) {
				setErrorMessage('객관식은 학생에게 보여줄 보기를 2개 이상 입력해주세요.');
				return;
			}

			if (!normalizedCorrectAnswerText) {
				setErrorMessage('객관식은 정확한 정답 텍스트를 입력해주세요.');
				return;
			}

			if (!normalizedAnswerOptions.includes(normalizedCorrectAnswerText)) {
				setErrorMessage('객관식 정답은 학생에게 보여지는 보기 중 하나와 정확히 일치해야 합니다.');
				return;
			}
		}

		if (form.questionType === 'subjective' && !normalizedCorrectAnswerText) {
			setErrorMessage('주관식은 정확한 정답을 입력해주세요.');
			return;
		}

		const basePayload = {
			question_number: parsedQuestionNumber,
			max_score: parsedMaxScore,
			bloom_level: form.bloomLevel,
			difficulty: form.difficulty,
			question_text: form.questionText.trim(),
			intent_text: form.intentText.trim(),
			rubric_text: form.questionType === 'oral' ? normalizedRubricText : null,
			answer_options: form.questionType === 'multiple_choice' ? normalizedAnswerOptions : [],
			correct_answer_text: form.questionType === 'oral' ? null : normalizedCorrectAnswerText || null,
			source_material_ids: form.sourceMaterialIds,
		};

		try {
			if (question) {
				const payload = {
					...basePayload,
					...(form.questionType !== initialQuestionType && form.questionType !== 'none'
						? { question_type: form.questionType }
						: {}),
				} satisfies UpdateExamQuestionRequest;

				await updateQuestionMutation.mutateAsync({
					payload,
					questionId: question.id,
				});
			} else {
				if (form.questionType === 'none') {
					setErrorMessage('문제 유형을 선택해주세요.');
					return;
				}

				const payload = {
					...basePayload,
					question_type: form.questionType,
				} satisfies CreateExamQuestionRequest;

				await createQuestionMutation.mutateAsync(payload);
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
					<h3 className="text-neutral-text text-base font-semibold">{title}</h3>
					<p className="text-neutral-gray-500 mt-1 text-sm">
						문항 내용과 연결 자료를 현재 시험 문맥에서 바로 수정합니다.
					</p>
				</div>
			)}

			<UpsertExamQuestionFormFields
				answerOptionsId={answerOptionsId}
				correctAnswerTextId={correctAnswerTextId}
				form={form}
				intentTextId={intentTextId}
				maxScoreId={maxScoreId}
				onChange={setForm}
				onQuestionTypeChange={(questionType) => {
					setForm((prev) => {
						if (questionType === 'multiple_choice') {
							return { ...prev, questionType };
						}

						if (questionType === 'oral') {
							return {
								...prev,
								questionType,
								answerOptionsText: '',
								correctAnswerText: '',
							};
						}

						return {
							...prev,
							questionType,
							answerOptionsText: '',
						};
					});
				}}
				questionNumberId={questionNumberId}
				questionTextId={questionTextId}
				rubricTextId={rubricTextId}
			/>

			<UpsertExamQuestionMaterialSelector
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
