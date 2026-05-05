import type { BloomLevel } from '@/entities/exam';
import {
	bloomPyramidPreviewLevels,
	bloomPyramidToneClassNames,
	bloomPyramidWidthClassNames,
	getDisplayWeightValue,
} from '@/features/generate-exam-questions/lib/bloom';

interface GenerateExamQuestionsBloomPyramidPreviewProps {
	bloomWeights: Record<BloomLevel, string>;
}

export function GenerateExamQuestionsBloomPyramidPreview({
	bloomWeights,
}: GenerateExamQuestionsBloomPyramidPreviewProps) {
	return (
		<div className="rounded-large border-border-subtle bg-surface border p-4">
			<div className="mb-3">
				<p className="text-neutral-text text-sm font-medium">Bloom 피라미드</p>
				<p className="text-neutral-gray-500 mt-1 text-xs">
					단계 구조를 기준으로 현재 가중치를 함께 보여줍니다.
				</p>
			</div>
			<div aria-hidden="true" className="flex min-h-80 flex-col justify-center gap-2">
				{bloomPyramidPreviewLevels.map((option) => {
					const weightValue = getDisplayWeightValue(bloomWeights[option.value]);
					const isInactive = weightValue === 0;

					return (
						<div
							key={option.value}
							className={[
								'mx-auto flex h-11 items-center justify-between rounded-xl px-4 text-sm font-medium transition-opacity',
								bloomPyramidWidthClassNames[option.value],
								bloomPyramidToneClassNames[option.value],
								isInactive ? 'opacity-45' : 'opacity-100',
							].join(' ')}
						>
							<span>{option.label}</span>
							<span>{weightValue}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
