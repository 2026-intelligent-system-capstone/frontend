'use client';

import {
	type ExamQuestionFormValues,
	bloomLevelOptions,
	createDefaultMultipleChoiceOptions,
	difficultyOptions,
	questionTypeOptions,
} from '@/features/upsert-exam-question/lib/form';
import { Button, Input, Label, ListBox, Select, TextArea, TextField } from '@heroui/react';

interface UpsertExamQuestionFormFieldsProps {
	answerOptionsId: string;
	modelAnswerId: string;
	maxScoreId: string;
	questionNumberId: string;
	questionTextId: string;
	intentTextId: string;
	rubricTextId: string;
	acceptableAnswersId: string;
	requiredKeywordsId: string;
	expectedPointsId: string;
	followUpQuestionsId: string;
	rubricCriteriaId: string;
	evidencePolicyId: string;
	form: ExamQuestionFormValues;
	onChange: (updater: (prev: ExamQuestionFormValues) => ExamQuestionFormValues) => void;
	onQuestionTypeChange: (questionType: ExamQuestionFormValues['questionType']) => void;
}

export function UpsertExamQuestionFormFields({
	answerOptionsId,
	modelAnswerId,
	maxScoreId,
	questionNumberId,
	questionTextId,
	intentTextId,
	rubricTextId,
	acceptableAnswersId,
	requiredKeywordsId,
	expectedPointsId,
	followUpQuestionsId,
	rubricCriteriaId,
	evidencePolicyId,
	form,
	onChange,
	onQuestionTypeChange,
}: UpsertExamQuestionFormFieldsProps) {
	const renderedQuestionTypeOptions =
		form.questionType === 'none'
			? [{ label: '미지정', value: 'none' as const }, ...questionTypeOptions]
			: questionTypeOptions;
	const isSubjectiveQuestion = form.questionType === 'subjective';
	const isOralQuestion = form.questionType === 'oral';

	const renumberOptions = (options: ExamQuestionFormValues['answerOptions']) =>
		options.map((option, index) => {
			const label = String(index + 1);
			return {
				...option,
				id: label,
				label,
			};
		});

	const updateOptionText = (optionId: string, text: string) => {
		onChange((prev) => ({
			...prev,
			answerOptions: prev.answerOptions.map((option) => (option.id === optionId ? { ...option, text } : option)),
		}));
	};

	const addOption = () => {
		onChange((prev) => {
			const nextLabel = String(prev.answerOptions.length + 1);
			return {
				...prev,
				answerOptions: [...prev.answerOptions, { id: nextLabel, label: nextLabel, text: '' }],
			};
		});
	};

	const removeOption = (optionId: string) => {
		onChange((prev) => {
			const nextOptions = renumberOptions(prev.answerOptions.filter((option) => option.id !== optionId));
			const fallbackOptions = nextOptions.length > 0 ? nextOptions : createDefaultMultipleChoiceOptions();
			const removedCorrectOptionIndex = prev.answerOptions.findIndex((option) => option.id === optionId);
			const previousCorrectOptionIndex = prev.answerOptions.findIndex(
				(option) => option.id === prev.correctOptionId,
			);
			const nextCorrectOptionIndex =
				previousCorrectOptionIndex < 0 || previousCorrectOptionIndex === removedCorrectOptionIndex
					? 0
					: previousCorrectOptionIndex > removedCorrectOptionIndex
						? previousCorrectOptionIndex - 1
						: previousCorrectOptionIndex;

			return {
				...prev,
				answerOptions: fallbackOptions,
				correctOptionId: fallbackOptions[nextCorrectOptionIndex]?.id ?? fallbackOptions[0]?.id ?? '1',
			};
		});
	};

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<TextField isRequired className="w-full" name="question_number">
					<Label htmlFor={questionNumberId}>문항 번호</Label>
					<Input
						id={questionNumberId}
						min={1}
						type="number"
						value={form.questionNumber}
						onChange={(event) =>
							onChange((prev) => ({
								...prev,
								questionNumber: event.target.value,
							}))
						}
					/>
				</TextField>
				<Select
					className="w-full"
					value={form.questionType}
					onChange={(value) => {
						if (
							value === 'none' ||
							value === 'multiple_choice' ||
							value === 'subjective' ||
							value === 'oral'
						) {
							onQuestionTypeChange(value);
						}
					}}
				>
					<Label>문제 유형</Label>
					<Select.Trigger>
						<Select.Value />
						<Select.Indicator />
					</Select.Trigger>
					<Select.Popover>
						<ListBox>
							{renderedQuestionTypeOptions.map((option) => (
								<ListBox.Item key={option.value} id={option.value} textValue={option.label}>
									{option.label}
									<ListBox.ItemIndicator />
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
				</Select>
				<Select
					className="w-full"
					value={form.bloomLevel}
					onChange={(value) => {
						if (
							value === 'remember' ||
							value === 'understand' ||
							value === 'apply' ||
							value === 'analyze' ||
							value === 'evaluate' ||
							value === 'create'
						) {
							onChange((prev) => ({ ...prev, bloomLevel: value }));
						}
					}}
				>
					<Label>Bloom 단계</Label>
					<Select.Trigger>
						<Select.Value />
						<Select.Indicator />
					</Select.Trigger>
					<Select.Popover>
						<ListBox>
							{bloomLevelOptions.map((option) => (
								<ListBox.Item key={option.value} id={option.value} textValue={option.label}>
									{option.label}
									<ListBox.ItemIndicator />
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
				</Select>
				<Select
					className="w-full"
					value={form.difficulty}
					onChange={(value) => {
						if (value === 'easy' || value === 'medium' || value === 'hard') {
							onChange((prev) => ({ ...prev, difficulty: value }));
						}
					}}
				>
					<Label>난이도</Label>
					<Select.Trigger>
						<Select.Value />
						<Select.Indicator />
					</Select.Trigger>
					<Select.Popover>
						<ListBox>
							{difficultyOptions.map((option) => (
								<ListBox.Item key={option.value} id={option.value} textValue={option.label}>
									{option.label}
									<ListBox.ItemIndicator />
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
				</Select>
				<TextField isRequired className="w-full" name="max_score">
					<Label htmlFor={maxScoreId}>배점</Label>
					<Input
						id={maxScoreId}
						min={0.1}
						step="0.1"
						type="number"
						value={form.maxScore}
						onChange={(event) =>
							onChange((prev) => ({
								...prev,
								maxScore: event.target.value,
							}))
						}
					/>
				</TextField>
			</div>

			<TextField isRequired className="w-full" name="question_text">
				<Label htmlFor={questionTextId}>문항</Label>
				<TextArea
					id={questionTextId}
					className="min-h-28"
					value={form.questionText}
					onChange={(event) => onChange((prev) => ({ ...prev, questionText: event.target.value }))}
				/>
			</TextField>

			<TextField isRequired className="w-full" name="intent_text">
				<Label htmlFor={intentTextId}>평가 의도/범위</Label>
				<TextArea
					id={intentTextId}
					className="min-h-24"
					value={form.intentText}
					onChange={(event) => onChange((prev) => ({ ...prev, intentText: event.target.value }))}
				/>
			</TextField>

			{form.questionType === 'multiple_choice' ? (
				<div className="border-border-subtle bg-surface-muted space-y-3 rounded-2xl border p-4">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<Label htmlFor={answerOptionsId}>객관식 보기</Label>
							<p className="text-neutral-gray-500 mt-1 text-xs">
								정답은 번호 기반 option id로 저장됩니다.
							</p>
						</div>
						<Button size="sm" type="button" variant="secondary" onPress={addOption}>
							보기 추가
						</Button>
					</div>
					<div id={answerOptionsId} className="space-y-2">
						{form.answerOptions.map((option) => (
							<div key={option.id} className="grid gap-2 md:grid-cols-[auto_1fr_auto] md:items-center">
								<label className="text-neutral-gray-700 flex items-center gap-2 text-sm font-medium">
									<input
										checked={form.correctOptionId === option.id}
										name="correct_option_id"
										type="radio"
										onChange={() => onChange((prev) => ({ ...prev, correctOptionId: option.id }))}
									/>
									<span>{option.label}</span>
								</label>
								<Input
									aria-label={`${option.label}번 보기`}
									placeholder={`${option.label}번 보기 텍스트`}
									value={option.text}
									onChange={(event) => updateOptionText(option.id, event.target.value)}
								/>
								<Button size="sm" type="button" variant="ghost" onPress={() => removeOption(option.id)}>
									삭제
								</Button>
							</div>
						))}
					</div>
				</div>
			) : null}

			{isSubjectiveQuestion ? (
				<>
					<TextField isRequired className="w-full" name="model_answer">
						<Label htmlFor={modelAnswerId}>모범 답안</Label>
						<TextArea
							id={modelAnswerId}
							className="min-h-24"
							placeholder="단답 또는 model answer 중심으로 입력하세요."
							value={form.modelAnswer}
							onChange={(event) => onChange((prev) => ({ ...prev, modelAnswer: event.target.value }))}
						/>
					</TextField>
					<TextField className="w-full" name="acceptable_answers">
						<Label htmlFor={acceptableAnswersId}>허용 답안</Label>
						<TextArea
							id={acceptableAnswersId}
							className="min-h-24"
							placeholder="한 줄에 허용 답안 하나씩 입력하세요."
							value={form.acceptableAnswersText}
							onChange={(event) =>
								onChange((prev) => ({ ...prev, acceptableAnswersText: event.target.value }))
							}
						/>
					</TextField>
					<TextField className="w-full" name="required_keywords">
						<Label htmlFor={requiredKeywordsId}>필수 키워드</Label>
						<TextArea
							id={requiredKeywordsId}
							className="min-h-20"
							placeholder="한 줄에 키워드 하나씩 입력하세요."
							value={form.requiredKeywordsText}
							onChange={(event) =>
								onChange((prev) => ({ ...prev, requiredKeywordsText: event.target.value }))
							}
						/>
					</TextField>
				</>
			) : null}

			{isOralQuestion ? (
				<>
					<TextField className="w-full" name="expected_points">
						<Label htmlFor={expectedPointsId}>기대 답변 포인트</Label>
						<TextArea
							id={expectedPointsId}
							className="min-h-28"
							placeholder="한 줄에 기대 포인트 하나씩 입력하세요."
							value={form.expectedPointsText}
							onChange={(event) =>
								onChange((prev) => ({ ...prev, expectedPointsText: event.target.value }))
							}
						/>
					</TextField>
					<TextField className="w-full" name="follow_up_questions">
						<Label htmlFor={followUpQuestionsId}>꼬리질문 후보</Label>
						<TextArea
							id={followUpQuestionsId}
							className="min-h-24"
							placeholder="한 줄에 꼬리질문 하나씩 입력하세요."
							value={form.followUpQuestionsText}
							onChange={(event) =>
								onChange((prev) => ({ ...prev, followUpQuestionsText: event.target.value }))
							}
						/>
					</TextField>
					<TextField className="w-full" name="evidence_policy">
						<Label htmlFor={evidencePolicyId}>증거/채점 정책</Label>
						<TextArea
							id={evidencePolicyId}
							className="min-h-20"
							placeholder="예: 발화에서 개념 언급과 적용 근거를 함께 확인합니다."
							value={form.evidencePolicy}
							onChange={(event) => onChange((prev) => ({ ...prev, evidencePolicy: event.target.value }))}
						/>
					</TextField>
					<TextField className="w-full" name="rubric_text">
						<Label htmlFor={rubricTextId}>Legacy 루브릭 메모</Label>
						<TextArea
							id={rubricTextId}
							className="min-h-24"
							placeholder="기존 루브릭 텍스트가 있으면 참고용으로 유지합니다."
							value={form.rubricText}
							onChange={(event) => onChange((prev) => ({ ...prev, rubricText: event.target.value }))}
						/>
					</TextField>
				</>
			) : null}

			{isSubjectiveQuestion || isOralQuestion ? (
				<TextField className="w-full" name="rubric_criteria">
					<Label htmlFor={rubricCriteriaId}>루브릭 기준</Label>
					<TextArea
						id={rubricCriteriaId}
						className="min-h-28"
						placeholder={
							'한 줄에 name | points | description 형식으로 입력하세요.\n정확성 | 2 | 핵심 개념을 정확히 포함'
						}
						value={form.rubricCriteriaText}
						onChange={(event) => onChange((prev) => ({ ...prev, rubricCriteriaText: event.target.value }))}
					/>
				</TextField>
			) : null}
		</>
	);
}
