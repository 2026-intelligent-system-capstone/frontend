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
	evidencePolicy: string;
	expectedPointsText: string;
	followUpQuestionsText: string;
	intentText: string;
	maxScore: string;
	modelAnswer: string;
	questionNumber: string;
	questionText: string;
	questionType: ExamQuestionType;
	requiredKeywordsText: string;
	rubricCriteriaText: string;
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

const DEFAULT_MULTIPLE_CHOICE_OPTIONS: ExamQuestionAnswerOption[] = [
	{ id: '1', label: '1', text: '' },
	{ id: '2', label: '2', text: '' },
	{ id: '3', label: '3', text: '' },
];

const joinLines = (values: string[] | undefined): string => values?.join('\n') ?? '';

export const toLegacyAnswerOptions = (answerOptionsData: ExamQuestionAnswerOption[]): string[] =>
	answerOptionsData.map((option) => option.text);

export const toLegacyCorrectAnswerText = (
	form: ExamQuestionFormValues,
	answerOptionsData: ExamQuestionAnswerOption[],
): string | null => {
	if (form.questionType === 'multiple_choice') {
		return answerOptionsData.find((option) => option.is_correct)?.text ?? null;
	}

	if (form.questionType === 'subjective') {
		return form.modelAnswer.trim() || null;
	}

	return null;
};

const splitLines = (text: string): string[] =>
	text
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);

const createNumberedOption = (
	text: string,
	index: number,
	correctAnswerText: string | null,
): ExamQuestionAnswerOption => {
	const label = String(index + 1);
	return {
		id: label,
		label,
		text,
		is_correct: Boolean(correctAnswerText && text === correctAnswerText),
	};
};

export const createDefaultMultipleChoiceOptions = (): ExamQuestionAnswerOption[] =>
	DEFAULT_MULTIPLE_CHOICE_OPTIONS.map((option) => ({ ...option }));

export const toStructuredAnswerOptions = (question: ExamQuestion): ExamQuestionAnswerOption[] => {
	if (question.answer_options_data?.length) {
		return question.answer_options_data.map((option, index) => {
			const fallbackLabel = String(index + 1);
			return {
				id: option.id || fallbackLabel,
				label: option.label || fallbackLabel,
				text: option.text,
				is_correct: option.is_correct,
				explanation: option.explanation ?? null,
			};
		});
	}

	return question.answer_options.map((option, index) =>
		createNumberedOption(option, index, question.correct_answer_text),
	);
};

const formatRubricCriteria = (criteria: ExamQuestionRubricCriterion[] | undefined): string =>
	criteria?.map((criterion) => `${criterion.name} | ${criterion.points} | ${criterion.description}`).join('\n') ?? '';

const createFallbackRubricCriteria = (question: ExamQuestion): ExamQuestionRubricCriterion[] => {
	const rubricText = question.rubric_text.trim();

	if (!rubricText) return [];

	return [
		{
			name: '평가 기준',
			description: rubricText,
			points: question.max_score,
		},
	];
};

const parseRubricCriteriaLine = (line: string): ExamQuestionRubricCriterion | null => {
	const [namePart, pointsPart, ...descriptionParts] = line.split('|').map((part) => part.trim());
	if (!namePart) return null;

	const parsedPoints = Number(pointsPart);
	return {
		name: namePart,
		points: Number.isFinite(parsedPoints) && parsedPoints > 0 ? parsedPoints : 1,
		description: descriptionParts.join(' | ') || namePart,
	};
};

export const parseRubricCriteria = (text: string): ExamQuestionRubricCriterion[] =>
	splitLines(text).flatMap((line) => {
		const criterion = parseRubricCriteriaLine(line);
		return criterion ? [criterion] : [];
	});

export const parseListText = splitLines;

export const createEmptyQuestionForm = (): ExamQuestionFormValues => ({
	acceptableAnswersText: '',
	answerOptions: createDefaultMultipleChoiceOptions(),
	bloomLevel: 'understand',
	correctOptionId: '1',
	difficulty: 'medium',
	evidencePolicy: '',
	expectedPointsText: '',
	followUpQuestionsText: '',
	intentText: '',
	maxScore: '1',
	modelAnswer: '',
	questionNumber: '1',
	questionText: '',
	questionType: 'none',
	requiredKeywordsText: '',
	rubricCriteriaText: '',
	rubricText: '',
	sourceMaterialIds: [],
});

