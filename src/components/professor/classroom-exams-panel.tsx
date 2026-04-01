'use client';

import type { ReactNode, SVGProps } from 'react';

import {
	Button,
	ButtonGroup,
	Card,
	Checkbox,
	Chip,
	ErrorMessage,
	Input,
	Label,
	ListBox,
	Modal,
	Select,
	Skeleton,
	Table,
	TextArea,
	TextField,
	Tooltip,
} from '@heroui/react';
import { useId, useMemo, useState } from 'react';

import { dayjs, SEOUL_TIME_ZONE } from '@/lib/dayjs';
import {
	useCreateExamQuestion,
	useDeleteExamQuestion,
	useGenerateExamQuestions,
	useUpdateExamQuestion,
} from '@/lib/hooks/use-classrooms';
import { ApiClientError } from '@/types/api';
import type { ClassroomMaterial, ClassroomMaterialIngestStatus } from '@/types/classroom';
import type {
	BloomLevel,
	CreateExamQuestionRequest,
	Exam,
	ExamDifficulty,
	ExamQuestion,
	ExamQuestionStatus,
	GenerateExamQuestionsRequest,
	UpdateExamQuestionRequest,
} from '@/types/exam';

import { ExamCreateModal } from '@/components/professor/exam-create-modal';

interface ClassroomExamsPanelProps {
	classroomId: string;
	exams: Exam[];
	materials: ClassroomMaterial[];
	isError: boolean;
	isLoading: boolean;
	canManageExams: boolean;
}

const bloomLevelOptions: Array<{ label: string; value: BloomLevel }> = [
	{ label: '기억', value: 'remember' },
	{ label: '이해', value: 'understand' },
	{ label: '적용', value: 'apply' },
	{ label: '분석', value: 'analyze' },
	{ label: '평가', value: 'evaluate' },
	{ label: '창조', value: 'create' },
];

const difficultyOptions: Array<{ label: string; value: ExamDifficulty }> = [
	{ label: '쉬움', value: 'easy' },
	{ label: '보통', value: 'medium' },
	{ label: '어려움', value: 'hard' },
];

const emptyQuestionForm = {
	answerKey: '',
	bloomLevel: 'understand' as BloomLevel,
	difficulty: 'medium' as ExamDifficulty,
	evaluationObjective: '',
	questionNumber: '1',
	questionText: '',
	scopeText: '',
	scoringCriteria: '',
	sourceMaterialIds: [] as string[],
};

const emptyGenerationForm = {
	difficulty: 'medium' as ExamDifficulty,
	maxFollowUps: '2',
	scopeText: '',
	selectedMaterialIds: [] as string[],
	totalQuestions: '3',
};

const defaultBloomRatios: Record<BloomLevel, string> = {
	analyze: '30',
	apply: '40',
	create: '0',
	evaluate: '0',
	remember: '0',
	understand: '30',
};

const formatDateTime = (value: string) => {
	return dayjs.utc(value).tz(SEOUL_TIME_ZONE).format('YYYY.MM.DD HH:mm');
};

const getExamTypeLabel = (type: Exam['exam_type']) => {
	switch (type) {
		case 'quiz':
			return '퀴즈';
		case 'midterm':
			return '중간';
		case 'final':
			return '기말';
		case 'mock':
			return '모의';
	}
};

const getExamTypeColor = (type: Exam['exam_type']) => {
	switch (type) {
		case 'quiz':
			return 'accent';
		case 'midterm':
			return 'warning';
		case 'final':
			return 'danger';
		case 'mock':
			return 'success';
	}
};

const getExamStatusLabel = (status: Exam['status']) => {
	switch (status) {
		case 'ready':
			return '준비';
		case 'in_progress':
			return '진행 중';
		case 'closed':
			return '종료';
	}
};

const getExamStatusColor = (status: Exam['status']) => {
	switch (status) {
		case 'ready':
			return 'accent';
		case 'in_progress':
			return 'success';
		case 'closed':
			return 'default';
	}
};

const getBloomLevelLabel = (level: BloomLevel) => {
	switch (level) {
		case 'remember':
			return '기억';
		case 'understand':
			return '이해';
		case 'apply':
			return '적용';
		case 'analyze':
			return '분석';
		case 'evaluate':
			return '평가';
		case 'create':
			return '창조';
	}
};

