import type { BloomLevel } from '@/types/exam';

import { bloomLevelOptions } from '@/lib/classrooms/exam-presentation';

import { ExamQuestionGenerationBloomRatioEditorRow } from '@/components/professor/classroom-exams/exam-question-generation-bloom-ratio-editor-row';

interface ExamQuestionGenerationBloomRatioEditorListProps {
	bloomCounts: Record<BloomLevel, string>;
	onBloomCountChange: (level: BloomLevel, value: string) => void;
}

export function ExamQuestionGenerationBloomRatioEditorList({
	bloomCounts,
	onBloomCountChange,
}: ExamQuestionGenerationBloomRatioEditorListProps) {
	return (
		<div className="space-y-3">
			{bloomLevelOptions.map((option) => (
				<ExamQuestionGenerationBloomRatioEditorRow
					key={option.value}
					bloomCounts={bloomCounts}
					onBloomCountChange={onBloomCountChange}
					option={option}
				/>
			))}
		</div>
	);
}
