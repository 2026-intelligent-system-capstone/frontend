import type { BloomLevel } from '@/entities/exam';

import { bloomLevelOptions } from '../lib/bloom';
import { GenerateExamQuestionsBloomEditorRow } from './bloom-editor-row';

interface GenerateExamQuestionsBloomEditorListProps {
	bloomCounts: Record<BloomLevel, string>;
	onBloomCountChange: (level: BloomLevel, value: string) => void;
}

export function GenerateExamQuestionsBloomEditorList({
	bloomCounts,
	onBloomCountChange,
}: GenerateExamQuestionsBloomEditorListProps) {
	return (
		<div className="space-y-3">
			{bloomLevelOptions.map((option) => (
				<GenerateExamQuestionsBloomEditorRow
					key={option.value}
					bloomCounts={bloomCounts}
					onBloomCountChange={onBloomCountChange}
					option={option}
				/>
			))}
		</div>
	);
}
