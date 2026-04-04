'use client';

import type { ReactNode } from 'react';
import { useId, useMemo, useState } from 'react';

import { Button, ErrorMessage, Modal } from '@heroui/react';

import { ApiClientError } from '@/types/api';
import type { ClassroomMaterial } from '@/types/classroom';
import type { CreateExamQuestionRequest, ExamQuestion, UpdateExamQuestionRequest } from '@/types/exam';

import { createQuestionFormValues } from '@/lib/classrooms/exam-presentation';
import { useCreateExamQuestion, useUpdateExamQuestion } from '@/lib/hooks/use-classrooms';

import { ExamQuestionFormFields } from '@/components/professor/classroom-exams/exam-question-form-fields';
import { ExamQuestionMaterialSelector } from '@/components/professor/classroom-exams/exam-question-material-selector';

interface ExamQuestionEditorModalProps {
	buttonAriaLabel: string;
	buttonChildren: ReactNode;
	buttonIsIconOnly?: boolean;
	buttonVariant?: 'primary' | 'secondary';
	classroomId: string;
	examId: string;
	materials: ClassroomMaterial[];
	question?: ExamQuestion;
	title: string;
}

export function ExamQuestionEditorModal({
	buttonAriaLabel,
	buttonChildren,
	buttonIsIconOnly = false,
	buttonVariant = 'primary',
	classroomId,
	examId,
	materials,
	question,
	title,
}: ExamQuestionEditorModalProps) {
	const questionNumberId = useId();
	const questionTextId = useId();
	const scopeTextId = useId();
	const evaluationObjectiveId = useId();
	const answerKeyId = useId();
	const scoringCriteriaId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const initialForm = useMemo(() => createQuestionFormValues(question), [question]);
	const [form, setForm] = useState(initialForm);

	const createQuestionMutation = useCreateExamQuestion(classroomId, examId);
	const updateQuestionMutation = useUpdateExamQuestion(classroomId, examId);
	const isPending = createQuestionMutation.isPending || updateQuestionMutation.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		setIsOpen(nextOpen);
		setErrorMessage(null);
		setForm(initialForm);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, close: () => void) => {
		event.preventDefault();
		setErrorMessage(null);

		const payload = {
			question_number: Number(form.questionNumber),
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

			close();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('문항 저장 중 오류가 발생했습니다.');
		}
	};

	return (
		<Modal>
			<Button
				aria-label={buttonAriaLabel}
				isIconOnly={buttonIsIconOnly}
				variant={buttonVariant}
				onPress={() => setIsOpen(true)}
			>
				{buttonChildren}
			</Button>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-3xl">
						{({ close }) => (
							<>
								<Modal.CloseTrigger />
								<Modal.Header>
									<Modal.Heading>{title}</Modal.Heading>
								</Modal.Header>
								<Modal.Body className="p-6">
									<form className="space-y-4" onSubmit={(event) => handleSubmit(event, close)}>
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
											onChange={(nextIds) =>
												setForm((prev) => ({ ...prev, sourceMaterialIds: nextIds }))
											}
											sourceMaterialIds={form.sourceMaterialIds}
										/>

										{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

										<div className="flex justify-end gap-3">
											<Button type="button" variant="secondary" onPress={close}>
												취소
											</Button>
											<Button isPending={isPending} type="submit" variant="primary">
												저장
											</Button>
										</div>
									</form>
								</Modal.Body>
							</>
						)}
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}
