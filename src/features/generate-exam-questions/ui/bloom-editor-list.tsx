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
