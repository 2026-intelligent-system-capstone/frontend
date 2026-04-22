import type { BloomLevel, ExamDifficulty, ExamQuestion, ExamQuestionType } from '@/entities/exam';

export interface ExamQuestionFormValues {
	answerOptionsText: string;
	bloomLevel: BloomLevel;
	correctAnswerText: string;
	difficulty: ExamDifficulty;
	intentText: string;
	maxScore: string;
	questionNumber: string;
	questionText: string;
	questionType: ExamQuestionType;
	rubricText: string;
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

export const questionTypeOptions: Array<{
	label: string;
	value: Exclude<ExamQuestionType, 'none'>;
}> = [
	{ label: '객관식', value: 'multiple_choice' },
	{ label: '주관식', value: 'subjective' },
	{ label: '구술형', value: 'oral' },
];

export const createEmptyQuestionForm = (): ExamQuestionFormValues => ({
	answerOptionsText: '',
	bloomLevel: 'understand',
	correctAnswerText: '',
	difficulty: 'medium',
	intentText: '',
	maxScore: '1',
	questionNumber: '1',
	questionText: '',
	questionType: 'none',
	rubricText: '',
	sourceMaterialIds: [],
});

export const createQuestionFormValues = (question?: ExamQuestion): ExamQuestionFormValues => {
	if (!question) {
		return createEmptyQuestionForm();
	}

	return {
		answerOptionsText: question.answer_options.join('\n'),
		bloomLevel: question.bloom_level,
		correctAnswerText: question.correct_answer_text ?? '',
		difficulty: question.difficulty,
		intentText: question.intent_text,
		maxScore: String(question.max_score),
		questionNumber: String(question.question_number),
		questionText: question.question_text,
		questionType: question.question_type,
		rubricText: question.rubric_text,
		sourceMaterialIds: [...question.source_material_ids],
	};
};
