import type {
	BloomLevel,
	ExamDifficulty,
	ExamQuestion,
	ExamQuestionAnswerKey,
	ExamQuestionAnswerOption,
	ExamQuestionRubric,
	ExamQuestionRubricCriterion,
	ExamQuestionType,
} from '@/entities/exam';

export interface ExamQuestionFormValues {
	acceptableAnswersText: string;
	answerOptions: ExamQuestionAnswerOption[];
	bloomLevel: BloomLevel;
	correctOptionId: string;
	difficulty: ExamDifficulty;
	expectedPointsText: string;
	followUpQuestionsText: string;
	intentText: string;
	maxScore: string;
	modelAnswerText: string;
	questionNumber: string;
	questionText: string;
	questionType: ExamQuestionType;
	requiredKeywordsText: string;
	rubricCriteriaText: string;
	rubricEvidencePolicyText: string;
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

export const splitLines = (value: string): string[] =>
	value
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);

const joinLines = (values?: string[] | null): string => (values ?? []).filter(Boolean).join('\n');

const getOptionLabel = (index: number): string => String(index + 1);

const getNextOptionLabel = (existingOptions: ExamQuestionAnswerOption[]): string => String(existingOptions.length + 1);

const createFallbackAnswerOptions = (question: ExamQuestion): ExamQuestionAnswerOption[] => {
	const correctAnswerText = question.correct_answer_text?.trim();

	return question.answer_options.map((option, index) => {
		const label = getOptionLabel(index);
		const text = option.trim();

		return {
			id: label,
			label,
			text,
			is_correct: Boolean(correctAnswerText && text === correctAnswerText),
		};
	});
};

const getQuestionAnswerOptions = (question: ExamQuestion): ExamQuestionAnswerOption[] => {
	if (question.answer_options_data.length > 0) {
		return question.answer_options_data;
	}

	return createFallbackAnswerOptions(question);
};

const getCorrectOptionId = (question: ExamQuestion, options: ExamQuestionAnswerOption[]): string => {
	const structuredCorrectId = question.answer_key_data?.correct_option_ids?.[0];

	if (structuredCorrectId) {
		return structuredCorrectId;
	}

	return options.find((option) => option.is_correct)?.id ?? '';
};

const createFallbackRubricCriteria = (question: ExamQuestion): ExamQuestionRubricCriterion[] => {
	const rubricText = question.rubric_text.trim();

	if (!rubricText) {
		return [];
	}

	return [
		{
			name: '평가 기준',
			description: rubricText,
			points: question.max_score,
		},
	];
};

const getQuestionRubricCriteria = (question: ExamQuestion): ExamQuestionRubricCriterion[] => {
	if (question.rubric_data.criteria.length > 0) {
		return question.rubric_data.criteria;
	}

	return createFallbackRubricCriteria(question);
};

export const createAnswerOption = (
	existingOptions: ExamQuestionAnswerOption[],
	text = '',
): ExamQuestionAnswerOption => {
	const label = getNextOptionLabel(existingOptions);

	return {
		id: label,
		label,
		text,
		is_correct: false,
		explanation: null,
	};
};

export const formatRubricCriteriaText = (criteria: ExamQuestionRubricCriterion[]): string =>
	criteria
		.map((criterion) => {
			const normalizedPoints = Number.isFinite(criterion.points) ? criterion.points : 0;
			return `${criterion.name} | ${criterion.description} | ${normalizedPoints}`;
		})
		.join('\n');

export const createEmptyQuestionForm = (): ExamQuestionFormValues => ({
	acceptableAnswersText: '',
	answerOptions: [],
	bloomLevel: 'understand',
	correctOptionId: '',
	difficulty: 'medium',
	expectedPointsText: '',
	followUpQuestionsText: '',
	intentText: '',
	maxScore: '1',
	modelAnswerText: '',
	questionNumber: '1',
	questionText: '',
	questionType: 'none',
	requiredKeywordsText: '',
	rubricCriteriaText: '',
	rubricEvidencePolicyText: '',
	rubricText: '',
	sourceMaterialIds: [],
});

