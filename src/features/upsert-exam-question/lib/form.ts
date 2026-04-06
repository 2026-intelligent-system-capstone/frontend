import type { BloomLevel, ExamDifficulty, ExamQuestion } from '@/entities/exam';

export interface ExamQuestionFormValues {
	answerKey: string;
	bloomLevel: BloomLevel;
	difficulty: ExamDifficulty;
	evaluationObjective: string;
	questionNumber: string;
	questionText: string;
	scopeText: string;
	scoringCriteria: string;
	sourceMaterialIds: string[];
}

export const bloomLevelOptions: Array<{ label: string; value: BloomLevel }> = [
	{ label: '기억', value: 'remember' },
	{ label: '이해', value: 'understand' },
	{ label: '적용', value: 'apply' },
	{ label: '분석', value: 'analyze' },
	{ label: '평가', value: 'evaluate' },
	{ label: '창조', value: 'create' },
];

export const difficultyOptions: Array<{ label: string; value: ExamDifficulty }> = [
	{ label: '쉬움', value: 'easy' },
	{ label: '보통', value: 'medium' },
	{ label: '어려움', value: 'hard' },
];

export const createEmptyQuestionForm = (): ExamQuestionFormValues => ({
	answerKey: '',
	bloomLevel: 'understand',
	difficulty: 'medium',
	evaluationObjective: '',
	questionNumber: '1',
	questionText: '',
	scopeText: '',
	scoringCriteria: '',
	sourceMaterialIds: [],
});

export const createQuestionFormValues = (question?: ExamQuestion): ExamQuestionFormValues => {
	if (!question) {
		return createEmptyQuestionForm();
	}

	return {
		answerKey: question.answer_key,
		bloomLevel: question.bloom_level,
		difficulty: question.difficulty,
		evaluationObjective: question.evaluation_objective,
		questionNumber: String(question.question_number),
		questionText: question.question_text,
		scopeText: question.scope_text,
		scoringCriteria: question.scoring_criteria,
		sourceMaterialIds: [...question.source_material_ids],
	};
};
