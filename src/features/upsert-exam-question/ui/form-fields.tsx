import type { BloomLevel, ExamDifficulty } from '@/entities/exam';
import {
	type ExamQuestionFormValues,
	bloomLevelOptions,
	difficultyOptions,
} from '@/features/upsert-exam-question/lib/form';
import { Input, Label, ListBox, Select, TextArea, TextField } from '@heroui/react';

interface UpsertExamQuestionFormFieldsProps {
	questionNumberId: string;
	questionTextId: string;
	scopeTextId: string;
	evaluationObjectiveId: string;
	answerKeyId: string;
	scoringCriteriaId: string;
	form: ExamQuestionFormValues;
	onChange: (updater: (prev: ExamQuestionFormValues) => ExamQuestionFormValues) => void;
}

export function UpsertExamQuestionFormFields({
	questionNumberId,
	questionTextId,
	scopeTextId,
	evaluationObjectiveId,
	answerKeyId,
	scoringCriteriaId,
	form,
	onChange,
}: UpsertExamQuestionFormFieldsProps) {
	return (
		<>
			<div className="grid gap-4 md:grid-cols-3">
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
					value={form.bloomLevel}
					onChange={(value) => onChange((prev) => ({ ...prev, bloomLevel: value as BloomLevel }))}
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
					onChange={(value) => onChange((prev) => ({ ...prev, difficulty: value as ExamDifficulty }))}
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

			<TextField isRequired className="w-full" name="scope_text">
				<Label htmlFor={scopeTextId}>시험 범위</Label>
				<TextArea
					id={scopeTextId}
					className="min-h-24"
					value={form.scopeText}
					onChange={(event) => onChange((prev) => ({ ...prev, scopeText: event.target.value }))}
				/>
			</TextField>

			<TextField isRequired className="w-full" name="evaluation_objective">
				<Label htmlFor={evaluationObjectiveId}>평가 목표</Label>
				<TextArea
					id={evaluationObjectiveId}
					className="min-h-24"
					value={form.evaluationObjective}
					onChange={(event) => onChange((prev) => ({ ...prev, evaluationObjective: event.target.value }))}
				/>
			</TextField>

			<div className="grid gap-4 md:grid-cols-2">
				<TextField isRequired className="w-full" name="answer_key">
					<Label htmlFor={answerKeyId}>정답 기준</Label>
					<TextArea
						id={answerKeyId}
						className="min-h-28"
						value={form.answerKey}
						onChange={(event) => onChange((prev) => ({ ...prev, answerKey: event.target.value }))}
					/>
				</TextField>
				<TextField isRequired className="w-full" name="scoring_criteria">
					<Label htmlFor={scoringCriteriaId}>채점 기준</Label>
					<TextArea
						id={scoringCriteriaId}
						className="min-h-28"
						value={form.scoringCriteria}
						onChange={(event) => onChange((prev) => ({ ...prev, scoringCriteria: event.target.value }))}
					/>
				</TextField>
			</div>
		</>
	);
}