export const createQuestionFormValues = (question?: ExamQuestion): ExamQuestionFormValues => {
	if (!question) {
		return createEmptyQuestionForm();
	}

	const answerOptions = getQuestionAnswerOptions(question);
	const answerKey = question.answer_key_data;
	const rubricCriteria = getQuestionRubricCriteria(question);
	const modelAnswerText = answerKey?.model_answer ?? question.correct_answer_text ?? '';

	return {
		acceptableAnswersText: joinLines(answerKey?.acceptable_answers),
		answerOptions,
		bloomLevel: question.bloom_level,
		correctOptionId: getCorrectOptionId(question, answerOptions),
		difficulty: question.difficulty,
		expectedPointsText: joinLines(answerKey?.expected_points),
		followUpQuestionsText: joinLines(answerKey?.follow_up_questions),
		intentText: question.intent_text,
		maxScore: String(question.max_score),
		modelAnswerText,
		questionNumber: String(question.question_number),
		questionText: question.question_text,
		questionType: question.question_type,
		requiredKeywordsText: joinLines(answerKey?.required_keywords),
		rubricCriteriaText: formatRubricCriteriaText(rubricCriteria),
		rubricEvidencePolicyText: question.rubric_data.evidence_policy ?? '',
		rubricText: question.rubric_text,
		sourceMaterialIds: [...question.source_material_ids],
	};
};

export const createAnswerOptionsData = (
	answerOptions: ExamQuestionAnswerOption[],
	correctOptionId: string,
): ExamQuestionAnswerOption[] =>
	answerOptions.map((option) => ({
		...option,
		text: option.text.trim(),
		is_correct: option.id === correctOptionId,
		explanation: option.explanation ?? null,
	}));

export const createRubricCriteriaData = (criteriaText: string, maxScore: number): ExamQuestionRubricCriterion[] => {
	const lines = splitLines(criteriaText);
	const defaultPoints = lines.length > 0 ? Number((maxScore / lines.length).toFixed(2)) : 0;

	return lines.map((line, index) => {
		const [rawName, rawDescription, rawPoints] = line.split('|').map((part) => part.trim());
		const parsedPoints = rawPoints ? Number(rawPoints) : Number.NaN;
		const description = rawDescription || rawName;

		return {
			name: rawDescription ? rawName || `기준 ${index + 1}` : `기준 ${index + 1}`,
			description,
			points: Number.isFinite(parsedPoints) && parsedPoints > 0 ? parsedPoints : defaultPoints,
		};
	});
};

export const createAnswerKeyData = (form: ExamQuestionFormValues): ExamQuestionAnswerKey | null => {
	if (form.questionType === 'none') {
		return null;
	}

	if (form.questionType === 'multiple_choice') {
		const hasCorrectOption = form.answerOptions.some((option) => option.id === form.correctOptionId);

		return {
			type: form.questionType,
			correct_option_ids: hasCorrectOption ? [form.correctOptionId] : [],
		};
	}

	if (form.questionType === 'subjective') {
		return {
			type: form.questionType,
			model_answer: form.modelAnswerText.trim() || null,
			acceptable_answers: splitLines(form.acceptableAnswersText),
			required_keywords: splitLines(form.requiredKeywordsText),
		};
	}

	return {
		type: form.questionType,
		expected_points: splitLines(form.expectedPointsText),
		follow_up_questions: splitLines(form.followUpQuestionsText),
	};
};

export const createRubricData = (form: ExamQuestionFormValues, maxScore: number): ExamQuestionRubric => ({
	criteria: createRubricCriteriaData(form.rubricCriteriaText, maxScore),
	evidence_policy: form.rubricEvidencePolicyText.trim() || null,
});
