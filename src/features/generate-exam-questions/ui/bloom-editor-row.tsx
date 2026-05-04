import type { BloomLevel } from '@/entities/exam';
import {
	type BloomLevelOption,
	MAX_BLOOM_LEVEL_QUESTION_COUNT,
	getDisplayCountValue,
} from '@/features/generate-exam-questions/lib/bloom';
import { SparklesIcon } from '@/shared/ui/icons/exam';
import { Button, Label, NumberField, Tooltip } from '@heroui/react';

interface GenerateExamQuestionsBloomEditorRowProps {
	bloomCounts: Record<BloomLevel, string>;
	onBloomCountChange: (level: BloomLevel, value: string) => void;
	option: BloomLevelOption;
}

export function GenerateExamQuestionsBloomEditorRow({
	bloomCounts,
	onBloomCountChange,
	option,
}: GenerateExamQuestionsBloomEditorRowProps) {
	const countValue = getDisplayCountValue(bloomCounts[option.value]);

	return (
		<div className="rounded-large border-border-subtle bg-surface border p-3">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<p className="text-neutral-text text-sm font-medium">{option.label}</p>
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
									<p className="text-neutral-text font-semibold">{option.label}</p>
									<p className="text-neutral-gray-700">{option.evaluationFocus}</p>
									<p className="text-neutral-gray-500">예: {option.exampleQuestion}</p>
								</div>
							</Tooltip.Content>
						</Tooltip>
					</div>
					<p className="text-neutral-gray-500 text-xs">{option.description}</p>
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
