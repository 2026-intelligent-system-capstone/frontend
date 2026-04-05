import { Button, Label, NumberField, Tooltip } from '@heroui/react';

import type { BloomLevel } from '@/types/exam';

import { type BloomLevelOption, MAX_BLOOM_LEVEL_QUESTION_COUNT } from '@/lib/classrooms/exam-presentation';

import { SparklesIcon } from '@/components/professor/classroom-exams/exam-icons';
import { getDisplayCountValue } from '@/components/professor/classroom-exams/exam-question-generation-bloom-ratio-utils';

interface ExamQuestionGenerationBloomRatioEditorRowProps {
	bloomCounts: Record<BloomLevel, string>;
	onBloomCountChange: (level: BloomLevel, value: string) => void;
	option: BloomLevelOption;
}

export function ExamQuestionGenerationBloomRatioEditorRow({
	bloomCounts,
	onBloomCountChange,
	option,
}: ExamQuestionGenerationBloomRatioEditorRowProps) {
	const countValue = getDisplayCountValue(bloomCounts[option.value]);

	return (
		<div className="rounded-large border border-slate-200 bg-white p-3">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<p className="text-sm font-medium text-slate-800">{option.label}</p>
						<Tooltip delay={0}>
							<Tooltip.Trigger>
								<Button
									aria-label={`${option.label} 단계 설명`}
									className="size-6 min-w-6"
									type="button"
									variant="ghost"
								>
									<SparklesIcon className="size-3.5" />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content showArrow>
								<Tooltip.Arrow />
								<div className="max-w-xs space-y-1 p-1 text-xs leading-5">
									<p className="font-semibold text-slate-900">{option.label}</p>
									<p className="text-slate-700">{option.evaluationFocus}</p>
									<p className="text-slate-500">예: {option.exampleQuestion}</p>
								</div>
							</Tooltip.Content>
						</Tooltip>
					</div>
					<p className="text-xs text-slate-600">{option.description}</p>
				</div>
				<NumberField
					aria-label={`${option.label} 문항 수`}
					className="w-full lg:w-36"
					maxValue={MAX_BLOOM_LEVEL_QUESTION_COUNT}
					minValue={0}
					step={1}
					value={countValue}
					onChange={(value) => onBloomCountChange(option.value, String(value ?? 0))}
				>
					<Label className="sr-only">{option.label} 문항 수</Label>
					<NumberField.Group>
						<NumberField.DecrementButton />
						<NumberField.Input className="w-full min-w-0" />
						<NumberField.IncrementButton />
					</NumberField.Group>
				</NumberField>
			</div>
		</div>
	);
}
