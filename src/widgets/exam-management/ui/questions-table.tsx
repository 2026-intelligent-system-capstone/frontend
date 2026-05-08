'use client';

import {
	type Exam,
	type ExamQuestion,
	type ExamQuestionAnswerOption,
	getBloomLevelColor,
	getBloomLevelLabel,
	getDifficultyColor,
	getDifficultyLabel,
	getQuestionStatusColor,
	getQuestionStatusLabel,
	getQuestionTypeColor,
	getQuestionTypeLabel,
} from '@/entities/exam';
import { PencilIcon } from '@/shared/ui/icons/exam';
import { Button, Chip, EmptyState, Table, Tooltip } from '@heroui/react';

interface ExamManagementQuestionsTableProps {
	exam: Exam;
	onEditQuestion: (question: ExamQuestion) => void;
}

function getAnswerOptions(question: ExamQuestion): ExamQuestionAnswerOption[] {
	if (question.answer_options_data?.length) {
		return question.answer_options_data;
	}

	return question.answer_options.map((text, index) => ({
		id: String(index + 1),
		label: String(index + 1),
		text,
		is_correct: Boolean(question.correct_answer_text && question.correct_answer_text === text),
	}));
}

function renderMultipleChoiceAnswer(question: ExamQuestion) {
	const options = getAnswerOptions(question);
	const correctOptionIds = question.answer_key_data?.correct_option_ids ?? [];
	const correctLabels = options
		.filter((option) => correctOptionIds.includes(option.id) || option.is_correct)
		.map((option) => option.label);

	return (
		<div className="border-brand-border bg-brand-soft mt-2 flex flex-col gap-1 rounded-lg border px-3 py-2">
			<p className="text-brand-deep mb-1 text-[10px] font-semibold tracking-wide uppercase">보기</p>
			{options.map((option) => (
				<div key={option.id} className="text-neutral-gray-700 flex items-center gap-2 text-xs">
					<span
						className="bg-surface text-brand-deep flex h-4 min-w-4 shrink-0 items-center justify-center
							rounded-full px-1 text-[9px] font-bold"
					>
						{option.label}
					</span>
					<span className="truncate">{option.text}</span>
				</div>
			))}
			{correctLabels.length > 0 ? (
				<p className="border-border-subtle text-brand-deep mt-1 border-t pt-1 text-xs font-medium">
					정답: {correctLabels.join(', ')}
				</p>
			) : null}
		</div>
	);
}

function renderSubjectiveAnswer(question: ExamQuestion) {
	const answerKey = question.answer_key_data;
	const modelAnswer = answerKey?.model_answer ?? question.correct_answer_text;
	const acceptableAnswers = answerKey?.acceptable_answers ?? [];
	const requiredKeywords = answerKey?.required_keywords ?? [];

	return (
		<div className="mt-2 space-y-1">
			{modelAnswer ? <p className="text-brand-deep truncate text-sm">모범 답안: {modelAnswer}</p> : null}
			{acceptableAnswers.length > 0 ? (
				<p className="text-neutral-gray-500 truncate text-xs">허용 답안: {acceptableAnswers.join(', ')}</p>
			) : null}
			{requiredKeywords.length > 0 ? (
				<p className="text-neutral-gray-500 truncate text-xs">키워드: {requiredKeywords.join(', ')}</p>
			) : null}
		</div>
	);
}

function renderOralAnswer(question: ExamQuestion) {
	const answerKey = question.answer_key_data;
	const expectedPoints = answerKey?.expected_points ?? [];
	const followUpQuestions = answerKey?.follow_up_questions ?? [];
	const criteria = question.rubric_data?.criteria ?? [];

	return (
		<div className="mt-2 space-y-1">
			{expectedPoints.length > 0 ? (
				<p className="text-brand-deep truncate text-sm">포인트: {expectedPoints.join(', ')}</p>
			) : null}
			{followUpQuestions.length > 0 ? (
				<p className="text-neutral-gray-500 truncate text-xs">꼬리질문: {followUpQuestions.length}개</p>
			) : null}
			{criteria.length > 0 ? (
				<p className="text-neutral-gray-500 truncate text-xs">루브릭: {criteria.length}개 기준</p>
			) : null}
		</div>
	);
}

