import type {
	BloomLevel,
	ExamDifficulty,
	ExamQuestion,
	ExamQuestionBloomCountRequest,
	ExamType,
} from '@/entities/exam';

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

export const MAX_BLOOM_LEVEL_QUESTION_COUNT = 5;

export const createEmptyGenerationForm = (): ExamQuestionGenerationFormValues => ({
	difficulty: 'medium',
	maxFollowUps: '2',
	scopeText: '',
	selectedMaterialIds: [],
});

const defaultBloomCountsByExamType: Record<ExamType, Record<BloomLevel, string>> = {
	weekly: {
		analyze: '0',
		apply: '1',
		create: '0',
		evaluate: '0',
		remember: '1',
		understand: '1',
	},
	midterm: {
		analyze: '1',
		apply: '1',
		create: '0',
		evaluate: '0',
		remember: '0',
		understand: '1',
	},
	final: {
		analyze: '1',
		apply: '1',
		create: '1',
		evaluate: '1',
		remember: '0',
		understand: '1',
	},
	mock: {
		analyze: '1',
		apply: '1',
		create: '0',
		evaluate: '1',
		remember: '0',
		understand: '1',
	},
	project: {
		analyze: '1',
		apply: '0',
		create: '1',
		evaluate: '1',
		remember: '0',
		understand: '1',
	},
};

export const createDefaultBloomCounts = (examType: ExamType): Record<BloomLevel, string> => ({
	...defaultBloomCountsByExamType[examType],
});

export const parseBloomCounts = (bloomCounts: Record<BloomLevel, string>) => {
	const parsedCounts: ExamQuestionBloomCountRequest[] = bloomLevelOptions
		.map((option) => ({
			bloom_level: option.value,
			count: getDisplayCountValue(bloomCounts[option.value]),
		}))
		.filter((item) => item.count > 0);

	return {
		parsedCounts,
		totalCount: parsedCounts.reduce((sum, item) => sum + item.count, 0),
	};
};

export const bloomPyramidPreviewLevels = [...bloomLevelOptions].reverse();

export const bloomPyramidWidthClassNames: Record<BloomLevel, string> = {
	create: 'w-4/12',
	evaluate: 'w-5/12',
	analyze: 'w-6/12',
	apply: 'w-8/12',
	understand: 'w-10/12',
	remember: 'w-full',
};

export const bloomPyramidToneClassNames: Record<BloomLevel, string> = {
	create: 'bg-violet-100 text-violet-900',
	evaluate: 'bg-rose-100 text-rose-900',
	analyze: 'bg-amber-100 text-amber-900',
	apply: 'bg-emerald-100 text-emerald-900',
	understand: 'bg-sky-100 text-sky-900',
	remember: 'bg-slate-200 text-slate-800',
};

export const getDisplayCountValue = (value: string) => {
	const parsedValue = Number(value);

	if (!Number.isInteger(parsedValue) || parsedValue < 0) {
		return 0;
	}

	return Math.min(parsedValue, MAX_BLOOM_LEVEL_QUESTION_COUNT);
};

export const toggleStringValue = (values: string[], target: string) => {
	return values.includes(target) ? values.filter((value) => value !== target) : [...values, target];
};

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
