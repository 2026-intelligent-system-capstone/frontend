'use client';

import {
	type ExamQuestionFormValues,
	bloomLevelOptions,
	difficultyOptions,
	questionTypeOptions,
} from '@/features/upsert-exam-question/lib/form';
import { Input, Label, ListBox, Select, TextArea, TextField } from '@heroui/react';

interface UpsertExamQuestionFormFieldsProps {
	answerOptionsId: string;
	correctAnswerTextId: string;
	maxScoreId: string;
	questionNumberId: string;
	questionTextId: string;
	intentTextId: string;
	rubricTextId: string;
	form: ExamQuestionFormValues;
	onChange: (updater: (prev: ExamQuestionFormValues) => ExamQuestionFormValues) => void;
	onQuestionTypeChange: (questionType: ExamQuestionFormValues['questionType']) => void;
}

export function UpsertExamQuestionFormFields({
	answerOptionsId,
	correctAnswerTextId,
	maxScoreId,
	questionNumberId,
	questionTextId,
	intentTextId,
	rubricTextId,
	form,
	onChange,
	onQuestionTypeChange,
}: UpsertExamQuestionFormFieldsProps) {
	const renderedQuestionTypeOptions =
		form.questionType === 'none'
			? [{ label: '미지정', value: 'none' as const }, ...questionTypeOptions]
			: questionTypeOptions;
	const isOralQuestion = form.questionType === 'oral';

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

			{isOralQuestion ? (
				<TextField isRequired className="w-full" name="rubric_text">
					<Label htmlFor={rubricTextId}>루브릭</Label>
					<TextArea
						id={rubricTextId}
						className="min-h-32"
						placeholder="구술형 평가 기준을 입력하세요."
						value={form.rubricText}
						onChange={(event) => onChange((prev) => ({ ...prev, rubricText: event.target.value }))}
					/>
				</TextField>
			) : null}

			{form.questionType === 'multiple_choice' ? (
				<TextField isRequired className="w-full" name="answer_options">
					<Label htmlFor={answerOptionsId}>객관식 보기</Label>
					<TextArea
						id={answerOptionsId}
						className="min-h-32"
						placeholder={'한 줄에 보기 하나씩 입력하세요.\n1. 회귀\n2. 분류'}
						value={form.answerOptionsText}
						onChange={(event) =>
							onChange((prev) => ({
								...prev,
								answerOptionsText: event.target.value,
							}))
						}
					/>
				</TextField>
			) : null}

			{form.questionType === 'multiple_choice' || form.questionType === 'subjective' ? (
				<TextField isRequired className="w-full" name="correct_answer_text">
					<Label htmlFor={correctAnswerTextId}>정확한 정답</Label>
					<TextArea
						id={correctAnswerTextId}
						className="min-h-24"
						placeholder={
							form.questionType === 'multiple_choice'
								? '학생에게 보여지는 보기와 일치하는 정답 텍스트를 입력하세요.'
								: '숫자, 단답 등 정확한 정답 하나를 입력하세요.'
						}
						value={form.correctAnswerText}
						onChange={(event) =>
							onChange((prev) => ({
								...prev,
								correctAnswerText: event.target.value,
							}))
						}
					/>
				</TextField>
			) : null}
		</>
	);
}