function renderQuestionAnswer(question: ExamQuestion) {
	if (question.question_type === 'multiple_choice') {
		return renderMultipleChoiceAnswer(question);
	}

	if (question.question_type === 'subjective') {
		return renderSubjectiveAnswer(question);
	}

	if (question.question_type === 'oral') {
		return renderOralAnswer(question);
	}

	return null;
}

export function ExamManagementQuestionsTable({ exam, onEditQuestion }: ExamManagementQuestionsTableProps) {
	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label={`${exam.title} 문항 목록`} className="min-w-7xl table-fixed">
					<Table.Header>
						<Table.Column isRowHeader className="w-20">
							번호
						</Table.Column>
						<Table.Column className="w-24">배점</Table.Column>
						<Table.Column className="w-28">유형</Table.Column>
						<Table.Column className="w-28">Bloom</Table.Column>
						<Table.Column className="w-28">난이도</Table.Column>
						<Table.Column className="w-96">문항/정답</Table.Column>
						<Table.Column className="w-56">평가 의도</Table.Column>
						<Table.Column className="w-32">상태</Table.Column>
						<Table.Column className="w-24">작업</Table.Column>
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<EmptyState
								className="border-border-subtle bg-surface flex w-full flex-col items-center justify-center
									rounded-2xl border border-dashed py-10 text-center"
							>
								<span className="text-neutral-gray-500 text-sm">아직 생성된 문항이 없습니다.</span>
							</EmptyState>
						)}
					>
						{exam.questions.map((question) => (
							<Table.Row key={question.id}>
								<Table.Cell>
									<span className="text-neutral-gray-700 block w-20 truncate font-medium">
										{question.question_number}
									</span>
								</Table.Cell>
								<Table.Cell>
									<span className="text-neutral-gray-700 block w-24 truncate text-sm font-medium">
										{question.max_score}점
									</span>
								</Table.Cell>
								<Table.Cell>
									<div className="w-28 overflow-hidden">
										<Chip
											className="max-w-full"
											color={getQuestionTypeColor(question.question_type)}
											size="sm"
											variant="soft"
										>
											<Chip.Label>{getQuestionTypeLabel(question.question_type)}</Chip.Label>
										</Chip>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div className="w-28 overflow-hidden">
										<Chip
											className="max-w-full"
											color={getBloomLevelColor(question.bloom_level)}
											size="sm"
											variant="soft"
										>
											<Chip.Label>{getBloomLevelLabel(question.bloom_level)}</Chip.Label>
										</Chip>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div className="w-28 overflow-hidden">
										<Chip
											className="max-w-full"
											color={getDifficultyColor(question.difficulty)}
											size="sm"
											variant="soft"
										>
											<Chip.Label>{getDifficultyLabel(question.difficulty)}</Chip.Label>
										</Chip>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div className="w-96 overflow-hidden">
										<p className="text-neutral-text truncate font-medium">{question.question_text}</p>
										{renderQuestionAnswer(question)}
									</div>
								</Table.Cell>
								<Table.Cell>
									<p className="text-neutral-gray-700 w-56 truncate text-sm">{question.intent_text}</p>
								</Table.Cell>
								<Table.Cell>
									<div className="w-32 overflow-hidden">
										<Chip
											className="max-w-full"
											color={getQuestionStatusColor(question.status)}
											size="sm"
											variant="soft"
										>
											<Chip.Label>{getQuestionStatusLabel(question.status)}</Chip.Label>
										</Chip>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div className="flex w-24 items-center gap-1 overflow-hidden">
										<Tooltip delay={0}>
											<Tooltip.Trigger>
												<Button
													aria-label={`${question.question_number}번 문항 수정`}
													isIconOnly
													size="sm"
													variant="secondary"
													onPress={() => onEditQuestion(question)}
												>
													<PencilIcon className="size-4" />
												</Button>
											</Tooltip.Trigger>
											<Tooltip.Content showArrow>
												<Tooltip.Arrow />
												<p>수정</p>
											</Tooltip.Content>
										</Tooltip>
									</div>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Content>
			</Table.ScrollContainer>
		</Table>
	);
}
