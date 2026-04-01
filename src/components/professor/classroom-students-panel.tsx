'use client';

import type { SVGProps } from 'react';
import { useMemo, useState } from 'react';

import {
	Button,
	ButtonGroup,
	Card,
	Chip,
	ErrorMessage,
	Input,
	Label,
	Modal,
	Skeleton,
	Table,
	TextField,
	Tooltip,
} from '@heroui/react';

import { ApiClientError } from '@/types/api';
import type { User } from '@/types/user';

import { useInviteClassroomStudents, useRemoveClassroomStudent } from '@/lib/hooks/use-classrooms';

interface ClassroomStudentsPanelProps {
	classroomId: string;
	students: User[];
	users: User[];
	isLoading: boolean;
	isError: boolean;
	canManageStudents: boolean;
}

const UserIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
		<path d="M6.75 18.25a5.25 5.25 0 0 1 10.5 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);

const MailIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<rect x="4.75" y="6.25" width="14.5" height="11.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
		<path
			d="m5.75 7.25 6.25 5 6.25-5"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
	</svg>
);

const TrashIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path d="M9.25 4.75h5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path d="M5.75 7.75h12.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path
			d="M8.25 7.75v10a1.5 1.5 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5v-10"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path d="M10.25 10.5v5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path d="M13.75 10.5v5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);

