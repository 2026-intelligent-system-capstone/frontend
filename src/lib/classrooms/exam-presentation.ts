import type { ChipProps } from '@heroui/react';

import type {
	BloomLevel,
	Exam,
	ExamDifficulty,
	ExamQuestion,
	ExamQuestionBloomCountRequest,
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
}

export interface BloomLevelOption {
	description: string;
	evaluationFocus: string;
	exampleQuestion: string;
	label: string;
	value: BloomLevel;
}

export const bloomLevelOptions: BloomLevelOption[] = [
	{
		description: '정의·용어·사실을 정확히 회상하는 능력',
		evaluationFocus: '핵심 개념과 용어를 빠뜨리지 않고 정확하게 떠올리는지 평가합니다.',
		exampleQuestion: '지도학습의 정의를 설명하세요.',
		label: '기억',
		value: 'remember',
	},
	{
		description: '개념의 의미와 차이를 설명하는 능력',
		evaluationFocus: '개념 간 관계와 차이를 자기 말로 설명할 수 있는지 평가합니다.',
		exampleQuestion: '회귀와 분류의 차이를 설명하세요.',
		label: '이해',
		value: 'understand',
	},
	{
		description: '배운 개념을 사례와 문제에 적용하는 능력',
		evaluationFocus: '주어진 상황에 적절한 개념이나 방법을 골라 적용할 수 있는지 평가합니다.',
		exampleQuestion: '이 데이터셋에는 어떤 모델이 적절한지 설명하세요.',
		label: '적용',
		value: 'apply',
	},
	{
		description: '문제를 구조적으로 나누고 관계를 파악하는 능력',
		evaluationFocus: '문제의 원인, 구성 요소, 상호작용을 논리적으로 분석하는지 평가합니다.',
		exampleQuestion: '모델 성능 저하 원인을 분석해보세요.',
		label: '분석',
		value: 'analyze',
	},
	{
		description: '기준에 따라 비교·판단하는 능력',
		evaluationFocus: '명확한 기준과 근거를 세워 대안을 평가하는지 확인합니다.',
		exampleQuestion: '두 모델 중 어느 쪽이 더 적절한지 근거와 함께 평가하세요.',
		label: '평가',
		value: 'evaluate',
	},
	{
		description: '새로운 해결책이나 전략을 설계하는 능력',
		evaluationFocus: '기존 지식을 바탕으로 새로운 대안이나 구조를 제안하는지 평가합니다.',
		exampleQuestion: '이 문제를 해결하기 위한 새로운 평가 방식을 설계해보세요.',
		label: '창조',
		value: 'create',
	},
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

export const MAX_BLOOM_LEVEL_QUESTION_COUNT = 5;

export const createEmptyGenerationForm = (): ExamQuestionGenerationFormValues => ({
	difficulty: 'medium',
	maxFollowUps: '2',
	scopeText: '',
	selectedMaterialIds: [],
});

export const createDefaultBloomCounts = (): Record<BloomLevel, string> => ({
	analyze: '1',
	apply: '1',
	create: '0',
	evaluate: '0',
	remember: '0',
	understand: '1',
});

export const parseBloomCounts = (bloomCounts: Record<BloomLevel, string>) => {
	const parsedCounts: ExamQuestionBloomCountRequest[] = bloomLevelOptions
		.map((option) => ({
			bloom_level: option.value,
			count: Number(bloomCounts[option.value]),
		}))
		.filter((item) => item.count > 0);

	return {
		parsedCounts,
		totalCount: parsedCounts.reduce((sum, item) => sum + item.count, 0),
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
