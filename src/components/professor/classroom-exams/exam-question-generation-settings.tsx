import { Description, Input, Label, ListBox, Select, TextArea, TextField } from '@heroui/react';

import type { BloomLevel, ExamDifficulty } from '@/types/exam';

import { difficultyOptions, parseBloomCounts } from '@/lib/classrooms/exam-presentation';

import { ExamQuestionGenerationBloomRatioEditorList } from '@/components/professor/classroom-exams/exam-question-generation-bloom-ratio-editor-list';
import { ExamQuestionGenerationBloomRatioPyramidPreview } from '@/components/professor/classroom-exams/exam-question-generation-bloom-ratio-pyramid-preview';
import { ExamQuestionGenerationBloomRatioSummary } from '@/components/professor/classroom-exams/exam-question-generation-bloom-ratio-summary';

interface ExamQuestionGenerationSettingsProps {
	difficulty: ExamDifficulty;
	maxFollowUps: string;
	scopeText: string;
	bloomCounts: Record<BloomLevel, string>;
	onDifficultyChange: (value: ExamDifficulty) => void;
	onMaxFollowUpsChange: (value: string) => void;
	onScopeTextChange: (value: string) => void;
	onBloomCountChange: (level: BloomLevel, value: string) => void;
}

export function ExamQuestionGenerationSettings({
	difficulty,
	maxFollowUps,
	scopeText,
	bloomCounts,
	onDifficultyChange,
	onMaxFollowUpsChange,
	onScopeTextChange,
	onBloomCountChange,
}: ExamQuestionGenerationSettingsProps) {
	const { totalCount } = parseBloomCounts(bloomCounts);

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2">
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

			<div className="rounded-large space-y-4 border border-slate-200 bg-slate-50 p-4">
				<ExamQuestionGenerationBloomRatioSummary totalCount={totalCount} />

				<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] md:items-start">
					<ExamQuestionGenerationBloomRatioPyramidPreview bloomCounts={bloomCounts} />
					<ExamQuestionGenerationBloomRatioEditorList
						bloomCounts={bloomCounts}
						onBloomCountChange={onBloomCountChange}
					/>
				</div>

				<Description>단계별 문항 수를 직접 입력하세요. 0개인 단계는 생성 요청에서 제외됩니다.</Description>
			</div>
		</>
	);
}
