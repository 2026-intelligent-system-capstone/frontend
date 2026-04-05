'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Card, Modal, Skeleton } from '@heroui/react';

import { ApiClientError } from '@/types/api';
import type { Classroom, ClassroomMaterial } from '@/types/classroom';
import type { Exam, ExamQuestion } from '@/types/exam';

import { formatExamDateTime, getExamStatusLabel, getExamTypeLabel } from '@/lib/classrooms/exam-presentation';
import {
	useClassroomDetail,
	useClassroomExam,
	useClassroomMaterials,
	useDeleteExamQuestion,
} from '@/lib/hooks/use-classrooms';

import { SparklesIcon } from '@/components/professor/classroom-exams/exam-icons';
import { ExamManagementQuestionsTable } from '@/components/professor/classroom-exams/exam-management-questions-table';
import { ExamQuestionEditorForm } from '@/components/professor/classroom-exams/exam-question-editor-form';
import { ExamQuestionGenerationForm } from '@/components/professor/classroom-exams/exam-question-generation-form';

interface ExamManagementPageProps {
	classroomId: string;
	examId: string;
	initialClassroom: Classroom | null;
	initialExam: Exam | null;
	initialMaterials: ClassroomMaterial[];
	isClassroomError: boolean;
	isExamError: boolean;
	isMaterialsError: boolean;
}

type ActivePanel = 'generate' | 'create' | 'edit' | null;

const GENERATION_FORM_ID = 'exam-question-generation-modal-form';
const CREATE_FORM_ID = 'exam-question-create-modal-form';

