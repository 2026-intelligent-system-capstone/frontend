'use client';

import type { User } from '@/entities/user';
import { TrashIcon } from '@/shared/ui/icons/action-icons';
import { MailIcon, UserIcon } from '@/shared/ui/icons/user-icons';
import { Button, ButtonGroup, Chip, EmptyState, Table, Tooltip } from '@heroui/react';

interface StudentsTableProps {
	students: User[];
	canManageStudents: boolean;
	removePending: boolean;
	onRemoveStudent: (studentId: string) => void;
}

export function StudentsTable({ students, canManageStudents, removePending, onRemoveStudent }: StudentsTableProps) {
	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="학생 목록" className="min-w-3xl table-fixed">
					<Table.Header>
						<Table.Column className="w-44">학번 / 로그인 ID</Table.Column>
						<Table.Column isRowHeader className="w-48">
							이름
						</Table.Column>
						<Table.Column className="w-64">이메일</Table.Column>
						<Table.Column className="w-24">작업</Table.Column>
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<EmptyState className="flex w-full flex-col items-center justify-center py-10 text-center">
								<span className="text-sm text-slate-500">초대된 학생이 없습니다.</span>
							</EmptyState>
						)}
					>
						{students.map((student) => (
							<Table.Row key={student.id}>
								<Table.Cell>
									<div className="w-44 overflow-hidden">
										<Chip className="max-w-full" color="accent" size="sm" variant="soft">
											<Chip.Label>{student.login_id}</Chip.Label>
										</Chip>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div className="flex w-48 items-center gap-2 overflow-hidden">
										<UserIcon className="size-4 shrink-0 text-blue-500" />
										<span className="truncate font-medium text-slate-900">{student.name}</span>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div className="flex w-64 items-center gap-2 overflow-hidden text-sm text-slate-700">
										<MailIcon className="size-4 shrink-0 text-emerald-500" />
										<span className="truncate">{student.email ?? '-'}</span>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div className="w-24 overflow-hidden">
										{canManageStudents ? (
											<ButtonGroup size="sm">
												<Tooltip delay={0}>
													<Tooltip.Trigger>
														<Button
															aria-label={`${student.name} 제거`}
															isIconOnly
															isPending={removePending}
															variant="danger-soft"
															onPress={() => onRemoveStudent(student.id)}
														>
															<TrashIcon className="size-4" />
														</Button>
													</Tooltip.Trigger>
													<Tooltip.Content showArrow>
														<Tooltip.Arrow />
														<p>제거</p>
													</Tooltip.Content>
												</Tooltip>
											</ButtonGroup>
										) : null}
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
