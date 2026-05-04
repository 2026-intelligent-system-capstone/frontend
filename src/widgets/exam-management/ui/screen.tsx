'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { type Classroom, useClassroomDetail } from '@/entities/classroom';
import { type ClassroomMaterial, useClassroomMaterials } from '@/entities/classroom-material';
import {
	type Exam,
	type ExamQuestion,
	formatExamDateTime,
	getExamGenerationStatusColor,
	getExamGenerationStatusDescription,
	getExamGenerationStatusLabel,
	getExamMaxAttemptsLabel,
	getExamStatusLabel,
	getExamTypeLabel,
	useClassroomExam,
} from '@/entities/exam';
import { useDeleteExamQuestion } from '@/features/delete-exam-question';
import { GenerateExamQuestionsForm } from '@/features/generate-exam-questions';
import { UpsertExamQuestionForm } from '@/features/upsert-exam-question';
import { ApiClientError } from '@/shared/api/types';
import { PageHeader, PageShell, StateBlock, SurfaceCard } from '@/shared/ui';
import { SparklesIcon } from '@/shared/ui/icons/exam';
import { Button, Chip, Modal, Skeleton } from '@heroui/react';

import { ExamManagementQuestionsTable } from './questions-table';

interface ExamManagementScreenProps {
	classroomId: string;
	examId: string;
	initialClassroom: Classroom | null;
	initialExam: Exam | null;
	initialMaterials: ClassroomMaterial[];
	isClassroomError: boolean;
	isExamError: boolean;
	isMaterialsError: boolean;
}

type ActivePanel = 'create' | 'edit' | null;

const GENERATION_FORM_ID = 'exam-question-generation-modal-form';
const CREATE_FORM_ID = 'exam-question-create-modal-form';

