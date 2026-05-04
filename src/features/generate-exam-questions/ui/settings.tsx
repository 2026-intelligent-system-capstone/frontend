import type { BloomLevel, ExamDifficulty, ExamQuestionTypeStrategy } from '@/entities/exam';
import { Description, Input, Label, ListBox, Select, TextArea, TextField } from '@heroui/react';

import { difficultyOptions, parseBloomCounts, questionTypeStrategyOptions } from '../lib/bloom';
import { GenerateExamQuestionsBloomEditorList } from './bloom-editor-list';
import { GenerateExamQuestionsBloomPyramidPreview } from './bloom-pyramid-preview';
import { GenerateExamQuestionsBloomSummary } from './bloom-summary';

interface GenerateExamQuestionsSettingsProps {
	difficulty: ExamDifficulty;
	maxFollowUps: string;
	scopeText: string;
	bloomCounts: Record<BloomLevel, string>;
	questionTypeStrategy: ExamQuestionTypeStrategy;
	onDifficultyChange: (value: ExamDifficulty) => void;
	onMaxFollowUpsChange: (value: string) => void;
	onScopeTextChange: (value: string) => void;
	onBloomCountChange: (level: BloomLevel, value: string) => void;
	onQuestionTypeStrategyChange: (value: ExamQuestionTypeStrategy) => void;
}

export function GenerateExamQuestionsSettings({
	difficulty,
	maxFollowUps,
	scopeText,
	bloomCounts,
	questionTypeStrategy,
	onDifficultyChange,
	onMaxFollowUpsChange,
	onScopeTextChange,
	onBloomCountChange,
	onQuestionTypeStrategyChange,
}: GenerateExamQuestionsSettingsProps) {
	const { totalCount } = parseBloomCounts(bloomCounts);

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2">
				<Select
					className="w-full"
					value={difficulty}
					onChange={(value) => {
						if (value === 'easy' || value === 'medium' || value === 'hard') {
							onDifficultyChange(value);
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
				<TextField isRequired className="w-full" name="max_follow_ups">
					<Label>최대 꼬리질문 수</Label>
					<Input
						min={0}
						max={20}
						step={1}
						type="number"
						value={maxFollowUps}
						onChange={(event) => onMaxFollowUpsChange(event.target.value)}
					/>
				</TextField>
			</div>

			<TextField isRequired className="w-full" name="scope_text">
				<Label>시험 범위</Label>
				<TextArea
					className="min-h-28"
					placeholder="예: 1~3주차 지도학습 개념과 회귀·분류 비교"
					value={scopeText}
					onChange={(event) => onScopeTextChange(event.target.value)}
				/>
			</TextField>

			<div className="rounded-large space-y-4 border border-border-subtle bg-surface-muted p-4">
				<GenerateExamQuestionsBloomSummary totalCount={totalCount} />

				<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] md:items-start">
					<GenerateExamQuestionsBloomPyramidPreview bloomCounts={bloomCounts} />
					<GenerateExamQuestionsBloomEditorList
						bloomCounts={bloomCounts}
						onBloomCountChange={onBloomCountChange}
					/>
				</div>

				<div className="rounded-large space-y-4 border border-border-subtle bg-surface p-4">
					<Select
						className="w-full"
						value={questionTypeStrategy}
						onChange={(value) => {
							if (
								value === 'balanced' ||
								value === 'multiple_choice_focus' ||
								value === 'subjective_focus' ||
								value === 'oral_focus'
							) {
								onQuestionTypeStrategyChange(value);
							}
						}}
					>
						<Label>문제 유형 전략</Label>
						<Select.Trigger>
							<Select.Value />
							<Select.Indicator />
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								{questionTypeStrategyOptions.map((option) => (
									<ListBox.Item key={option.value} id={option.value} textValue={option.label}>
										<div className="space-y-1">
											<p>{option.label}</p>
											<p className="text-xs text-neutral-gray-500">{option.description}</p>
										</div>
										<ListBox.ItemIndicator />
									</ListBox.Item>
								))}
							</ListBox>
						</Select.Popover>
					</Select>
				</div>

				<Description>총 문항 수는 Bloom 단계별 문항 수 합계로 자동 결정됩니다.</Description>
			</div>
		</>
	);
}