export const createQuestionFormValues = (question?: ExamQuestion): ExamQuestionFormValues => {
	if (!question) {
		return createEmptyQuestionForm();
	}

	const answerOptions = toStructuredAnswerOptions(question);
	const answerKey = question.answer_key_data;
	const rubric = question.rubric_data;
	const rubricCriteria = rubric?.criteria?.length ? rubric.criteria : createFallbackRubricCriteria(question);
	const correctOptionId =
		answerKey?.correct_option_ids?.[0] ?? answerOptions.find((option) => option.is_correct)?.id ?? '';

	return {
		acceptableAnswersText: joinLines(answerKey?.acceptable_answers),
		answerOptions: answerOptions.length > 0 ? answerOptions : createDefaultMultipleChoiceOptions(),
		bloomLevel: question.bloom_level,
		correctOptionId,
		difficulty: question.difficulty,
		evidencePolicy: rubric?.evidence_policy ?? '',
		expectedPointsText: joinLines(answerKey?.expected_points),
		followUpQuestionsText: joinLines(answerKey?.follow_up_questions),
		intentText: question.intent_text,
		maxScore: String(question.max_score),
		modelAnswer: answerKey?.model_answer ?? question.correct_answer_text ?? '',
		questionNumber: String(question.question_number),
		questionText: question.question_text,
		questionType: question.question_type,
		requiredKeywordsText: joinLines(answerKey?.required_keywords),
		rubricCriteriaText: formatRubricCriteria(rubricCriteria),
		rubricText: question.rubric_text,
		sourceMaterialIds: [...question.source_material_ids],
	};
};

export const buildAnswerKeyData = (
	form: ExamQuestionFormValues,
	answerOptionsData: ExamQuestionAnswerOption[] = normalizeAnswerOptionsData(form),
): ExamQuestionAnswerKey => {
	if (form.questionType === 'multiple_choice') {
		return {
			type: 'multiple_choice',
			correct_option_ids: answerOptionsData.filter((option) => option.is_correct).map((option) => option.id),
			model_answer: null,
			acceptable_answers: [],
			required_keywords: [],
			expected_points: [],
			follow_up_questions: [],
		};
	}

	if (form.questionType === 'subjective') {
		return {
			type: 'subjective',
			correct_option_ids: [],
			model_answer: form.modelAnswer.trim() || null,
			acceptable_answers: parseListText(form.acceptableAnswersText),
			required_keywords: parseListText(form.requiredKeywordsText),
			expected_points: [],
			follow_up_questions: [],
		};
	}

	if (form.questionType === 'oral') {
		return {
			type: 'oral',
			correct_option_ids: [],
			model_answer: null,
			acceptable_answers: [],
			required_keywords: [],
			expected_points: parseListText(form.expectedPointsText),
			follow_up_questions: parseListText(form.followUpQuestionsText),
		};
	}

	return { type: 'none' };
};

export const buildRubricData = (form: ExamQuestionFormValues): ExamQuestionRubric => ({
	criteria: form.questionType === 'multiple_choice' ? [] : parseRubricCriteria(form.rubricCriteriaText),
	evidence_policy: form.questionType === 'oral' ? form.evidencePolicy.trim() || null : null,
});

export const normalizeAnswerOptionsData = (form: ExamQuestionFormValues): ExamQuestionAnswerOption[] => {
	if (form.questionType !== 'multiple_choice') return [];

	const normalizedOptions = form.answerOptions
		.map((option) => ({
			originalId: option.id,
			text: option.text.trim(),
			explanation: option.explanation?.trim() || null,
		}))
		.filter((option) => option.text);

	return normalizedOptions.map((option, index) => {
		const label = String(index + 1);
		return {
			id: label,
			label,
			text: option.text,
			is_correct: option.originalId === form.correctOptionId,
			explanation: option.explanation,
		};
	});
};
