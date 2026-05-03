'use client';

import {
	type Exam,
	formatExamDateTime,
	getExamMaxAttemptsLabel,
	getExamStatusColor,
	getExamStatusLabel,
	getExamTypeColor,
	getExamTypeLabel,
} from '@/entities/exam';
import { CalendarIcon, ClockIcon, DocumentIcon } from '@/shared/ui/icons/exam';
import { Chip, EmptyState, Table } from '@heroui/react';

interface ExamsTableProps {
	exams: Exam[];
	onSelectExam: (examId: string) => void;
}

export function ExamsTable({ exams, onSelectExam }: ExamsTableProps) {
	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="시험 목록" className="table-fixed">
					<Table.Header>
						<Table.Column isRowHeader className="w-24">
							시험
						</Table.Column>
						<Table.Column className="w-20">유형</Table.Column>
						<Table.Column className="w-24">진행 정보</Table.Column>
						<Table.Column className="w-32">일정</Table.Column>
						<Table.Column className="w-24">문항</Table.Column>
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<EmptyState
								className="border-border-subtle bg-surface flex w-full flex-col items-center
									justify-center rounded-2xl border border-dashed py-10 text-center"
							>
								<span className="text-neutral-gray-500 text-sm">생성된 시험이 없습니다.</span>
							</EmptyState>
						)}
					>
						{exams.map((exam) => (
							<Table.Row key={exam.id}>
								<Table.Cell>
									<button
										type="button"
										className="flex w-full min-w-0 cursor-pointer flex-col space-y-2 overflow-hidden
											text-left"
										onClick={() => onSelectExam(exam.id)}
									>
										<div className="flex items-center gap-2 overflow-hidden">
											<DocumentIcon className="text-neutral-gray-500 size-4 shrink-0" />
											<p
												className="text-neutral-text truncate font-medium underline-offset-2
													hover:underline"
											>
												{exam.title}
											</p>
										</div>
										<p className="text-neutral-gray-500 truncate text-sm">
											{exam.description ?? '설명 없음'}
										</p>
									</button>
								</Table.Cell>
								<Table.Cell>
									<div className="w-28 overflow-hidden">
										<Chip
											className="max-w-full"
											color={getExamTypeColor(exam.exam_type)}
											size="sm"
											variant="soft"
										>
											<Chip.Label>{getExamTypeLabel(exam.exam_type)}</Chip.Label>
										</Chip>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div className="w-40 space-y-2 overflow-hidden">
										<Chip
											className="max-w-full"
											color={getExamStatusColor(exam.status)}
											size="sm"
											variant="soft"
										>
											<Chip.Label>{getExamStatusLabel(exam.status)}</Chip.Label>
										</Chip>
										<div
											className="text-neutral-gray-500 flex items-center gap-2 overflow-hidden
												text-sm"
										>
											<ClockIcon className="size-4 shrink-0 text-amber-500" />
											<span className="truncate">{exam.duration_minutes}분</span>
										</div>
										<p className="text-neutral-gray-500 truncate text-sm">
											{getExamMaxAttemptsLabel(exam.max_attempts)}
										</p>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div className="text-neutral-gray-700 w-80 space-y-1 overflow-hidden text-sm">
										<div className="flex items-center gap-2 overflow-hidden">
											<CalendarIcon className="size-4 shrink-0 text-blue-500" />
											<span className="truncate">시작 {formatExamDateTime(exam.starts_at)}</span>
										</div>
										<div className="flex items-center gap-2 overflow-hidden">
											<CalendarIcon className="size-4 shrink-0 text-emerald-500" />
											<span className="truncate">종료 {formatExamDateTime(exam.ends_at)}</span>
										</div>
									</div>
								</Table.Cell>
								<Table.Cell>
									<span
										className="text-neutral-gray-700 block w-24 truncate text-left text-sm
											font-medium"
									>
										{exam.questions.length}개
									</span>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Content>
			</Table.ScrollContainer>
		</Table>
	);
}
