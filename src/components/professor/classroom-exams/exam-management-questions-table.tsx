import { Button, Chip, EmptyState, Table, Tooltip } from '@heroui/react';

import type { Exam, ExamQuestion } from '@/types/exam';

import {
	getBloomLevelColor,
	getBloomLevelLabel,
	getDifficultyColor,
	getDifficultyLabel,
	getQuestionStatusColor,
	getQuestionStatusLabel,
} from '@/lib/classrooms/exam-presentation';

import { PencilIcon, TrashIcon } from '@/components/professor/classroom-exams/exam-icons';

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
						<Table.Column className="w-28">Bloom</Table.Column>
						<Table.Column className="w-28">난이도</Table.Column>
						<Table.Column className="w-96">문항</Table.Column>
						<Table.Column className="w-56">범위</Table.Column>
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
										<p className="mt-1 truncate text-sm text-slate-500">
											{question.evaluation_objective}
										</p>
									</div>
								</Table.Cell>
								<Table.Cell>
									<p className="w-56 truncate text-sm text-slate-700">{question.scope_text}</p>
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
