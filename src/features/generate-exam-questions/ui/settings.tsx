import type { BloomLevel, ExamQuestionTypeStrategy } from '@/entities/exam';
import { Description, Label, ListBox, Select } from '@heroui/react';

import { parseBloomWeights, questionTypeStrategyOptions } from '../lib/bloom';
import { GenerateExamQuestionsBloomEditorList } from './bloom-editor-list';
import { GenerateExamQuestionsBloomPyramidPreview } from './bloom-pyramid-preview';
import { GenerateExamQuestionsBloomSummary } from './bloom-summary';

interface GenerateExamQuestionsSettingsProps {
	bloomWeights: Record<BloomLevel, string>;
	questionCount: number;
	questionTypeStrategy: ExamQuestionTypeStrategy;
	onBloomWeightChange: (level: BloomLevel, value: string) => void;
	onQuestionTypeStrategyChange: (value: ExamQuestionTypeStrategy) => void;
}

export function GenerateExamQuestionsSettings({
	bloomWeights,
	questionCount,
	questionTypeStrategy,
	onBloomWeightChange,
	onQuestionTypeStrategyChange,
}: GenerateExamQuestionsSettingsProps) {
	const { totalWeight } = parseBloomWeights(bloomWeights);

	return (
		<section className="rounded-large border-border-subtle bg-surface-muted space-y-4 border p-4">
			<div>
				<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.08em] uppercase">
					Step 2 · Generation Rules
				</p>
				<h3 className="text-neutral-text mt-1 text-base font-semibold">문항 생성 설정</h3>
				<p className="text-neutral-gray-500 mt-1 text-sm">Bloom 단계와 문제 유형 전략을 조정합니다.</p>
			</div>

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
		</section>
	);
}