export function ExamManagementPage({
	classroomId,
	examId,
	initialClassroom,
	initialExam,
	initialMaterials,
	isClassroomError,
	isExamError,
	isMaterialsError,
}: ExamManagementPageProps) {
	const router = useRouter();
	const classroomQuery = useClassroomDetail(classroomId, initialClassroom ?? undefined);
	const examQuery = useClassroomExam(classroomId, examId, initialExam ?? undefined);
	const materialsQuery = useClassroomMaterials(classroomId, initialMaterials);
	const deleteQuestionMutation = useDeleteExamQuestion(classroomId, examId);
	const [activePanel, setActivePanel] = useState<ActivePanel>(null);
	const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
	const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
	const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

	const classroom = classroomQuery.data;
	const exam = examQuery.data;
	const materials = materialsQuery.data ?? [];
	const editingQuestion = exam?.questions.find((question) => question.id === editingQuestionId);
	const editingQuestionFormKey = editingQuestion
		? [
				editingQuestion.id,
				editingQuestion.question_number,
				editingQuestion.question_text,
				editingQuestion.scope_text,
				editingQuestion.evaluation_objective,
				editingQuestion.answer_key,
				editingQuestion.scoring_criteria,
				editingQuestion.bloom_level,
				editingQuestion.difficulty,
				editingQuestion.source_material_ids.join(','),
			].join(':')
		: 'create';

	const handleOpenCreatePanel = () => {
		setDeleteErrorMessage(null);
		setEditingQuestionId(null);
		setActivePanel('create');
	};

	const handleOpenEditPanel = (question: ExamQuestion) => {
		setDeleteErrorMessage(null);
		setEditingQuestionId(question.id);
		setActivePanel('edit');
	};

	const handleClosePanel = () => {
		setEditingQuestionId(null);
		setActivePanel(null);
	};

	const handleToggleGeneratePanel = () => {
		setDeleteErrorMessage(null);
		setEditingQuestionId(null);
		setActivePanel((prev) => (prev === 'generate' ? null : 'generate'));
	};

	const handleToggleCreatePanel = () => {
		if (activePanel === 'create') {
			handleClosePanel();
			return;
		}

		handleOpenCreatePanel();
	};

	const handleModalOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			handleClosePanel();
		}
	};

	const handleDeleteQuestion = async (questionId: string) => {
		setDeleteErrorMessage(null);
		setDeletingQuestionId(questionId);
		try {
			await deleteQuestionMutation.mutateAsync(questionId);
		} catch (error) {
			if (error instanceof ApiClientError) {
				setDeleteErrorMessage(error.message);
			} else {
				setDeleteErrorMessage('문항 삭제 중 오류가 발생했습니다.');
			}
		} finally {
			setDeletingQuestionId(null);
		}
	};

	if ((classroomQuery.isLoading && !initialClassroom) || (examQuery.isLoading && !initialExam)) {
		return (
			<div className="bg-slate-50 px-6 py-10">
				<div className="mx-auto flex max-w-6xl flex-col gap-6">
					<Card>
						<Card.Content className="space-y-6 py-8">
							<Skeleton className="h-8 w-64 rounded-lg" />
							<div className="grid gap-4 md:grid-cols-3">
								{Array.from({ length: 3 }).map((_, index) => (
									<Skeleton key={index} className="rounded-large h-28" />
								))}
							</div>
						</Card.Content>
					</Card>
				</div>
			</div>
		);
	}

	if (
		(isClassroomError && !classroomQuery.isLoading && !classroom) ||
		(isExamError && !examQuery.isLoading && !exam) ||
		classroomQuery.isError ||
		examQuery.isError ||
		!classroom ||
		!exam
	) {
		return (
			<div className="bg-slate-50 px-6 py-10">
				<div className="mx-auto max-w-6xl">
					<Card>
						<Card.Content className="space-y-4 py-10 text-sm text-red-600">
							<p>시험 관리 정보를 불러오지 못했습니다.</p>
							<Button
								type="button"
								variant="secondary"
								onPress={() => router.push(`/professor/classrooms/${classroomId}`)}
							>
								강의실로 돌아가기
							</Button>
						</Card.Content>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-slate-50 px-6 py-10">
			<div className="mx-auto flex max-w-6xl flex-col gap-6">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<Button
						type="button"
						variant="ghost"
						onPress={() => router.push(`/professor/classrooms/${classroomId}`)}
					>
						강의실로 돌아가기
					</Button>
					<p className="text-sm text-slate-500">{classroom.name}</p>
				</div>

				<Card>
					<Card.Header>
						<div className="space-y-2">
							<Card.Title className="text-2xl font-semibold text-slate-900">{exam.title}</Card.Title>
							<Card.Description className="text-sm text-slate-500">
								{getExamTypeLabel(exam.exam_type)} · {getExamStatusLabel(exam.status)} · 문항{' '}
								{exam.questions.length}개
							</Card.Description>
						</div>
					</Card.Header>
					<Card.Content className="space-y-6">
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
					</Card.Content>
				</Card>

				<Card>
					<Card.Header className="flex flex-wrap items-start justify-between gap-4">
						<div>
							<Card.Title className="text-lg font-semibold text-slate-900">문항 관리</Card.Title>
							<Card.Description className="mt-1 text-sm text-slate-500">
								생성·추가·수정을 현재 시험 페이지에서 바로 처리합니다.
							</Card.Description>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button
								variant={activePanel === 'generate' ? 'primary' : 'secondary'}
								onPress={handleToggleGeneratePanel}
							>
								<SparklesIcon className="size-4" />
								AI 문항 생성
							</Button>
							<Button
								variant={activePanel === 'create' ? 'primary' : 'secondary'}
								onPress={handleToggleCreatePanel}
							>
								문항 추가
							</Button>
						</div>
					</Card.Header>
				</Card>

				<Modal>
					<Modal.Backdrop isOpen={activePanel === 'generate'} onOpenChange={handleModalOpenChange}>
						<Modal.Container scroll="inside">
							<Modal.Dialog
								className="flex max-h-[calc(100vh-5rem)] flex-col overflow-clip sm:max-w-4xl"
							>
								<Modal.CloseTrigger />
								<Modal.Header>
									<Modal.Heading>AI 문항 생성</Modal.Heading>
									<p className="mt-1 text-sm text-slate-500">
										적재 완료된 강의 자료와 추출 범위를 기반으로 문항을 생성합니다.
									</p>
								</Modal.Header>
								<Modal.Body className="min-h-0 flex-1 overflow-y-auto p-6">
									<ExamQuestionGenerationForm
										classroomId={classroomId}
										examId={examId}
										formId={GENERATION_FORM_ID}
										hideActions
										hideHeader
										materials={materials}
										onCancel={handleClosePanel}
										onSuccess={handleClosePanel}
									/>
								</Modal.Body>
								<Modal.Footer className="justify-end gap-3 border-t border-slate-200 px-6 py-4">
									<Button type="button" variant="secondary" onPress={handleClosePanel}>
										닫기
									</Button>
									<Button form={GENERATION_FORM_ID} type="submit" variant="primary">
										생성
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>

				<Modal>
					<Modal.Backdrop isOpen={activePanel === 'create'} onOpenChange={handleModalOpenChange}>
						<Modal.Container scroll="inside">
							<Modal.Dialog className="sm:max-w-3xl">
								<Modal.CloseTrigger />
								<Modal.Header>
									<Modal.Heading>문항 추가</Modal.Heading>
									<p className="mt-1 text-sm text-slate-500">
										문항 내용과 연결 자료를 현재 시험 문맥에서 바로 추가합니다.
									</p>
								</Modal.Header>
								<Modal.Body className="p-6">
									<ExamQuestionEditorForm
										key="create"
										classroomId={classroomId}
										examId={examId}
										formId={CREATE_FORM_ID}
										hideActions
										hideHeader
										materials={materials}
										title="문항 추가"
										onCancel={handleClosePanel}
										onSuccess={handleClosePanel}
									/>
								</Modal.Body>
								<Modal.Footer className="justify-end gap-3 border-t border-slate-200 px-6 py-4">
									<Button type="button" variant="secondary" onPress={handleClosePanel}>
										닫기
									</Button>
									<Button form={CREATE_FORM_ID} type="submit" variant="primary">
										저장
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>

				{activePanel === 'edit' && editingQuestion ? (
					<Card>
						<Card.Content className="pt-6">
							<ExamQuestionEditorForm
								key={editingQuestionFormKey}
								classroomId={classroomId}
								examId={examId}
								materials={materials}
								question={editingQuestion}
								title={`${editingQuestion.question_number}번 문항 수정`}
								onCancel={handleClosePanel}
								onSuccess={handleClosePanel}
							/>
						</Card.Content>
					</Card>
				) : null}

				{activePanel === 'edit' && !editingQuestion ? (
					<Card>
						<Card.Content className="space-y-4 py-6 text-sm text-amber-700">
							<p>수정할 문항 정보를 찾을 수 없습니다. 목록을 새로 확인해주세요.</p>
							<div className="flex justify-end">
								<Button type="button" variant="secondary" onPress={handleClosePanel}>
									닫기
								</Button>
							</div>
						</Card.Content>
					</Card>
				) : null}

				<Card>
					<Card.Header>
						<div>
							<Card.Title className="text-lg font-semibold text-slate-900">문항 목록</Card.Title>
							<Card.Description className="mt-1 text-sm text-slate-500">
								총 {exam.questions.length}개
							</Card.Description>
						</div>
					</Card.Header>
					<Card.Content className="space-y-4">
						{deleteErrorMessage ? <p className="text-sm text-red-600">{deleteErrorMessage}</p> : null}
						{isMaterialsError || materialsQuery.isError ? (
							<p className="text-sm text-amber-600">
								참고 자료 정보를 불러오지 못해 연결 자료 표시는 일부 제한될 수 있습니다.
							</p>
						) : null}
						<ExamManagementQuestionsTable
							deletingQuestionId={deletingQuestionId}
							exam={exam}
							isDeletePending={deleteQuestionMutation.isPending}
							onDeleteQuestion={(questionId) => void handleDeleteQuestion(questionId)}
							onEditQuestion={handleOpenEditPanel}
						/>
					</Card.Content>
				</Card>
			</div>
		</div>
	);
}
