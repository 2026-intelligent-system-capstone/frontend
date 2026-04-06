'use client';

import type { User } from '@/entities/user';
import { Button, ErrorMessage, Input, Label, Modal, TextField } from '@heroui/react';

interface StudentInviteModalProps {
	isOpen: boolean;
	errorMessage: string | null;
	selectedStudentIds: string[];
	availableStudents: User[];
	onOpenChange: (isOpen: boolean) => void;
	onToggleStudentSelection: (studentId: string) => void;
	onInvite: (close: () => void) => Promise<void>;
	isPending: boolean;
}

export function StudentInviteModal({
	isOpen,
	errorMessage,
	selectedStudentIds,
	availableStudents,
	onOpenChange,
	onToggleStudentSelection,
	onInvite,
	isPending,
}: StudentInviteModalProps) {
	return (
		<Modal>
			<Button variant="primary" onPress={() => onOpenChange(true)}>
				학생 초대
			</Button>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
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
														onClick={() => onToggleStudentSelection(student.id)}
														className={`rounded-2xl border p-4 text-left transition
															${selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
													>
														<p className="font-medium text-slate-900">{student.name}</p>
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
											isPending={isPending}
											variant="primary"
											onPress={() => void onInvite(close)}
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
	);
}
