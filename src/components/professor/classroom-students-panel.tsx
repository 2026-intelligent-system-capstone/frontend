'use client';

import { Button, Card, Input, Label, Modal, TextField } from '@heroui/react';
import { useMemo, useState } from 'react';

import { useInviteClassroomStudents, useRemoveClassroomStudent } from '@/lib/hooks/use-classrooms';
import { useAuth } from '@/lib/hooks/use-auth';
import { ApiClientError } from '@/types/api';
import type { User } from '@/types/user';

interface ClassroomStudentsPanelProps {
	classroomId: string;
	students: User[];
	users: User[];
	isLoading: boolean;
}

export function ClassroomStudentsPanel({ classroomId, students, users, isLoading }: ClassroomStudentsPanelProps) {
	const { user } = useAuth();
	const canManageStudents = user?.role === 'professor' || user?.role === 'admin';
	const [isInviteOpen, setIsInviteOpen] = useState(false);
	const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { mutateAsync: inviteStudents, isPending: invitePending } = useInviteClassroomStudents(classroomId);
	const { mutate: removeStudent, isPending: removePending } = useRemoveClassroomStudent(classroomId);

	const enrolledIds = useMemo(() => new Set(students.map((student) => student.id)), [students]);
	const availableStudents = useMemo(
		() => users.filter((candidate) => candidate.role === 'student' && !candidate.is_deleted && !enrolledIds.has(candidate.id)),
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
												<p className="mt-1 text-sm text-slate-500">미등록 학생만 선택할 수 있습니다.</p>
											</Modal.Header>
											<Modal.Body className="space-y-4 p-6">
												<TextField className="w-full">
													<Label>선택된 학생 수</Label>
													<Input readOnly value={`${selectedStudentIds.length}명`} />
												</TextField>

												{availableStudents.length === 0 ? (
													<p className="text-sm text-slate-500">추가로 초대할 수 있는 학생이 없습니다.</p>
												) : (
													<div className="grid max-h-80 gap-3 overflow-y-auto pr-1 md:grid-cols-2">
														{availableStudents.map((student) => {
															const selected = selectedStudentIds.includes(student.id);

															return (
																<button
																	key={student.id}
																	type="button"
																	onClick={() => toggleStudentSelection(student.id)}
																	className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
																>
																	<p className="font-medium text-slate-900">{student.name}</p>
																	<p className="mt-1 text-sm text-slate-600">{student.login_id}</p>
																	<p className="mt-1 text-xs text-slate-500">{student.email ?? '이메일 없음'}</p>
																</button>
															);
														})}
													</div>
												)}

												{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

												<div className="flex justify-end gap-3">
													<Button type="button" variant="secondary" onPress={close}>
														취소
													</Button>
													<Button isPending={invitePending} onPress={() => handleInvite(close)} variant="primary">
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

			{isLoading ? (
				<p className="text-sm text-slate-500">구성원을 불러오는 중입니다.</p>
			) : students.length === 0 ? (
				<Card className="border border-dashed border-slate-200 bg-slate-50">
					<Card.Content className="py-8 text-center text-sm text-slate-500">초대된 학생이 없습니다.</Card.Content>
				</Card>
			) : (
				<div className="grid gap-3 md:grid-cols-2">
					{students.map((student) => (
						<Card key={student.id} className="border border-slate-200 bg-slate-50">
							<Card.Content className="space-y-3 py-4 text-sm text-slate-600">
								<div className="flex items-start justify-between gap-3">
									<div className="space-y-1">
										<p className="font-medium text-slate-900">{student.name}</p>
										<p>{student.login_id}</p>
										<p>{student.email ?? '이메일 없음'}</p>
									</div>
									{canManageStudents ? (
										<Button
											size="sm"
											variant="ghost"
											isPending={removePending}
											onPress={() => removeStudent(student.id)}
										>
											제거
										</Button>
									) : null}
								</div>
							</Card.Content>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
