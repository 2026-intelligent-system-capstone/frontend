import type { BloomLevel } from '@/types/exam';

import {
	bloomPyramidPreviewLevels,
	bloomPyramidToneClassNames,
	bloomPyramidWidthClassNames,
	getDisplayCountValue,
} from '@/components/professor/classroom-exams/exam-question-generation-bloom-ratio-utils';

interface ExamQuestionGenerationBloomRatioPyramidPreviewProps {
	bloomCounts: Record<BloomLevel, string>;
}

export function ExamQuestionGenerationBloomRatioPyramidPreview({
	bloomCounts,
}: ExamQuestionGenerationBloomRatioPyramidPreviewProps) {
	return (
		<div className="rounded-large border border-slate-200 bg-white p-4">
			<div className="mb-3">
				<p className="text-sm font-medium text-slate-800">Bloom 피라미드</p>
				<p className="mt-1 text-xs text-slate-500">단계 구조를 기준으로 현재 문항 수를 함께 보여줍니다.</p>
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
