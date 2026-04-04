import type { ChipProps } from '@heroui/react';

import type {
	BloomLevel,
	Exam,
	ExamDifficulty,
	ExamQuestion,
	ExamQuestionBloomRatioRequest,
	ExamQuestionStatus,
} from '@/types/exam';

import { SEOUL_TIME_ZONE, dayjs } from '@/lib/dayjs';

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

export interface ExamQuestionGenerationFormValues {
	difficulty: ExamDifficulty;
	maxFollowUps: string;
	scopeText: string;
	selectedMaterialIds: string[];
	totalQuestions: string;
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

export const createEmptyGenerationForm = (): ExamQuestionGenerationFormValues => ({
	difficulty: 'medium',
	maxFollowUps: '2',
	scopeText: '',
	selectedMaterialIds: [],
	totalQuestions: '3',
});

export const createDefaultBloomRatios = (): Record<BloomLevel, string> => ({
	analyze: '30',
	apply: '40',
	create: '0',
	evaluate: '0',
	remember: '0',
	understand: '30',
});

export const parseBloomRatios = (bloomRatios: Record<BloomLevel, string>) => {
	const parsedRatios: ExamQuestionBloomRatioRequest[] = bloomLevelOptions
		.map((option) => ({
			bloom_level: option.value,
			percentage: Number(bloomRatios[option.value]),
		}))
		.filter((item) => item.percentage > 0);

	return {
		parsedRatios,
		totalRatio: parsedRatios.reduce((sum, item) => sum + item.percentage, 0),
	};
};

export const formatExamDateTime = (value: string) => {
	return dayjs.utc(value).tz(SEOUL_TIME_ZONE).format('YYYY.MM.DD HH:mm');
};

export const getExamTypeLabel = (type: Exam['exam_type']) => {
	switch (type) {
		case 'quiz':
			return '퀴즈';
		case 'midterm':
			return '중간';
		case 'final':
			return '기말';
		case 'mock':
			return '모의';
	}
};

export const getExamTypeColor = (type: Exam['exam_type']): ChipProps['color'] => {
	switch (type) {
		case 'quiz':
			return 'accent';
		case 'midterm':
			return 'warning';
		case 'final':
			return 'danger';
		case 'mock':
			return 'success';
	}
};

export const getExamStatusLabel = (status: Exam['status']) => {
	switch (status) {
		case 'ready':
			return '준비';
		case 'in_progress':
			return '진행 중';
		case 'closed':
			return '종료';
	}
};

export const getExamStatusColor = (status: Exam['status']): ChipProps['color'] => {
	switch (status) {
		case 'ready':
			return 'accent';
		case 'in_progress':
			return 'success';
		case 'closed':
			return 'default';
	}
};

export const getBloomLevelLabel = (level: BloomLevel) => {
	switch (level) {
		case 'remember':
			return '기억';
		case 'understand':
			return '이해';
		case 'apply':
			return '적용';
		case 'analyze':
			return '분석';
		case 'evaluate':
			return '평가';
		case 'create':
			return '창조';
	}
};

export const getBloomLevelColor = (level: BloomLevel): ChipProps['color'] => {
	switch (level) {
		case 'remember':
			return 'default';
		case 'understand':
			return 'accent';
		case 'apply':
			return 'success';
		case 'analyze':
			return 'warning';
		case 'evaluate':
			return 'danger';
		case 'create':
			return 'accent';
	}
};

export const getDifficultyLabel = (difficulty: ExamDifficulty) => {
	switch (difficulty) {
		case 'easy':
			return '쉬움';
		case 'medium':
			return '보통';
		case 'hard':
			return '어려움';
	}
};

export const getDifficultyColor = (difficulty: ExamDifficulty): ChipProps['color'] => {
	switch (difficulty) {
		case 'easy':
			return 'success';
		case 'medium':
			return 'warning';
		case 'hard':
			return 'danger';
	}
};

export const getQuestionStatusLabel = (status: ExamQuestionStatus) => {
	switch (status) {
		case 'generated':
			return '생성됨';
		case 'reviewed':
			return '검토됨';
		case 'deleted':
			return '삭제됨';
	}
};

export const getQuestionStatusColor = (status: ExamQuestionStatus): ChipProps['color'] => {
	switch (status) {
		case 'generated':
			return 'accent';
		case 'reviewed':
			return 'success';
		case 'deleted':
			return 'default';
	}
};

export const toggleStringValue = (values: string[], target: string) => {
	return values.includes(target) ? values.filter((value) => value !== target) : [...values, target];
};
