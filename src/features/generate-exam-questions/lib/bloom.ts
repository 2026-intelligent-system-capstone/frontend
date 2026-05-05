import type {
	BloomLevel,
	ExamDifficulty,
	ExamQuestion,
	ExamQuestionBloomWeightRequest,
	ExamQuestionTypeStrategy,
	ExamType,
} from '@/entities/exam';

export interface ExamQuestionGenerationFormValues {
	maxFollowUps: string;
	scopeText: string;
	selectedMaterialIds: string[];
	questionTypeStrategy: ExamQuestionTypeStrategy;
}

export interface QuestionTypeStrategyOption {
	description: string;
	label: string;
	value: ExamQuestionTypeStrategy;
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

export const questionTypeStrategyOptions: QuestionTypeStrategyOption[] = [
	{
		description: '객관식·주관식·구술형을 가능한 균형 있게 섞어 생성합니다.',
		label: '균형형',
		value: 'balanced',
	},
	{
		description: '빠른 채점과 명확한 정답 확인이 가능한 객관식 비중을 높입니다.',
		label: '객관식 우선',
		value: 'multiple_choice_focus',
	},
	{
		description: '서술형 설명과 논리 전개를 더 많이 평가하도록 구성합니다.',
		label: '주관식 우선',
		value: 'subjective_focus',
	},
	{
		description: '말로 설명하는 능력과 구술 상호작용 중심으로 구성합니다.',
		label: '구술형 우선',
		value: 'oral_focus',
	},
];

export const MAX_BLOOM_LEVEL_WEIGHT = 10;

export const createEmptyGenerationForm = (): ExamQuestionGenerationFormValues => ({
	maxFollowUps: '2',
	scopeText: '',
	selectedMaterialIds: [],
	questionTypeStrategy: 'balanced',
});

const defaultBloomWeightsByExamType: Record<ExamType, Record<BloomLevel, string>> = {
	weekly: {
		analyze: '0',
		apply: '1',
		create: '0',
		evaluate: '0',
		remember: '2',
		understand: '2',
	},
	midterm: {
		analyze: '2',
		apply: '2',
		create: '0',
		evaluate: '1',
		remember: '1',
		understand: '2',
	},
	final: {
		analyze: '2',
		apply: '2',
		create: '1',
		evaluate: '2',
		remember: '1',
		understand: '2',
	},
	mock: {
		analyze: '2',
		apply: '2',
		create: '1',
		evaluate: '1',
		remember: '1',
		understand: '2',
	},
	project: {
		analyze: '2',
		apply: '1',
		create: '2',
		evaluate: '2',
		remember: '0',
		understand: '1',
	},
};

export const createDefaultBloomWeights = (examType: ExamType): Record<BloomLevel, string> => ({
	...defaultBloomWeightsByExamType[examType],
});

export const getDisplayWeightValue = (value: string, maxValue = MAX_BLOOM_LEVEL_WEIGHT) => {
	const parsedValue = Number(value);

	if (!Number.isInteger(parsedValue) || parsedValue < 0) {
		return 0;
	}

	return Math.min(parsedValue, maxValue);
};

export const parseBloomWeights = (bloomWeights: Record<BloomLevel, string>) => {
	const parsedWeights: ExamQuestionBloomWeightRequest[] = bloomLevelOptions
		.map((option) => ({
			bloom_level: option.value,
			weight: getDisplayWeightValue(bloomWeights[option.value]),
		}))
		.filter((item) => item.weight > 0);

	return {
		parsedWeights,
		totalWeight: parsedWeights.reduce((sum, item) => sum + item.weight, 0),
	};
};

export const createBloomAllocationPreview = (bloomWeights: Record<BloomLevel, string>, questionCount: number) => {
	const { parsedWeights, totalWeight } = parseBloomWeights(bloomWeights);

	if (totalWeight <= 0 || questionCount <= 0) {
		return new Map<BloomLevel, number>();
	}

	const exactAllocations = parsedWeights.map((item) => {
		const exactCount = (item.weight / totalWeight) * questionCount;
		return {
			bloomLevel: item.bloom_level,
			baseCount: Math.floor(exactCount),
			remainder: exactCount - Math.floor(exactCount),
		};
	});
	const allocatedBaseCount = exactAllocations.reduce((sum, item) => sum + item.baseCount, 0);
	const extraAllocationOrder = [...exactAllocations].sort((a, b) => b.remainder - a.remainder);
	const preview = new Map<BloomLevel, number>();

	exactAllocations.forEach((item) => preview.set(item.bloomLevel, item.baseCount));
	for (let index = 0; index < questionCount - allocatedBaseCount; index += 1) {
		const target = extraAllocationOrder[index % extraAllocationOrder.length];
		preview.set(target.bloomLevel, (preview.get(target.bloomLevel) ?? 0) + 1);
	}

	return preview;
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
	create: 'bg-brand-soft text-brand-deep',
	evaluate: 'bg-danger-soft text-danger-text',
	analyze: 'bg-warning-soft text-warning-text',
	apply: 'bg-success-soft text-success-text',
	understand: 'bg-surface-muted text-neutral-gray-700',
	remember: 'bg-surface-muted text-neutral-gray-700',
};

export const toggleStringValue = (values: string[], target: string) => {
	return values.includes(target) ? values.filter((value) => value !== target) : [...values, target];
};

export interface ExamQuestionFormValues {
	bloomLevel: BloomLevel;
	difficulty: ExamDifficulty;
	intentText: string;
	questionNumber: string;
	questionText: string;
	rubricText: string;
	sourceMaterialIds: string[];
}

export const createEmptyQuestionForm = (): ExamQuestionFormValues => ({
	bloomLevel: 'understand',
	difficulty: 'medium',
	intentText: '',
	questionNumber: '1',
	questionText: '',
	rubricText: '',
	sourceMaterialIds: [],
});

export const createQuestionFormValues = (question?: ExamQuestion): ExamQuestionFormValues => {
	if (!question) {
		return createEmptyQuestionForm();
	}

	return {
		bloomLevel: question.bloom_level,
		difficulty: question.difficulty,
		intentText: question.intent_text,
		questionNumber: String(question.question_number),
		questionText: question.question_text,
		rubricText: question.rubric_text,
		sourceMaterialIds: [...question.source_material_ids],
	};
};
