'use client';

import {
	type Exam,
	type ExamQuestion,
	getBloomLevelColor,
	getBloomLevelLabel,
	getDifficultyColor,
	getDifficultyLabel,
	getQuestionStatusColor,
	getQuestionStatusLabel,
	getQuestionTypeColor,
	getQuestionTypeLabel,
} from '@/entities/exam';
import { PencilIcon, TrashIcon } from '@/shared/ui/icons/exam';
import { Button, Chip, EmptyState, Table, Tooltip } from '@heroui/react';

interface ExamManagementQuestionsTableProps {
	exam: Exam;
	deletingQuestionId: string | null;
	isDeletePending: boolean;
	onDeleteQuestion: (questionId: string) => void;
	onEditQuestion: (question: ExamQuestion) => void;
}

export function ExamManagementQuestionsTable({
	exam,
	deletingQuestionId,
	isDeletePending,
	onDeleteQuestion,
	onEditQuestion,
}: ExamManagementQuestionsTableProps) {
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
						<Table.Column className="w-32">작업</Table.Column>
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<EmptyState className="flex w-full flex-col items-center justify-center py-10 text-center">
								<span className="text-sm text-slate-500">아직 생성된 문항이 없습니다.</span>
							</EmptyState>
						)}
					>
						{exam.questions.map((question) => (
							<Table.Row key={question.id}>
								<Table.Cell>
									<span className="block w-20 truncate font-medium text-slate-700">
										{question.question_number}
									</span>
								</Table.Cell>
								<Table.Cell>
									<span className="block w-24 truncate text-sm font-medium text-slate-700">
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
										<p className="truncate font-medium text-slate-900">{question.question_text}</p>
										{question.answer_options.length > 0 ? (
											<div className="mt-2 flex flex-col gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
												<p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
													보기
												</p>
												{question.answer_options.map((option, index) => (
													<div key={index} className="flex items-center gap-2 text-xs text-slate-700">
														<span
															className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-200
																text-[9px] font-bold text-emerald-700"
														>
															{index + 1}
														</span>
														<span className="truncate">{option}</span>
													</div>
												))}
												{question.correct_answer_text && (
													<p className="mt-1 border-t border-emerald-100 pt-1 text-xs font-medium text-emerald-700">
														정답: {question.correct_answer_text}
													</p>
												)}
											</div>
										) : null}
										{question.answer_options.length === 0 && question.correct_answer_text ? (
											<p className="mt-1 truncate text-sm text-emerald-700">
												정답: {question.correct_answer_text}
											</p>
										) : null}
									</div>
								</Table.Cell>
								<Table.Cell>
									<p className="w-56 truncate text-sm text-slate-700">{question.intent_text}</p>
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
									<div className="flex w-32 items-center gap-1 overflow-hidden">
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
										<Tooltip delay={0}>
											<Tooltip.Trigger>
												<Button
													aria-label={`${question.question_number}번 문항 삭제`}
													isIconOnly
													isPending={isDeletePending && deletingQuestionId === question.id}
													size="sm"
													variant="danger-soft"
													onPress={() => onDeleteQuestion(question.id)}
												>
													<TrashIcon className="size-4" />
												</Button>
											</Tooltip.Trigger>
											<Tooltip.Content showArrow>
												<Tooltip.Arrow />
												<p>삭제</p>
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
