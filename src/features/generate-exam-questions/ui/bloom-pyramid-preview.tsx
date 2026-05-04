import type { BloomLevel } from '@/entities/exam';
import {
	bloomPyramidPreviewLevels,
	bloomPyramidToneClassNames,
	bloomPyramidWidthClassNames,
	getDisplayCountValue,
} from '@/features/generate-exam-questions/lib/bloom';

interface GenerateExamQuestionsBloomPyramidPreviewProps {
	bloomCounts: Record<BloomLevel, string>;
}

export function GenerateExamQuestionsBloomPyramidPreview({
	bloomCounts,
}: GenerateExamQuestionsBloomPyramidPreviewProps) {
	return (
		<div className="rounded-large border border-border-subtle bg-surface p-4">
			<div className="mb-3">
				<p className="text-sm font-medium text-neutral-text">Bloom 피라미드</p>
				<p className="mt-1 text-xs text-neutral-gray-500">단계 구조를 기준으로 현재 문항 수를 함께 보여줍니다.</p>
			</div>
			<div aria-hidden="true" className="flex min-h-80 flex-col justify-center gap-2">
				{bloomPyramidPreviewLevels.map((option) => {
					const countValue = getDisplayCountValue(bloomCounts[option.value]);
					const isInactive = countValue === 0;

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
							<span>{countValue}개</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
