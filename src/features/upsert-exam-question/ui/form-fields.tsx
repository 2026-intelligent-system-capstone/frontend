'use client';

import {
	type ExamQuestionFormValues,
	bloomLevelOptions,
	createAnswerOption,
	difficultyOptions,
	questionTypeOptions,
} from '@/features/upsert-exam-question/lib/form';
import { Button, Input, Label, ListBox, Select, TextArea, TextField } from '@heroui/react';

interface UpsertExamQuestionFormFieldsProps {
	acceptableAnswersId: string;
	answerOptionsId: string;
	correctOptionId: string;
	expectedPointsId: string;
	followUpQuestionsId: string;
	maxScoreId: string;
	questionNumberId: string;
	questionTextId: string;
	intentTextId: string;
	modelAnswerId: string;
	requiredKeywordsId: string;
	rubricCriteriaId: string;
	rubricEvidencePolicyId: string;
	rubricTextId: string;
	form: ExamQuestionFormValues;
	onChange: (updater: (prev: ExamQuestionFormValues) => ExamQuestionFormValues) => void;
	onQuestionTypeChange: (questionType: ExamQuestionFormValues['questionType']) => void;
}

export function UpsertExamQuestionFormFields({
	acceptableAnswersId,
	answerOptionsId,
	correctOptionId,
	expectedPointsId,
	followUpQuestionsId,
	maxScoreId,
	questionNumberId,
	questionTextId,
	intentTextId,
	modelAnswerId,
	requiredKeywordsId,
	rubricCriteriaId,
	rubricEvidencePolicyId,
	rubricTextId,
	form,
	onChange,
	onQuestionTypeChange,
}: UpsertExamQuestionFormFieldsProps) {
	const renderedQuestionTypeOptions =
		form.questionType === 'none'
			? [{ label: '미지정', value: 'none' as const }, ...questionTypeOptions]
			: questionTypeOptions;
	const isStructuredRubricQuestion = form.questionType === 'subjective' || form.questionType === 'oral';
	const answerOptionItems = form.answerOptions.filter((option) => option.text.trim());

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
				<>
					<div className="space-y-3">
						<div>
							<Label htmlFor={answerOptionsId}>객관식 보기</Label>
							<p className="text-neutral-gray-500 mt-1 text-xs">
								보기별 id와 label은 저장된 구조화 데이터 그대로 유지됩니다.
							</p>
						</div>
						<div className="space-y-2" id={answerOptionsId}>
							{form.answerOptions.map((option) => (
								<div key={option.id} className="flex items-start gap-2">
									<span
										className="bg-brand-soft text-brand-deep mt-2 flex h-7 w-7 shrink-0 items-center
											justify-center rounded-full text-xs font-semibold"
									>
										{option.label}
									</span>
									<TextField className="flex-1" name={`answer_option_${option.id}`}>
										<Label className="sr-only">{option.label} 보기</Label>
										<Input
											value={option.text}
											onChange={(event) =>
												onChange((prev) => ({
													...prev,
													answerOptions: prev.answerOptions.map((item) =>
														item.id === option.id
															? { ...item, text: event.target.value }
															: item,
													),
												}))
											}
										/>
									</TextField>
									<Button
										type="button"
										variant="tertiary"
										onPress={() =>
											onChange((prev) => {
												const answerOptions = prev.answerOptions.filter(
													(item) => item.id !== option.id,
												);
												const correctOptionId =
													prev.correctOptionId === option.id ? '' : prev.correctOptionId;

												return {
													...prev,
													answerOptions,
													correctOptionId,
												};
											})
										}
									>
										삭제
									</Button>
								</div>
							))}
						</div>
						<Button
							type="button"
							variant="secondary"
							onPress={() =>
								onChange((prev) => ({
									...prev,
									answerOptions: [...prev.answerOptions, createAnswerOption(prev.answerOptions)],
								}))
							}
						>
							보기 추가
						</Button>
					</div>
					<Select
						className="w-full"
						name="correct_option_id"
						value={form.correctOptionId}
						onChange={(value) =>
							onChange((prev) => ({ ...prev, correctOptionId: value ? String(value) : '' }))
						}
					>
						<Label htmlFor={correctOptionId}>정답 보기</Label>
						<Select.Trigger id={correctOptionId}>
							<Select.Value />
							<Select.Indicator />
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								{answerOptionItems.map((option) => (
									<ListBox.Item
										key={option.id}
										id={option.id}
										textValue={`${option.label}. ${option.text}`}
									>
										{option.label}. {option.text}
										<ListBox.ItemIndicator />
									</ListBox.Item>
								))}
							</ListBox>
						</Select.Popover>
					</Select>
				</>
			) : null}

			{form.questionType === 'subjective' ? (
				<>
					<TextField isRequired className="w-full" name="model_answer">
						<Label htmlFor={modelAnswerId}>모범 답안</Label>
						<TextArea
							id={modelAnswerId}
							className="min-h-24"
							placeholder="채점 기준이 되는 모범 답안을 입력하세요."
							value={form.modelAnswerText}
							onChange={(event) => onChange((prev) => ({ ...prev, modelAnswerText: event.target.value }))}
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
							className="min-h-24"
							placeholder="한 줄에 필수 키워드 하나씩 입력하세요."
							value={form.requiredKeywordsText}
							onChange={(event) =>
								onChange((prev) => ({ ...prev, requiredKeywordsText: event.target.value }))
							}
						/>
					</TextField>
				</>
			) : null}

			{form.questionType === 'oral' ? (
				<>
					<TextField className="w-full" name="expected_points">
						<Label htmlFor={expectedPointsId}>기대 응답 포인트</Label>
						<TextArea
							id={expectedPointsId}
							className="min-h-24"
							placeholder="한 줄에 구술 답변에서 확인할 포인트 하나씩 입력하세요."
							value={form.expectedPointsText}
							onChange={(event) =>
								onChange((prev) => ({ ...prev, expectedPointsText: event.target.value }))
							}
						/>
					</TextField>
					<TextField className="w-full" name="follow_up_questions">
						<Label htmlFor={followUpQuestionsId}>후속 질문</Label>
						<TextArea
							id={followUpQuestionsId}
							className="min-h-24"
							placeholder="한 줄에 후속 질문 하나씩 입력하세요."
							value={form.followUpQuestionsText}
							onChange={(event) =>
								onChange((prev) => ({ ...prev, followUpQuestionsText: event.target.value }))
							}
						/>
					</TextField>
				</>
			) : null}

			{isStructuredRubricQuestion ? (
				<>
					<TextField className="w-full" name="rubric_criteria">
						<Label htmlFor={rubricCriteriaId}>루브릭 기준</Label>
						<TextArea
							id={rubricCriteriaId}
							className="min-h-32"
							placeholder={'한 줄에 기준을 입력하세요.\n개념 이해 | 핵심 개념을 정확히 설명한다 | 5'}
							value={form.rubricCriteriaText}
							onChange={(event) =>
								onChange((prev) => ({ ...prev, rubricCriteriaText: event.target.value }))
							}
						/>
					</TextField>
					<TextField className="w-full" name="rubric_evidence_policy">
						<Label htmlFor={rubricEvidencePolicyId}>증거 기록 정책</Label>
						<TextArea
							id={rubricEvidencePolicyId}
							className="min-h-20"
							placeholder="채점 시 참고할 답변 증거 기록 방식을 입력하세요."
							value={form.rubricEvidencePolicyText}
							onChange={(event) =>
								onChange((prev) => ({ ...prev, rubricEvidencePolicyText: event.target.value }))
							}
						/>
					</TextField>
					<TextField className="w-full" name="rubric_text">
						<Label htmlFor={rubricTextId}>레거시 루브릭 메모</Label>
						<TextArea
							id={rubricTextId}
							className="min-h-24"
							placeholder="기존 루브릭 메모가 있으면 보존용으로 입력하세요."
							value={form.rubricText}
							onChange={(event) => onChange((prev) => ({ ...prev, rubricText: event.target.value }))}
						/>
					</TextField>
				</>
			) : null}
		</>
	);
}