export function ExamManagementScreen({
	classroomId,
	examId,
	initialClassroom,
	initialExam,
	initialMaterials,
	isClassroomError,
	isExamError,
	isMaterialsError,
}: ExamManagementScreenProps) {
	const router = useRouter();
	const classroomQuery = useClassroomDetail(classroomId, initialClassroom ?? undefined);
	const examQuery = useClassroomExam(classroomId, examId, initialExam ?? undefined);
	const materialsQuery = useClassroomMaterials(classroomId, initialMaterials);
	const deleteQuestionMutation = useDeleteExamQuestion(classroomId, examId);
	const [activePanel, setActivePanel] = useState<ActivePanel>(null);
	const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
	const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
	const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
	const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

	const classroom = classroomQuery.data;
	const exam = examQuery.data;
	const materials = materialsQuery.data ?? [];
	const isExamGenerationInProgress = exam?.generation_status === 'queued' || exam?.generation_status === 'running';
	const editingQuestion = exam?.questions.find((question) => question.id === editingQuestionId);
	const editingQuestionFormKey = editingQuestion
		? [
				editingQuestion.id,
				editingQuestion.question_number,
				editingQuestion.max_score,
				editingQuestion.question_type,
				editingQuestion.question_text,
				editingQuestion.intent_text,
				editingQuestion.rubric_text,
				JSON.stringify(editingQuestion.answer_options),
				editingQuestion.correct_answer_text ?? '',
				editingQuestion.bloom_level,
				editingQuestion.difficulty,
				JSON.stringify(editingQuestion.source_material_ids),
			].join(':')
		: 'create';

	const handleOpenCreatePanel = () => {
		setDeleteErrorMessage(null);
		setEditingQuestionId(null);
		setIsGenerateModalOpen(false);
		setActivePanel('create');
	};

	const handleOpenEditPanel = (question: ExamQuestion) => {
		setDeleteErrorMessage(null);
		setEditingQuestionId(question.id);
		setIsGenerateModalOpen(false);
		setActivePanel('edit');
	};

	const handleClosePanel = () => {
		setDeleteErrorMessage(null);
		setEditingQuestionId(null);
		setIsGenerateModalOpen(false);
		setActivePanel(null);
	};

	const handleToggleGeneratePanel = () => {
		setDeleteErrorMessage(null);
		setEditingQuestionId(null);
		setActivePanel(null);
		setIsGenerateModalOpen((prev) => !prev);
	};

	const handleToggleCreatePanel = () => {
		if (activePanel === 'create') {
			handleClosePanel();
			return;
		}

		handleOpenCreatePanel();
	};

	const handleGenerateModalOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			handleClosePanel();
			return;
		}

		setIsGenerateModalOpen(true);
	};

	const handleCreateModalOpenChange = (nextOpen: boolean) => {
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
			<PageShell>
				<SurfaceCard className="space-y-6">
					<Skeleton className="h-8 w-64 rounded-lg" />
					<div className="grid gap-4 md:grid-cols-3">
						{Array.from({ length: 3 }).map((_, index) => (
							<Skeleton key={index} className="h-28 rounded-2xl" />
						))}
					</div>
				</SurfaceCard>
			</PageShell>
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
			<PageShell>
				<StateBlock
					action={
						<Button
							className="rounded-full"
							type="button"
							variant="secondary"
							onPress={() => router.push(`/professor/classrooms/${classroomId}`)}
						>
							강의실로 돌아가기
						</Button>
					}
					description="시험이 삭제되었거나 접근 권한이 변경되었을 수 있습니다."
					title="시험 관리 정보를 불러오지 못했습니다."
					tone="error"
				/>
			</PageShell>
		);
	}

	return (
		<PageShell>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<Button
					className="rounded-full"
					type="button"
					variant="ghost"
					onPress={() => router.push(`/professor/classrooms/${classroomId}`)}
				>
					강의실로 돌아가기
				</Button>
				<p className="text-neutral-gray-500 text-sm">{classroom.name}</p>
			</div>

			<PageHeader
				description={`${getExamTypeLabel(exam.exam_type)} · ${getExamStatusLabel(exam.status)} · 문항 ${exam.questions.length}개`}
				eyebrow="Exam Operations Document"
				title={exam.title}
			/>

			<SurfaceCard className="space-y-6">
				<div>
					<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.08em] uppercase">
						Operations Summary
					</p>
					<h2 className="text-neutral-text mt-2 text-2xl font-semibold tracking-[-0.01em]">시험 운영 문서</h2>
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					<section className="border-border-subtle bg-surface-muted rounded-2xl border p-5">
						<p className="text-neutral-text text-sm font-semibold">시험 일정</p>
						<dl className="text-neutral-gray-500 mt-3 space-y-2 text-sm">
							<div>
								<dt className="text-neutral-text font-medium">시작</dt>
								<dd>{formatExamDateTime(exam.starts_at)}</dd>
							</div>
							<div>
								<dt className="text-neutral-text font-medium">종료</dt>
								<dd>{formatExamDateTime(exam.ends_at)}</dd>
							</div>
						</dl>
					</section>
					<section className="border-border-subtle bg-surface-muted rounded-2xl border p-5">
						<p className="text-neutral-text text-sm font-semibold">운영 정보</p>
						<dl className="text-neutral-gray-500 mt-3 space-y-2 text-sm">
							<div className="flex justify-between gap-3">
								<dt>진행 시간</dt>
								<dd className="text-neutral-text font-medium">{exam.duration_minutes}분</dd>
							</div>
							<div>
								<dt className="sr-only">응시 제한</dt>
								<dd>{getExamMaxAttemptsLabel(exam.max_attempts)}</dd>
							</div>
							<div>
								<dt className="text-neutral-text font-medium">설명</dt>
								<dd>{exam.description ?? '설명 없음'}</dd>
							</div>
						</dl>
					</section>
					<section className="border-border-subtle bg-surface-muted rounded-2xl border p-5">
						<p className="text-neutral-text text-sm font-semibold">문항 현황</p>
						<dl className="text-neutral-gray-500 mt-3 space-y-2 text-sm">
							<div className="flex justify-between gap-3">
								<dt>총 문항</dt>
								<dd className="text-neutral-text font-medium">{exam.questions.length}개</dd>
							</div>
							<div className="flex justify-between gap-3">
								<dt>주차</dt>
								<dd className="text-neutral-text font-medium">{exam.week}주차</dd>
							</div>
						</dl>
						<div className="text-neutral-gray-500 mt-4 flex flex-wrap items-center gap-2 text-sm">
							<span>생성 상태</span>
							<Chip color={getExamGenerationStatusColor(exam.generation_status)} size="sm" variant="soft">
								<Chip.Label>{getExamGenerationStatusLabel(exam.generation_status)}</Chip.Label>
							</Chip>
						</div>
						{exam.generation_requested_at ? (
							<p className="text-neutral-gray-500 mt-2 text-sm">
								요청 {formatExamDateTime(exam.generation_requested_at)}
							</p>
						) : null}
						{exam.generation_completed_at ? (
							<p className="text-neutral-gray-500 mt-1 text-sm">
								완료 {formatExamDateTime(exam.generation_completed_at)}
							</p>
						) : null}
					</section>
				</div>
			</SurfaceCard>

			<SurfaceCard className="space-y-5">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<h2 className="text-neutral-text text-lg font-semibold">문항 관리</h2>
						<p className="text-neutral-gray-500 mt-1 text-sm">
							AI 생성은 자료 기반 초안 작성, 수동 추가는 개별 문항 보강에 사용합니다.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button
							className="rounded-full"
							isDisabled={isExamGenerationInProgress}
							variant={isGenerateModalOpen ? 'primary' : 'secondary'}
							onPress={handleToggleGeneratePanel}
						>
							<SparklesIcon className="size-4" />
							AI 문항 생성
						</Button>
						<Button
							className="rounded-full"
							variant={activePanel === 'create' ? 'primary' : 'secondary'}
							onPress={handleToggleCreatePanel}
						>
							문항 추가
						</Button>
					</div>
				</div>
				<div className="border-border-subtle bg-surface-muted rounded-2xl border p-4">
					<div className="text-neutral-gray-500 flex flex-wrap items-center gap-2 text-sm">
						<span>현재 생성 상태</span>
						<Chip color={getExamGenerationStatusColor(exam.generation_status)} size="sm" variant="soft">
							<Chip.Label>{getExamGenerationStatusLabel(exam.generation_status)}</Chip.Label>
						</Chip>
						{examQuery.isFetching && isExamGenerationInProgress ? (
							<span className="text-neutral-gray-500 text-xs">최신 상태 확인 중</span>
						) : null}
					</div>
					<p className="text-neutral-gray-500 mt-2 text-sm leading-6">
						{getExamGenerationStatusDescription(exam.generation_status)}
					</p>
					{exam.generation_error ? (
						<p className="text-danger-text mt-2 text-sm">오류 {exam.generation_error}</p>
					) : null}
				</div>
			</SurfaceCard>

			<Modal>
				<Modal.Backdrop isOpen={isGenerateModalOpen} onOpenChange={handleGenerateModalOpenChange}>
					<Modal.Container scroll="inside">
						<Modal.Dialog className="flex max-h-[calc(100vh-5rem)] flex-col overflow-clip sm:max-w-4xl">
							{({ close }) => (
								<>
									<Modal.CloseTrigger />
									<Modal.Header>
										<Modal.Heading>AI 문항 생성</Modal.Heading>
										<p className="text-neutral-gray-500 mt-1 text-sm">
											적재 완료된 강의 자료와 추출 범위를 기반으로 문항을 생성합니다.
										</p>
									</Modal.Header>
									<Modal.Body className="min-h-0 flex-1 overflow-y-auto p-6">
										<GenerateExamQuestionsForm
											classroomId={classroomId}
											examId={examId}
											examType={exam.exam_type}
											formId={GENERATION_FORM_ID}
											hideActions
											hideHeader
											materials={materials}
											onCancel={close}
											onSuccess={close}
										/>
									</Modal.Body>
									<Modal.Footer className="border-border-subtle justify-end gap-3 border-t px-6 py-4">
										<Button type="button" variant="secondary" onPress={close}>
											닫기
										</Button>
										<Button form={GENERATION_FORM_ID} type="submit" variant="primary">
											생성
										</Button>
									</Modal.Footer>
								</>
							)}
						</Modal.Dialog>
					</Modal.Container>
				</Modal.Backdrop>
			</Modal>

			<Modal>
				<Modal.Backdrop isOpen={activePanel === 'create'} onOpenChange={handleCreateModalOpenChange}>
					<Modal.Container scroll="inside">
						<Modal.Dialog className="sm:max-w-3xl">
							{({ close }) => (
								<>
									<Modal.CloseTrigger />
									<Modal.Header>
										<Modal.Heading>문항 추가</Modal.Heading>
										<p className="text-neutral-gray-500 mt-1 text-sm">
											문항 내용과 연결 자료를 현재 시험 문맥에서 바로 추가합니다.
										</p>
									</Modal.Header>
									<Modal.Body className="p-6">
										<UpsertExamQuestionForm
											key="create"
											classroomId={classroomId}
											examId={examId}
											formId={CREATE_FORM_ID}
											hideActions
											hideHeader
											materials={materials}
											title="문항 추가"
											onCancel={close}
											onSuccess={close}
										/>
									</Modal.Body>
									<Modal.Footer className="border-border-subtle justify-end gap-3 border-t px-6 py-4">
										<Button type="button" variant="secondary" onPress={close}>
											닫기
										</Button>
										<Button form={CREATE_FORM_ID} type="submit" variant="primary">
											저장
										</Button>
									</Modal.Footer>
								</>
							)}
						</Modal.Dialog>
					</Modal.Container>
				</Modal.Backdrop>
			</Modal>

			{activePanel === 'edit' && editingQuestion ? (
				<SurfaceCard>
					<UpsertExamQuestionForm
						key={editingQuestionFormKey}
						classroomId={classroomId}
						examId={examId}
						materials={materials}
						question={editingQuestion}
						title={`${editingQuestion.question_number}번 문항 수정`}
						onCancel={handleClosePanel}
						onSuccess={handleClosePanel}
					/>
				</SurfaceCard>
			) : null}

			{activePanel === 'edit' && !editingQuestion ? (
				<StateBlock
					action={
						<Button className="rounded-full" type="button" variant="secondary" onPress={handleClosePanel}>
							닫기
						</Button>
					}
					description="목록을 새로 확인한 뒤 다시 시도해주세요."
					title="수정할 문항 정보를 찾을 수 없습니다."
					tone="disabled"
				/>
			) : null}

			<SurfaceCard className="space-y-5">
				<div>
					<h2 className="text-neutral-text text-lg font-semibold">문항 목록</h2>
					<p className="text-neutral-gray-500 mt-1 text-sm">총 {exam.questions.length}개</p>
				</div>
				{deleteErrorMessage ? <p className="text-danger-text text-sm">{deleteErrorMessage}</p> : null}
				{isMaterialsError || materialsQuery.isError ? (
					<p
						className="border-warning-text/20 bg-warning-soft text-warning-text rounded-2xl border px-4 py-3
							text-sm"
					>
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
			</SurfaceCard>
		</PageShell>
	);
}
