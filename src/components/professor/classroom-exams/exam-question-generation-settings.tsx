import { Input, Label, ListBox, Select, TextArea, TextField } from '@heroui/react';

import type { BloomLevel, ExamDifficulty } from '@/types/exam';

import { bloomLevelOptions, difficultyOptions } from '@/lib/classrooms/exam-presentation';

interface ExamQuestionGenerationSettingsProps {
	difficulty: ExamDifficulty;
	totalQuestions: string;
	maxFollowUps: string;
	scopeText: string;
	bloomRatios: Record<BloomLevel, string>;
	onDifficultyChange: (value: ExamDifficulty) => void;
	onTotalQuestionsChange: (value: string) => void;
	onMaxFollowUpsChange: (value: string) => void;
	onScopeTextChange: (value: string) => void;
	onBloomRatioChange: (level: BloomLevel, value: string) => void;
}

export function ExamQuestionGenerationSettings({
	difficulty,
	totalQuestions,
	maxFollowUps,
	scopeText,
	bloomRatios,
	onDifficultyChange,
	onTotalQuestionsChange,
	onMaxFollowUpsChange,
	onScopeTextChange,
	onBloomRatioChange,
}: ExamQuestionGenerationSettingsProps) {
	return (
		<>
			<div className="grid gap-4 md:grid-cols-3">
				<Select
					className="w-full"
					value={difficulty}
					onChange={(value) => onDifficultyChange(value as ExamDifficulty)}
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
				<TextField isRequired className="w-full" name="total_questions">
					<Label>문항 수</Label>
					<Input
						min={1}
						max={100}
						type="number"
						value={totalQuestions}
						onChange={(event) => onTotalQuestionsChange(event.target.value)}
					/>
				</TextField>
				<TextField isRequired className="w-full" name="max_follow_ups">
					<Label>최대 꼬리질문 수</Label>
					<Input
						min={0}
						max={20}
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

			<div className="rounded-large space-y-3 border border-slate-200 bg-slate-50 p-4">
				<div>
					<p className="text-sm font-medium text-slate-800">Bloom 비율</p>
					<p className="mt-1 text-xs text-slate-500">
						0을 입력한 단계는 생성 요청에서 제외됩니다. 합계는 100이어야 합니다.
					</p>
				</div>
				<div className="grid gap-3 md:grid-cols-3">
					{bloomLevelOptions.map((option) => (
						<TextField key={option.value} className="w-full">
							<Label>{option.label}</Label>
							<Input
								min={0}
								max={100}
								type="number"
								value={bloomRatios[option.value]}
								onChange={(event) => onBloomRatioChange(option.value, event.target.value)}
							/>
						</TextField>
					))}
				</div>
			</div>
		</>
	);
}