const getBloomLevelColor = (level: BloomLevel) => {
	switch (level) {
		case 'remember':
			return 'default';
		case 'understand':
			return 'accent';
		case 'apply':
			return 'success';
		case 'analyze':
			return 'warning';
		case 'evaluate':
			return 'danger';
		case 'create':
			return 'accent';
	}
};

const getDifficultyLabel = (difficulty: ExamDifficulty) => {
	switch (difficulty) {
		case 'easy':
			return '쉬움';
		case 'medium':
			return '보통';
		case 'hard':
			return '어려움';
	}
};

const getDifficultyColor = (difficulty: ExamDifficulty) => {
	switch (difficulty) {
		case 'easy':
			return 'success';
		case 'medium':
			return 'warning';
		case 'hard':
			return 'danger';
	}
};

const getQuestionStatusLabel = (status: ExamQuestionStatus) => {
	switch (status) {
		case 'generated':
			return '생성됨';
		case 'reviewed':
			return '검토됨';
		case 'deleted':
			return '삭제됨';
	}
};

const getQuestionStatusColor = (status: ExamQuestionStatus) => {
	switch (status) {
		case 'generated':
			return 'accent';
		case 'reviewed':
			return 'success';
		case 'deleted':
			return 'default';
	}
};

const getIngestStatusLabel = (status: ClassroomMaterialIngestStatus) => {
	switch (status) {
		case 'pending':
			return '적재 대기';
		case 'completed':
			return '적재 완료';
		case 'failed':
			return '적재 실패';
	}
};

const getIngestStatusColor = (status: ClassroomMaterialIngestStatus) => {
	switch (status) {
		case 'pending':
			return 'warning';
		case 'completed':
			return 'success';
		case 'failed':
			return 'danger';
	}
};

const toggleStringValue = (values: string[], target: string) => {
	return values.includes(target) ? values.filter((value) => value !== target) : [...values, target];
};

const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path d="M12 5.75v12.5M5.75 12h12.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
	</svg>
);

const SparklesIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path d="M12 3.75l1.64 4.61L18.25 10l-4.61 1.64L12 16.25l-1.64-4.61L5.75 10l4.61-1.64L12 3.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
		<path d="M18.5 4.75v2.5M19.75 6h-2.5M5.5 16.75v3M7 18.25H4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);

const PencilIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path d="M4.75 19.25 8 18.5l8.97-8.97a1.77 1.77 0 0 0 0-2.5l-.99-.99a1.77 1.77 0 0 0-2.5 0L4.5 15.03l-.75 3.22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
		<path d="m12.75 6.75 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
	</svg>
);

const TrashIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path d="M5.75 7.25h12.5M9.25 7.25V5.5h5.5v1.75M8.5 10.25v6M12 10.25v6M15.5 10.25v6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
		<path d="M7.25 7.25h9.5v10a2 2 0 0 1-2 2h-5.5a2 2 0 0 1-2-2v-10Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
	</svg>
);

const DocumentIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path d="M7 3.75h7.5L19.25 8.5V19A2.25 2.25 0 0 1 17 21.25H7A2.25 2.25 0 0 1 4.75 19V6A2.25 2.25 0 0 1 7 3.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
		<path d="M14.5 3.75V8.5h4.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
		<path d="M8.5 13h7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path d="M8.5 16.5h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);

const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
		<path d="M12 7.75v4.5l3 1.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
	</svg>
);

const CalendarIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<rect x="4.75" y="5.75" width="14.5" height="13.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
		<path d="M8 3.75v4M16 3.75v4M4.75 9.25h14.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);

interface ExamQuestionEditorModalProps {
	buttonAriaLabel: string;
	buttonChildren: ReactNode;
	buttonIsIconOnly?: boolean;
	buttonVariant?: 'primary' | 'secondary';
	classroomId: string;
	examId: string;
	materials: ClassroomMaterial[];
	question?: ExamQuestion;
	title: string;
}

