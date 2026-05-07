'use client';

import { useId, useMemo, useState } from 'react';

import type { ClassroomMaterial } from '@/entities/classroom-material';
import type { ExamQuestion, UpdateExamQuestionRequest } from '@/entities/exam';
import { ApiClientError } from '@/shared/api/types';
import { Button, ErrorMessage } from '@heroui/react';

import {
	createAnswerKeyData,
	createAnswerOptionsData,
	createQuestionFormValues,
	createRubricData,
	splitLines,
} from '../lib/form';
import { useUpdateExamQuestion } from '../model/use-upsert-question';
import { UpsertExamQuestionFormFields } from './form-fields';
import { UpsertExamQuestionMaterialSelector } from './material-selector';

interface UpsertExamQuestionFormProps {
	classroomId: string;
	examId: string;
	materials: ClassroomMaterial[];
	question: ExamQuestion;
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
	const rubricCriteriaId = useId();
	const rubricEvidencePolicyId = useId();
	const answerOptionsId = useId();
	const correctOptionId = useId();
	const modelAnswerId = useId();
	const acceptableAnswersId = useId();
	const requiredKeywordsId = useId();
	const expectedPointsId = useId();
	const followUpQuestionsId = useId();
	const maxScoreId = useId();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const initialForm = useMemo(() => createQuestionFormValues(question), [question]);
	const initialQuestionType = question.question_type;
	const [form, setForm] = useState(initialForm);

	const updateQuestionMutation = useUpdateExamQuestion(classroomId, examId);
	const isPending = updateQuestionMutation.isPending;

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
		const normalizedQuestionText = form.questionText.trim();
		const normalizedIntentText = form.intentText.trim();
		const answerOptionsData =
			form.questionType === 'multiple_choice'
				? createAnswerOptionsData(form.answerOptions, form.correctOptionId).filter((option) => option.text)
				: [];
		const rubricData = createRubricData(form, parsedMaxScore);
		const answerKeyData = createAnswerKeyData({
			...form,
			answerOptions: answerOptionsData,
		});

		if (!Number.isInteger(parsedQuestionNumber) || parsedQuestionNumber <= 0) {
			setErrorMessage('문항 번호는 1 이상의 정수여야 합니다.');
			return;
		}

		if (!Number.isFinite(parsedMaxScore) || parsedMaxScore <= 0) {
			setErrorMessage('배점은 0보다 큰 숫자여야 합니다.');
			return;
		}

		if (!normalizedQuestionText) {
			setErrorMessage('문항을 입력해주세요.');
			return;
		}

		if (!normalizedIntentText) {
			setErrorMessage('평가 의도/범위를 입력해주세요.');
			return;
		}

		if (form.questionType === 'multiple_choice') {
			if (answerOptionsData.length < 2) {
				setErrorMessage('객관식은 보기를 2개 이상 입력해주세요.');
				return;
			}

			if (!form.correctOptionId || !answerOptionsData.some((option) => option.id === form.correctOptionId)) {
				setErrorMessage('객관식은 정답 option id를 정확히 1개 선택해주세요.');
				return;
			}
		}

		if (form.questionType === 'subjective' && !form.modelAnswerText.trim()) {
			setErrorMessage('주관식은 모범 답안을 입력해주세요.');
			return;
		}

		if (
			form.questionType === 'oral' &&
			splitLines(form.expectedPointsText).length === 0 &&
			rubricData.criteria.length === 0
		) {
			setErrorMessage('구술형은 기대 응답 포인트 또는 루브릭 기준을 입력해주세요.');
			return;
		}

		const legacyCorrectAnswerText =
			form.questionType === 'multiple_choice'
				? answerOptionsData.find((option) => option.id === form.correctOptionId)?.text || null
				: form.questionType === 'subjective'
					? form.modelAnswerText.trim()
					: null;

		const payload = {
			question_number: parsedQuestionNumber,
			max_score: parsedMaxScore,
			bloom_level: form.bloomLevel,
			difficulty: form.difficulty,
			question_text: normalizedQuestionText,
			intent_text: normalizedIntentText,
			rubric_text: form.rubricText.trim() || null,
			answer_options: answerOptionsData.map((option) => option.text),
			answer_options_data: answerOptionsData,
			answer_key_data: answerKeyData,
			rubric_data: rubricData,
			correct_answer_text: legacyCorrectAnswerText,
			source_material_ids: form.sourceMaterialIds,
			...(form.questionType !== initialQuestionType && form.questionType !== 'none'
				? { question_type: form.questionType }
				: {}),
		} satisfies UpdateExamQuestionRequest;

		try {
			await updateQuestionMutation.mutateAsync({
				payload,
				questionId: question.id,
			});

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
				acceptableAnswersId={acceptableAnswersId}
				answerOptionsId={answerOptionsId}
				correctOptionId={correctOptionId}
				expectedPointsId={expectedPointsId}
				followUpQuestionsId={followUpQuestionsId}
				form={form}
				intentTextId={intentTextId}
				maxScoreId={maxScoreId}
				modelAnswerId={modelAnswerId}
				onChange={setForm}
				onQuestionTypeChange={(questionType) => {
					setForm((prev) => {
						if (questionType === 'multiple_choice') {
							return {
								...prev,
								questionType,
								modelAnswerText: '',
								acceptableAnswersText: '',
								requiredKeywordsText: '',
								expectedPointsText: '',
								followUpQuestionsText: '',
								rubricCriteriaText: '',
							};
						}

						if (questionType === 'oral') {
							return {
								...prev,
								questionType,
								answerOptions: [],
								correctOptionId: '',
								modelAnswerText: '',
								acceptableAnswersText: '',
								requiredKeywordsText: '',
							};
						}

						return {
							...prev,
							questionType,
							answerOptions: [],
							correctOptionId: '',
							expectedPointsText: '',
							followUpQuestionsText: '',
						};
					});
				}}
				questionNumberId={questionNumberId}
				questionTextId={questionTextId}
				requiredKeywordsId={requiredKeywordsId}
				rubricCriteriaId={rubricCriteriaId}
				rubricEvidencePolicyId={rubricEvidencePolicyId}
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
