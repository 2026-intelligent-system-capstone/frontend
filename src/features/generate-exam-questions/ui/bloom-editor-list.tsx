import type { BloomLevel } from '@/entities/exam';

import { bloomLevelOptions } from '../lib/bloom';
import { GenerateExamQuestionsBloomEditorRow } from './bloom-editor-row';

interface GenerateExamQuestionsBloomEditorListProps {
	bloomWeights: Record<BloomLevel, string>;
	onBloomWeightChange: (level: BloomLevel, value: string) => void;
}

export function GenerateExamQuestionsBloomEditorList({
	bloomWeights,
	onBloomWeightChange,
}: GenerateExamQuestionsBloomEditorListProps) {
	return (
		<div className="space-y-3">
			<div className="rounded-large border-border-subtle bg-surface border px-3 py-2">
				<p className="text-neutral-text text-xs font-medium">가중치 예시</p>
				<p className="text-neutral-gray-500 mt-1 text-xs">기억:이해:적용:분석:평가:창조 = 2:2:1:0:0:0</p>
			</div>
			{bloomLevelOptions.map((option) => (
				<GenerateExamQuestionsBloomEditorRow
					key={option.value}
					bloomWeights={bloomWeights}
					onBloomWeightChange={onBloomWeightChange}
					option={option}
				/>
			))}
		</div>
	);
}
