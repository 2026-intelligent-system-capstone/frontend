'use client';

import type { ReactNode } from 'react';

import { Card, Modal } from '@heroui/react';

import type { Exam } from '@/types/exam';

import { formatExamDateTime, getExamStatusLabel, getExamTypeLabel } from '@/lib/classrooms/exam-presentation';

interface ExamDetailModalProps {
	exam: Exam | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	children: ReactNode;
}

export function ExamDetailModal({ exam, isOpen, onOpenChange, children }: ExamDetailModalProps) {
	return (
		<Modal>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-6xl">
						{exam ? (
							<>
								<Modal.CloseTrigger />
								<Modal.Header>
									<div className="space-y-2">
										<Modal.Heading>{exam.title}</Modal.Heading>
										<p className="text-sm text-slate-500">
											{getExamTypeLabel(exam.exam_type)} · {getExamStatusLabel(exam.status)} ·
											문항 {exam.questions.length}개
										</p>
									</div>
								</Modal.Header>
								<Modal.Body className="space-y-6 p-6">
									<div className="grid gap-3 md:grid-cols-3">
										<Card className="border border-slate-200 bg-slate-50">
											<Card.Content className="space-y-2 py-4 text-sm text-slate-600">
												<p className="font-medium text-slate-900">시험 일정</p>
												<p>시작 {formatExamDateTime(exam.starts_at)}</p>
												<p>종료 {formatExamDateTime(exam.ends_at)}</p>
											</Card.Content>
										</Card>
										<Card className="border border-slate-200 bg-slate-50">
											<Card.Content className="space-y-2 py-4 text-sm text-slate-600">
												<p className="font-medium text-slate-900">운영 정보</p>
												<p>진행 시간 {exam.duration_minutes}분</p>
												<p>설명 {exam.description ?? '설명 없음'}</p>
											</Card.Content>
										</Card>
										<Card className="border border-slate-200 bg-slate-50">
											<Card.Content className="space-y-2 py-4 text-sm text-slate-600">
												<p className="font-medium text-slate-900">문항 현황</p>
												<p>총 문항 {exam.questions.length}개</p>
												<p>주차 {exam.week}주차</p>
											</Card.Content>
										</Card>
									</div>

									{children}
								</Modal.Body>
							</>
						) : null}
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}