export function ClassroomStudentsPanel({
	classroomId,
	students,
	users,
	isLoading,
	isError,
	canManageStudents,
}: ClassroomStudentsPanelProps) {
	const [isInviteOpen, setIsInviteOpen] = useState(false);
	const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { mutateAsync: inviteStudents, isPending: invitePending } = useInviteClassroomStudents(classroomId);
	const { mutate: removeStudent, isPending: removePending } = useRemoveClassroomStudent(classroomId);

	const enrolledIds = useMemo(() => new Set(students.map((student) => student.id)), [students]);
	const availableStudents = useMemo(
		() =>
			users.filter(
				(candidate) => candidate.role === 'student' && !candidate.is_deleted && !enrolledIds.has(candidate.id),
			),
		[enrolledIds, users],
	);

	const toggleStudentSelection = (studentId: string) => {
		setSelectedStudentIds((current) =>
			current.includes(studentId) ? current.filter((id) => id !== studentId) : [...current, studentId],
		);
	};

	const handleInvite = async (close: () => void) => {
		setErrorMessage(null);

		if (selectedStudentIds.length === 0) {
			setErrorMessage('초대할 학생을 한 명 이상 선택해주세요.');
			return;
		}

		try {
			await inviteStudents({ student_ids: selectedStudentIds });
			setSelectedStudentIds([]);
			close();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('학생 초대 중 오류가 발생했습니다.');
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-lg font-semibold text-slate-900">학생 관리</h2>
					<p className="mt-1 text-sm text-slate-500">강의실에 소속된 학생을 초대하거나 제거할 수 있습니다.</p>
				</div>
				{canManageStudents ? (
					<Modal>
						<Button variant="primary" onPress={() => setIsInviteOpen(true)}>
							학생 초대
						</Button>
						<Modal.Backdrop isOpen={isInviteOpen} onOpenChange={setIsInviteOpen}>
							<Modal.Container>
								<Modal.Dialog className="sm:max-w-2xl">
									{({ close }) => (
										<>
											<Modal.CloseTrigger />
											<Modal.Header>
												<Modal.Heading>학생 초대</Modal.Heading>
												<p className="mt-1 text-sm text-slate-500">
													미등록 학생만 선택할 수 있습니다.
												</p>
											</Modal.Header>
											<Modal.Body className="space-y-4 p-6">
												<TextField className="w-full">
													<Label>선택된 학생 수</Label>
													<Input readOnly value={`${selectedStudentIds.length}명`} />
												</TextField>

												{availableStudents.length === 0 ? (
													<p className="text-sm text-slate-500">
														추가로 초대할 수 있는 학생이 없습니다.
													</p>
												) : (
													<div
														className="grid max-h-80 gap-3 overflow-y-auto pr-1
															md:grid-cols-2"
													>
														{availableStudents.map((student) => {
															const selected = selectedStudentIds.includes(student.id);

															return (
																<button
																	key={student.id}
																	type="button"
																	onClick={() => toggleStudentSelection(student.id)}
																	className={`rounded-2xl border p-4 text-left
																		transition
																		${selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
																>
																	<p className="font-medium text-slate-900">
																		{student.name}
																	</p>
																	<p className="mt-1 text-sm text-slate-600">
																		{student.login_id}
																	</p>
																	<p className="mt-1 text-xs text-slate-500">
																		{student.email ?? '이메일 없음'}
																	</p>
																</button>
															);
														})}
													</div>
												)}

												{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

												<div className="flex justify-end gap-3">
													<Button type="button" variant="secondary" onPress={close}>
														취소
													</Button>
													<Button
														isPending={invitePending}
														onPress={() => handleInvite(close)}
														variant="primary"
													>
														초대하기
													</Button>
												</div>
											</Modal.Body>
										</>
									)}
								</Modal.Dialog>
							</Modal.Container>
						</Modal.Backdrop>
					</Modal>
				) : null}
			</div>

			{isLoading && students.length === 0 ? (
				<div className="grid gap-3 md:grid-cols-2">
					{Array.from({ length: 2 }).map((_, index) => (
						<Card key={index} className="border border-slate-200 bg-slate-50">
							<Card.Content className="space-y-3 py-4 text-sm text-slate-600">
								<div className="flex items-start justify-between gap-3">
									<div className="flex-1 space-y-2">
										<Skeleton className="h-5 w-24 rounded-lg" />
										<Skeleton className="h-4 w-20 rounded-lg" />
										<Skeleton className="h-4 w-32 rounded-lg" />
									</div>
									<Skeleton className="h-8 w-16 rounded-lg" />
								</div>
							</Card.Content>
						</Card>
					))}
				</div>
			) : isError ? (
				<p className="text-sm text-red-600">구성원 목록을 불러오지 못했습니다.</p>
			) : students.length === 0 ? (
				<Card className="border border-dashed border-slate-200 bg-slate-50">
					<Card.Content className="py-8 text-center text-sm text-slate-500">
						초대된 학생이 없습니다.
					</Card.Content>
				</Card>
			) : (
				<Table>
					<Table.ScrollContainer>
						<Table.Content aria-label="학생 목록" className="min-w-[720px] table-fixed">
							<Table.Header>
								<Table.Column className="w-[170px]">학번 / 로그인 ID</Table.Column>
								<Table.Column isRowHeader className="w-[180px]">이름</Table.Column>
								<Table.Column className="w-[250px]">이메일</Table.Column>
								<Table.Column className="w-[84px]">작업</Table.Column>
							</Table.Header>
							<Table.Body>
								{students.map((student) => (
									<Table.Row key={student.id}>
										<Table.Cell>
											<div className="w-[170px] overflow-hidden">
												<Chip className="max-w-full" color="accent" size="sm" variant="soft">
													<Chip.Label>{student.login_id}</Chip.Label>
												</Chip>
											</div>
										</Table.Cell>
										<Table.Cell>
											<div className="flex w-[180px] items-center gap-2 overflow-hidden">
												<UserIcon className="size-4 shrink-0 text-blue-500" />
												<span className="truncate font-medium text-slate-900">{student.name}</span>
											</div>
										</Table.Cell>
										<Table.Cell>
											<div className="flex w-[250px] items-center gap-2 overflow-hidden text-sm text-slate-700">
												<MailIcon className="size-4 shrink-0 text-emerald-500" />
												<span className="truncate">{student.email ?? '-'}</span>
											</div>
										</Table.Cell>
										<Table.Cell>
											<div className="w-[84px] overflow-hidden">
												{canManageStudents ? (
													<ButtonGroup size="sm">
														<Button
															aria-label={`${student.name} 제거`}
															isIconOnly
															isPending={removePending}
															variant="danger-soft"
															onPress={() => removeStudent(student.id)}
														>
															<Tooltip delay={0}>
																<Tooltip.Trigger aria-label="제거" className="contents">
																	<TrashIcon className="size-4" />
																</Tooltip.Trigger>
																<Tooltip.Content showArrow>
																	<Tooltip.Arrow />
																	<p>제거</p>
																</Tooltip.Content>
															</Tooltip>
														</Button>
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
			)}
		</div>
	);
}
