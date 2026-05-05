import type { BloomLevel, ExamQuestionTypeStrategy } from '@/entities/exam';
import { Description, Label, ListBox, Select, TextArea, TextField } from '@heroui/react';

import { parseBloomWeights, questionTypeStrategyOptions } from '../lib/bloom';
import { GenerateExamQuestionsBloomEditorList } from './bloom-editor-list';
import { GenerateExamQuestionsBloomPyramidPreview } from './bloom-pyramid-preview';
import { GenerateExamQuestionsBloomSummary } from './bloom-summary';

interface GenerateExamQuestionsSettingsProps {
	additionalScopeText: string;
	bloomWeights: Record<BloomLevel, string>;
	questionCount: number;
	questionTypeStrategy: ExamQuestionTypeStrategy;
	onAdditionalScopeTextChange: (value: string) => void;
	onBloomWeightChange: (level: BloomLevel, value: string) => void;
	onQuestionTypeStrategyChange: (value: ExamQuestionTypeStrategy) => void;
}

export function GenerateExamQuestionsSettings({
	additionalScopeText,
	bloomWeights,
	questionCount,
	questionTypeStrategy,
	onAdditionalScopeTextChange,
	onBloomWeightChange,
	onQuestionTypeStrategyChange,
}: GenerateExamQuestionsSettingsProps) {
	const { totalWeight } = parseBloomWeights(bloomWeights);

	return (
		<>
			<TextField className="w-full" name="additional_scope_text">
				<Label>추가 포함 내용</Label>
				<TextArea
					className="min-h-28"
					placeholder="예: 회귀와 분류 비교를 강조하고, 실제 데이터셋 적용 사례를 포함해주세요."
					value={additionalScopeText}
					onChange={(event) => onAdditionalScopeTextChange(event.target.value)}
				/>
				<Description>선택한 개념 외에 반드시 포함할 범위, 강조점, 제외 조건을 작성하세요.</Description>
			</TextField>

			<div className="rounded-large border-border-subtle bg-surface-muted space-y-4 border p-4">
				<GenerateExamQuestionsBloomSummary questionCount={questionCount} totalWeight={totalWeight} />

				<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(370px,370px)] md:items-start">
					<GenerateExamQuestionsBloomPyramidPreview bloomWeights={bloomWeights} />
					<GenerateExamQuestionsBloomEditorList
						bloomWeights={bloomWeights}
						onBloomWeightChange={onBloomWeightChange}
					/>
				</div>

				<div className="rounded-large border-border-subtle bg-surface space-y-4 border p-4">
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
											<p className="text-neutral-gray-500 text-xs">{option.description}</p>
										</div>
										<ListBox.ItemIndicator />
									</ListBox.Item>
								))}
							</ListBox>
						</Select.Popover>
					</Select>
				</div>

				<Description>
					Bloom 가중치는 0~10 사이 정수로 입력합니다. 실제 문항 배분은 서버 생성 결과를 기준으로 합니다.
				</Description>
			</div>
		</>
	);
}