function ExamQuestionEditorModal({
	buttonAriaLabel,
	buttonChildren,
	buttonIsIconOnly = false,
	buttonVariant = 'primary',
	classroomId,
	examId,
	materials,
	question,
	title,
}: ExamQuestionEditorModalProps) {
	const questionNumberId = useId();
	const questionTextId = useId();
	const scopeTextId = useId();
	const evaluationObjectiveId = useId();
	const answerKeyId = useId();
	const scoringCriteriaId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const initialForm = useMemo(() => {
		if (!question) {
			return emptyQuestionForm;
		}

		return {
			answerKey: question.answer_key,
			bloomLevel: question.bloom_level,
			difficulty: question.difficulty,
			evaluationObjective: question.evaluation_objective,
			questionNumber: String(question.question_number),
			questionText: question.question_text,
			scopeText: question.scope_text,
			scoringCriteria: question.scoring_criteria,
			sourceMaterialIds: question.source_material_ids,
		};
	}, [question]);
	const [form, setForm] = useState(initialForm);
	const createQuestionMutation = useCreateExamQuestion(classroomId, examId);
	const updateQuestionMutation = useUpdateExamQuestion(classroomId, examId);

	const isPending = createQuestionMutation.isPending || updateQuestionMutation.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		setIsOpen(nextOpen);
		if (!nextOpen) {
			setErrorMessage(null);
			setForm(initialForm);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, close: () => void) => {
		event.preventDefault();
		setErrorMessage(null);

		const payload = {
			question_number: Number(form.questionNumber),
			bloom_level: form.bloomLevel,
			difficulty: form.difficulty,
			question_text: form.questionText.trim(),
			scope_text: form.scopeText.trim(),
			evaluation_objective: form.evaluationObjective.trim(),
			answer_key: form.answerKey.trim(),
			scoring_criteria: form.scoringCriteria.trim(),
			source_material_ids: form.sourceMaterialIds,
		};

		try {
			if (question) {
				await updateQuestionMutation.mutateAsync({
					payload: payload satisfies UpdateExamQuestionRequest,
					questionId: question.id,
				});
			} else {
				await createQuestionMutation.mutateAsync(payload satisfies CreateExamQuestionRequest);
			}

			close();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('문항 저장 중 오류가 발생했습니다.');
		}
	};

	return (
		<Modal>
			<Button aria-label={buttonAriaLabel} isIconOnly={buttonIsIconOnly} variant={buttonVariant} onPress={() => setIsOpen(true)}>
				{buttonChildren}
			</Button>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-3xl">
						{({ close }) => (
							<>
								<Modal.CloseTrigger />
								<Modal.Header>
									<Modal.Heading>{title}</Modal.Heading>
								</Modal.Header>
								<Modal.Body className="p-6">
									<form className="space-y-4" onSubmit={(event) => handleSubmit(event, close)}>
										<div className="grid gap-4 md:grid-cols-3">
											<TextField isRequired className="w-full" name="question_number">
												<Label htmlFor={questionNumberId}>문항 번호</Label>
												<Input
													id={questionNumberId}
													min={1}
													type="number"
													value={form.questionNumber}
													onChange={(event) => setForm((prev) => ({ ...prev, questionNumber: event.target.value }))}
												/>
											</TextField>
											<Select className="w-full" value={form.bloomLevel} onChange={(value) => setForm((prev) => ({ ...prev, bloomLevel: value as BloomLevel }))}>
												<Label>Bloom 단계</Label>
												<Select.Trigger>
													<Select.Value />
													<Select.Indicator />
												</Select.Trigger>
												<Select.Popover>
													<ListBox>
														{bloomLevelOptions.map((option) => (
															<ListBox.Item key={option.value} id={option.value} textValue={option.label}>
																{option.label}
																<ListBox.ItemIndicator />
															</ListBox.Item>
														))}
													</ListBox>
												</Select.Popover>
											</Select>
											<Select className="w-full" value={form.difficulty} onChange={(value) => setForm((prev) => ({ ...prev, difficulty: value as ExamDifficulty }))}>
												<Label>난이도</Label>
												<Select.Trigger>
													<Select.Value />
													<Select.Indicator />
												</Select.Trigger>
												<Select.Popover>
													<ListBox>
														{difficultyOptions.map((option) => (
															<ListBox.Item key={option.value} id={option.value} textValue={option.label}>
																{option.label}
																<ListBox.ItemIndicator />
															</ListBox.Item>
														))}
													</ListBox>
												</Select.Popover>
											</Select>
										</div>

										<TextField isRequired className="w-full" name="question_text">
											<Label htmlFor={questionTextId}>문항</Label>
											<TextArea id={questionTextId} className="min-h-28" value={form.questionText} onChange={(event) => setForm((prev) => ({ ...prev, questionText: event.target.value }))} />
										</TextField>

										<TextField isRequired className="w-full" name="scope_text">
											<Label htmlFor={scopeTextId}>시험 범위</Label>
											<TextArea id={scopeTextId} className="min-h-24" value={form.scopeText} onChange={(event) => setForm((prev) => ({ ...prev, scopeText: event.target.value }))} />
										</TextField>

										<TextField isRequired className="w-full" name="evaluation_objective">
											<Label htmlFor={evaluationObjectiveId}>평가 목표</Label>
											<TextArea id={evaluationObjectiveId} className="min-h-24" value={form.evaluationObjective} onChange={(event) => setForm((prev) => ({ ...prev, evaluationObjective: event.target.value }))} />
										</TextField>

										<div className="grid gap-4 md:grid-cols-2">
											<TextField isRequired className="w-full" name="answer_key">
												<Label htmlFor={answerKeyId}>정답 기준</Label>
												<TextArea id={answerKeyId} className="min-h-28" value={form.answerKey} onChange={(event) => setForm((prev) => ({ ...prev, answerKey: event.target.value }))} />
											</TextField>
											<TextField isRequired className="w-full" name="scoring_criteria">
												<Label htmlFor={scoringCriteriaId}>채점 기준</Label>
												<TextArea id={scoringCriteriaId} className="min-h-28" value={form.scoringCriteria} onChange={(event) => setForm((prev) => ({ ...prev, scoringCriteria: event.target.value }))} />
											</TextField>
										</div>

										<div className="space-y-3 rounded-large border border-slate-200 bg-slate-50 p-4">
											<div>
												<p className="text-sm font-medium text-slate-800">연결 자료</p>
												<p className="mt-1 text-xs text-slate-500">문항 생성에 참고한 자료를 선택하세요.</p>
											</div>
											<div className="grid gap-3">
												{materials.map((material) => (
													<Checkbox
														key={material.id}
														className="w-full items-start justify-between gap-3 rounded-medium border border-slate-200 bg-white px-3 py-2"
														isSelected={form.sourceMaterialIds.includes(material.id)}
														onChange={() =>
															setForm((prev) => ({
																...prev,
																sourceMaterialIds: toggleStringValue(prev.sourceMaterialIds, material.id),
															}))
														}
													>
														<Checkbox.Control className="mt-0.5 shrink-0">
															<Checkbox.Indicator />
														</Checkbox.Control>
														<Checkbox.Content className="min-w-0 flex-1">
															<Label className="truncate text-sm font-medium text-slate-800">{material.title}</Label>
															<p className="truncate text-xs text-slate-500">{material.file.file_name}</p>
														</Checkbox.Content>
													</Checkbox>
												))}
											</div>
										</div>

										{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

										<div className="flex justify-end gap-3">
											<Button type="button" variant="secondary" onPress={close}>
												취소
											</Button>
											<Button isPending={isPending} type="submit" variant="primary">
												저장
											</Button>
										</div>
									</form>
								</Modal.Body>
							</>
						)}
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

interface ExamQuestionGenerationModalProps {
	classroomId: string;
	examId: string;
	materials: ClassroomMaterial[];
}

function ExamQuestionGenerationModal({ classroomId, examId, materials }: ExamQuestionGenerationModalProps) {
	const totalQuestionsId = useId();
	const maxFollowUpsId = useId();
	const scopeTextId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [difficulty, setDifficulty] = useState<ExamDifficulty>(emptyGenerationForm.difficulty);
	const [scopeText, setScopeText] = useState(emptyGenerationForm.scopeText);
	const [totalQuestions, setTotalQuestions] = useState(emptyGenerationForm.totalQuestions);
	const [maxFollowUps, setMaxFollowUps] = useState(emptyGenerationForm.maxFollowUps);
	const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>(emptyGenerationForm.selectedMaterialIds);
	const [bloomRatios, setBloomRatios] = useState<Record<BloomLevel, string>>(defaultBloomRatios);
	const generateMutation = useGenerateExamQuestions(classroomId, examId);

	const completedMaterials = useMemo(() => {
		return materials.filter((material) => material.ingest_status === 'completed');
	}, [materials]);

	const handleScopeCandidateClick = (candidateText: string) => {
		setScopeText((prev) => (prev.trim() ? `${prev.trim()}\n- ${candidateText}` : candidateText));
	};

	const handleOpenChange = (nextOpen: boolean) => {
		setIsOpen(nextOpen);
		if (!nextOpen) {
			setErrorMessage(null);
			setDifficulty(emptyGenerationForm.difficulty);
			setScopeText(emptyGenerationForm.scopeText);
			setTotalQuestions(emptyGenerationForm.totalQuestions);
			setMaxFollowUps(emptyGenerationForm.maxFollowUps);
			setSelectedMaterialIds(emptyGenerationForm.selectedMaterialIds);
			setBloomRatios(defaultBloomRatios);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, close: () => void) => {
		event.preventDefault();
		setErrorMessage(null);

		const parsedRatios = bloomLevelOptions
			.map((option) => ({
				bloom_level: option.value,
				percentage: Number(bloomRatios[option.value]),
			}))
			.filter((item) => item.percentage > 0);
		const totalRatio = parsedRatios.reduce((sum, item) => sum + item.percentage, 0);

		if (!scopeText.trim()) {
			setErrorMessage('시험 범위를 입력해주세요.');
			return;
		}

		if (parsedRatios.length === 0) {
			setErrorMessage('Bloom 비율을 하나 이상 입력해주세요.');
			return;
		}

		if (totalRatio !== 100) {
			setErrorMessage('Bloom 비율 합계는 100이어야 합니다.');
			return;
		}

		try {
			await generateMutation.mutateAsync({
				bloom_ratios: parsedRatios,
				difficulty,
				max_follow_ups: Number(maxFollowUps),
				scope_text: scopeText.trim(),
				source_material_ids: selectedMaterialIds,
				total_questions: Number(totalQuestions),
			} satisfies GenerateExamQuestionsRequest);
			close();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('AI 문항 생성 중 오류가 발생했습니다.');
		}
	};

	return (
		<Modal>
			<Button variant="secondary" onPress={() => setIsOpen(true)}>
				<SparklesIcon className="size-4" />
				AI 문항 생성
			</Button>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-4xl">
						{({ close }) => (
							<>
								<Modal.CloseTrigger />
								<Modal.Header>
									<Modal.Heading>AI 문항 생성</Modal.Heading>
									<p className="mt-1 text-sm text-slate-500">적재 완료된 강의 자료와 추출 범위를 기반으로 문항을 생성합니다.</p>
								</Modal.Header>
								<Modal.Body className="p-6">
									<form className="space-y-5" onSubmit={(event) => handleSubmit(event, close)}>
										<div className="grid gap-4 md:grid-cols-3">
											<Select className="w-full" value={difficulty} onChange={(value) => setDifficulty(value as ExamDifficulty)}>
												<Label>난이도</Label>
												<Select.Trigger>
													<Select.Value />
													<Select.Indicator />
												</Select.Trigger>
												<Select.Popover>
													<ListBox>
														{difficultyOptions.map((option) => (
															<ListBox.Item key={option.value} id={option.value} textValue={option.label}>
																{option.label}
																<ListBox.ItemIndicator />
															</ListBox.Item>
														))}
													</ListBox>
												</Select.Popover>
											</Select>
											<TextField isRequired className="w-full" name="total_questions">
												<Label htmlFor={totalQuestionsId}>문항 수</Label>
												<Input id={totalQuestionsId} min={1} max={100} type="number" value={totalQuestions} onChange={(event) => setTotalQuestions(event.target.value)} />
											</TextField>
											<TextField isRequired className="w-full" name="max_follow_ups">
												<Label htmlFor={maxFollowUpsId}>최대 꼬리질문 수</Label>
												<Input id={maxFollowUpsId} min={0} max={20} type="number" value={maxFollowUps} onChange={(event) => setMaxFollowUps(event.target.value)} />
											</TextField>
										</div>

										<TextField isRequired className="w-full" name="scope_text">
											<Label htmlFor={scopeTextId}>시험 범위</Label>
											<TextArea id={scopeTextId} className="min-h-28" placeholder="예: 1~3주차 지도학습 개념과 회귀·분류 비교" value={scopeText} onChange={(event) => setScopeText(event.target.value)} />
										</TextField>

										<div className="space-y-3 rounded-large border border-slate-200 bg-slate-50 p-4">
											<div>
												<p className="text-sm font-medium text-slate-800">Bloom 비율</p>
												<p className="mt-1 text-xs text-slate-500">0을 입력한 단계는 생성 요청에서 제외됩니다. 합계는 100이어야 합니다.</p>
											</div>
											<div className="grid gap-3 md:grid-cols-3">
												{bloomLevelOptions.map((option) => (
													<TextField key={option.value} className="w-full">
														<Label>{option.label}</Label>
														<Input min={0} max={100} type="number" value={bloomRatios[option.value]} onChange={(event) => setBloomRatios((prev) => ({ ...prev, [option.value]: event.target.value }))} />
													</TextField>
												))}
											</div>
										</div>

										<div className="space-y-3 rounded-large border border-slate-200 bg-slate-50 p-4">
											<div>
												<p className="text-sm font-medium text-slate-800">참고 자료 선택</p>
												<p className="mt-1 text-xs text-slate-500">적재 완료된 자료를 선택하면 RAG 검색 품질이 좋아집니다.</p>
											</div>
											<div className="grid gap-3">
												{materials.map((material) => (
													<div key={material.id} className="rounded-medium border border-slate-200 bg-white p-3">
														<Checkbox
															className="w-full items-start justify-between gap-3"
															isDisabled={material.ingest_status !== 'completed'}
															isSelected={selectedMaterialIds.includes(material.id)}
															onChange={() => setSelectedMaterialIds((prev) => toggleStringValue(prev, material.id))}
														>
															<Checkbox.Control className="mt-0.5 shrink-0">
																<Checkbox.Indicator />
															</Checkbox.Control>
															<Checkbox.Content className="min-w-0 flex-1">
																<div className="flex min-w-0 flex-wrap items-center gap-2">
																	<Label className="truncate text-sm font-medium text-slate-900">{material.title}</Label>
																	<Chip color={getIngestStatusColor(material.ingest_status)} size="sm" variant="soft">
																		<Chip.Label>{getIngestStatusLabel(material.ingest_status)}</Chip.Label>
																	</Chip>
																</div>
																<p className="mt-1 truncate text-xs text-slate-500">{material.file.file_name}</p>
																{material.ingest_error ? <p className="mt-1 text-xs text-red-600">{material.ingest_error}</p> : null}
															</Checkbox.Content>
														</Checkbox>
														{material.scope_candidates.length > 0 ? (
															<div className="mt-3 flex flex-wrap gap-2">
																{material.scope_candidates.map((candidate) => (
																	<Button key={`${material.id}-${candidate.label}`} size="sm" variant="secondary" onPress={() => handleScopeCandidateClick(candidate.scope_text)}>
																		{candidate.label}
																	</Button>
																))}
															</div>
														) : null}
													</div>
												))}
											</div>
											{completedMaterials.length === 0 ? <p className="text-xs text-amber-600">아직 적재 완료된 강의 자료가 없습니다. 자료 적재가 완료된 뒤 다시 시도하세요.</p> : null}
										</div>

										{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

										<div className="flex justify-end gap-3">
											<Button type="button" variant="secondary" onPress={close}>
												취소
											</Button>
											<Button isPending={generateMutation.isPending} type="submit" variant="primary">
												생성
											</Button>
										</div>
									</form>
								</Modal.Body>
							</>
						)}
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

interface ExamQuestionCardProps {
	canManageExams: boolean;
	classroomId: string;
	exam: Exam;
	materials: ClassroomMaterial[];
}

function ExamQuestionCard({ canManageExams, classroomId, exam, materials }: ExamQuestionCardProps) {
	const deleteQuestionMutation = useDeleteExamQuestion(classroomId, exam.id);
	const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

	const handleDeleteQuestion = async (questionId: string) => {
		setDeletingQuestionId(questionId);
		try {
			await deleteQuestionMutation.mutateAsync(questionId);
		} finally {
			setDeletingQuestionId(null);
		}
	};

	return (
		<Card className="border border-slate-200">
			<Card.Header className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<Card.Title className="text-lg font-semibold text-slate-900">{exam.title}</Card.Title>
					<Card.Description className="mt-2 text-sm text-slate-500">
						문항 {exam.questions.length}개 · {formatDateTime(exam.starts_at)} 시작
					</Card.Description>
				</div>
				{canManageExams ? (
					<div className="flex flex-wrap gap-2">
						<ExamQuestionGenerationModal classroomId={classroomId} examId={exam.id} materials={materials} />
						<ExamQuestionEditorModal
							buttonAriaLabel={`${exam.title} 문항 추가`}
							buttonChildren={(
								<>
									<PlusIcon className="size-4" />
									문항 추가
								</>
							)}
							classroomId={classroomId}
							examId={exam.id}
							materials={materials}
							title="문항 추가"
						/>
					</div>
				) : null}
			</Card.Header>
			<Card.Content>
				{exam.questions.length === 0 ? (
					<p className="text-sm text-slate-500">아직 생성된 문항이 없습니다.</p>
				) : (
					<Table>
						<Table.ScrollContainer>
							<Table.Content aria-label={`${exam.title} 문항 목록`} className="min-w-[1180px] table-fixed">
								<Table.Header>
									<Table.Column isRowHeader className="w-[72px]">번호</Table.Column>
									<Table.Column className="w-[110px]">Bloom</Table.Column>
									<Table.Column className="w-[100px]">난이도</Table.Column>
									<Table.Column className="w-[340px]">문항</Table.Column>
									<Table.Column className="w-[220px]">범위</Table.Column>
									<Table.Column className="w-[120px]">상태</Table.Column>
									<Table.Column className="w-[130px]">작업</Table.Column>
								</Table.Header>
								<Table.Body>
									{exam.questions.map((question) => (
										<Table.Row key={question.id}>
											<Table.Cell>
												<span className="block w-[72px] truncate font-medium text-slate-700">{question.question_number}</span>
											</Table.Cell>
											<Table.Cell>
												<div className="w-[110px] overflow-hidden">
													<Chip className="max-w-full" color={getBloomLevelColor(question.bloom_level)} size="sm" variant="soft">
														<Chip.Label>{getBloomLevelLabel(question.bloom_level)}</Chip.Label>
													</Chip>
												</div>
											</Table.Cell>
											<Table.Cell>
												<div className="w-[100px] overflow-hidden">
													<Chip className="max-w-full" color={getDifficultyColor(question.difficulty)} size="sm" variant="soft">
														<Chip.Label>{getDifficultyLabel(question.difficulty)}</Chip.Label>
													</Chip>
												</div>
											</Table.Cell>
											<Table.Cell>
												<div className="w-[340px] overflow-hidden">
													<p className="truncate font-medium text-slate-900">{question.question_text}</p>
													<p className="mt-1 truncate text-sm text-slate-500">{question.evaluation_objective}</p>
												</div>
											</Table.Cell>
											<Table.Cell>
												<p className="w-[220px] truncate text-sm text-slate-700">{question.scope_text}</p>
											</Table.Cell>
											<Table.Cell>
												<div className="w-[120px] overflow-hidden">
													<Chip className="max-w-full" color={getQuestionStatusColor(question.status)} size="sm" variant="soft">
														<Chip.Label>{getQuestionStatusLabel(question.status)}</Chip.Label>
													</Chip>
												</div>
											</Table.Cell>
											<Table.Cell>
												{canManageExams ? (
													<div className="w-[130px] overflow-hidden">
														<ButtonGroup size="sm">
															<ExamQuestionEditorModal
																buttonAriaLabel={`${question.question_number}번 문항 수정`}
																buttonChildren={(
																	<Tooltip delay={0}>
																		<Tooltip.Trigger aria-label="수정" className="contents">
																			<PencilIcon className="size-4" />
																		</Tooltip.Trigger>
																		<Tooltip.Content showArrow>
																			<Tooltip.Arrow />
																			<p>수정</p>
																		</Tooltip.Content>
																	</Tooltip>
																)}
																buttonIsIconOnly
																buttonVariant="secondary"
																classroomId={classroomId}
																examId={exam.id}
																materials={materials}
																question={question}
																title="문항 수정"
															/>
															<Button
																aria-label={`${question.question_number}번 문항 삭제`}
																isIconOnly
																isPending={deleteQuestionMutation.isPending && deletingQuestionId === question.id}
																variant="danger-soft"
																onPress={() => handleDeleteQuestion(question.id)}
															>
																<ButtonGroup.Separator />
																<Tooltip delay={0}>
																	<Tooltip.Trigger aria-label="삭제" className="contents">
																		<TrashIcon className="size-4" />
																	</Tooltip.Trigger>
																	<Tooltip.Content showArrow>
																		<Tooltip.Arrow />
																		<p>삭제</p>
																	</Tooltip.Content>
																</Tooltip>
															</Button>
														</ButtonGroup>
													</div>
												) : null}
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table.Content>
						</Table.ScrollContainer>
					</Table>
				)}
			</Card.Content>
		</Card>
	);
}

export function ClassroomExamsPanel({
	classroomId,
	exams,
	materials,
	isError,
	isLoading,
	canManageExams,
}: ClassroomExamsPanelProps) {
	const showExamSkeleton = isLoading && exams.length === 0;

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="text-lg font-semibold text-slate-900">시험 목록</h2>
				{canManageExams ? <ExamCreateModal classroomId={classroomId} /> : null}
			</div>

			{showExamSkeleton ? (
				<div className="space-y-3">
					{Array.from({ length: 2 }).map((_, index) => (
						<Card key={index} className="border border-slate-200 bg-slate-50">
							<Card.Content className="space-y-2 py-4 text-sm text-slate-600">
								<Skeleton className="h-5 w-40 rounded-lg" />
								<Skeleton className="h-4 w-56 rounded-lg" />
								<Skeleton className="h-4 w-48 rounded-lg" />
								<Skeleton className="h-4 w-44 rounded-lg" />
							</Card.Content>
						</Card>
					))}
				</div>
			) : isError ? (
				<p className="text-sm text-red-600">시험 목록을 불러오지 못했습니다.</p>
			) : exams.length === 0 ? (
				<p className="text-sm text-slate-500">생성된 시험이 없습니다.</p>
			) : (
				<>
					<Table>
						<Table.ScrollContainer>
							<Table.Content aria-label="시험 목록" className="min-w-[1080px] table-fixed">
								<Table.Header>
									<Table.Column isRowHeader className="w-[260px]">시험</Table.Column>
									<Table.Column className="w-[100px]">유형</Table.Column>
									<Table.Column className="w-[150px]">진행 정보</Table.Column>
									<Table.Column className="w-[180px]">시작</Table.Column>
									<Table.Column className="w-[180px]">종료</Table.Column>
									<Table.Column className="w-[90px]">문항</Table.Column>
								</Table.Header>
								<Table.Body>
									{exams.map((exam) => (
										<Table.Row key={exam.id}>
											<Table.Cell>
												<div className="w-[260px] space-y-2 overflow-hidden">
													<div className="flex items-center gap-2 overflow-hidden">
														<DocumentIcon className="size-4 shrink-0 text-slate-500" />
														<p className="truncate font-medium text-slate-900">{exam.title}</p>
													</div>
													<p className="truncate text-sm text-slate-600">{exam.description ?? '설명 없음'}</p>
												</div>
											</Table.Cell>
											<Table.Cell>
												<div className="w-[100px] overflow-hidden">
													<Chip className="max-w-full" color={getExamTypeColor(exam.exam_type)} size="sm" variant="soft">
														<Chip.Label>{getExamTypeLabel(exam.exam_type)}</Chip.Label>
													</Chip>
												</div>
											</Table.Cell>
											<Table.Cell>
												<div className="w-[150px] space-y-2 overflow-hidden">
													<Chip className="max-w-full" color={getExamStatusColor(exam.status)} size="sm" variant="soft">
														<Chip.Label>{getExamStatusLabel(exam.status)}</Chip.Label>
													</Chip>
													<div className="flex items-center gap-2 overflow-hidden text-sm text-slate-600">
														<ClockIcon className="size-4 shrink-0 text-amber-500" />
														<span className="truncate">{exam.duration_minutes}분</span>
													</div>
												</div>
											</Table.Cell>
											<Table.Cell>
												<div className="flex w-[180px] items-center gap-2 overflow-hidden text-sm text-slate-700">
													<CalendarIcon className="size-4 shrink-0 text-blue-500" />
													<span className="truncate">{formatDateTime(exam.starts_at)}</span>
												</div>
											</Table.Cell>
											<Table.Cell>
												<div className="flex w-[180px] items-center gap-2 overflow-hidden text-sm text-slate-700">
													<CalendarIcon className="size-4 shrink-0 text-violet-500" />
													<span className="truncate">{formatDateTime(exam.ends_at)}</span>
												</div>
											</Table.Cell>
											<Table.Cell>
												<span className="block w-[90px] truncate text-sm font-medium text-slate-700">{exam.questions.length}개</span>
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table.Content>
						</Table.ScrollContainer>
					</Table>

					<div className="space-y-4">
						<h3 className="text-base font-semibold text-slate-900">문항 관리</h3>
						{exams.map((exam) => (
							<ExamQuestionCard key={exam.id} canManageExams={canManageExams} classroomId={classroomId} exam={exam} materials={materials} />
						))}
					</div>
				</>
			)}
		</div>
	);
}
