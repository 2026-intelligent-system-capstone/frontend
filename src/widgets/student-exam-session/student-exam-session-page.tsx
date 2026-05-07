'use client';

import { type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import type {
	ExamQuestionAnswerOption,
	ExamSession,
	ExamTurn,
	ExamTurnEventType,
	RecordExamTurnRequest,
	StudentExamSessionQuestion,
} from '@/entities/exam';
import {
	examsApi,
	getStudentExamDetailQueryKey,
	getStudentExamResultsQueryKey,
	getStudentExamSessionResultQueryKey,
	getStudentExamSessionSheetQueryKey,
	getStudentExamsQueryKey,
	useStudentExamSessionSheet,
} from '@/entities/exam';
import { useSTT, useTTS } from '@/features/take-exam-session';
import { ApiClientError } from '@/shared/api/types';
import { cn } from '@/shared/ui';
import { Button } from '@heroui/react';

import { AICharacter } from './ai-character';
import { ConversationTree } from './conversation-tree';
import { LatexText } from './latex-text';
import { MicButton } from './mic-button';
import { MultipleChoiceInput } from './multiple-choice-input';
import { QuestionNav } from './question-nav';
import { SessionControls } from './session-controls';
import { SessionHeader } from './session-header';

const FALLBACK_DURATION_MINUTES = 40;
const SECONDS_PER_MINUTE = 60;
const TIMER_TICK_MS = 1000;

type CameraStatus = 'checking' | 'ready' | 'denied' | 'unavailable';

interface OralTurn {
	id: string;
	role: Extract<ExamTurn['role'], 'student' | 'assistant'>;
	event_type: ExamTurnEventType;
	content: string;
}

interface StudentExamSessionPageProps {
	examId: string;
}

interface StudentExamSessionAnswerOption {
	id: string;
	label: string;
	text: string;
}

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	return '알 수 없는 오류가 발생했습니다.';
}

function getFinalizePendingStorageKey(examId: string, sessionId: string): string {
	return `student-exam-finalize-pending:${examId}:${sessionId}`;
}

function getFinalizePendingMessage(error: unknown): string {
	if (error instanceof ApiClientError) {
		if (error.status === 401) {
			return '로그인 상태가 만료되어 결과 생성 요청이 완료되지 않았습니다. 다시 로그인한 뒤 결과를 확인해주세요.';
		}
		if (error.status === 403) {
			return '결과 생성 권한을 확인하지 못해 결과 생성이 지연되고 있습니다.';
		}
		if (error.status === 404) {
			return '완료된 시험 세션을 아직 찾지 못해 결과 생성이 지연되고 있습니다.';
		}
		if (error.status >= 500) {
			return '서버 처리 지연으로 결과 생성이 아직 완료되지 않았습니다.';
		}
		return '결과 생성 요청이 완료되지 않아 결과가 준비되는 중입니다.';
	}

	return '네트워크 상태 또는 일시적인 오류로 결과 생성이 아직 완료되지 않았습니다.';
}

function storeFinalizePendingMessage(examId: string, sessionId: string, message: string): void {
	try {
		sessionStorage.setItem(getFinalizePendingStorageKey(examId, sessionId), message);
	} catch {
		// Storage can be unavailable in restricted browsers; URL marker still preserves pending state.
	}
}

function getFallbackRemainingSeconds(durationMinutes: number | undefined): number {
	return (durationMinutes ?? FALLBACK_DURATION_MINUTES) * SECONDS_PER_MINUTE;
}

function getCameraErrorStatus(error: unknown): Exclude<CameraStatus, 'checking' | 'ready'> {
	if (error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')) {
		return 'denied';
	}

	return 'unavailable';
}

function getCameraStatusMessage(status: CameraStatus): string | null {
	if (status === 'denied') {
		return '카메라 권한이 거부되었습니다. 감독 확인을 위해 브라우저 설정에서 카메라 접근을 허용해주세요.';
	}

	if (status === 'unavailable') {
		return '카메라를 사용할 수 없습니다. 기기 연결 상태를 확인한 뒤 다시 시도해주세요.';
	}

	return null;
}

function getExpiresAtRemainingSeconds(expiresAt: string): number {
	return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / TIMER_TICK_MS));
}

function getInitialRemainingSeconds(
	sheet: { duration_minutes?: number } | null | undefined,
	session: ExamSession | null,
): number {
	if (session?.expires_at) {
		return getExpiresAtRemainingSeconds(session.expires_at);
	}
	return getFallbackRemainingSeconds(sheet?.duration_minutes);
}

function getQuestionInputMode(questionType: StudentExamSessionQuestion['question_type']): 'choice' | 'text' {
	return questionType === 'multiple_choice' ? 'choice' : 'text';
}

function getSessionStatusMessage({
	hasError,
	isAnswerSubmitting,
	isFinishing,
	isOralSubmitting,
	isSessionReady,
	isSubmitted,
}: {
	hasError: boolean;
	isAnswerSubmitting: boolean;
	isFinishing: boolean;
	isOralSubmitting: boolean;
	isSessionReady: boolean;
	isSubmitted: boolean;
}): string {
	if (hasError) return '오류 발생';
	if (isFinishing) return '채점 중';
	if (isOralSubmitting) return 'AI 분석 중';
	if (isAnswerSubmitting) return '답변 제출 중';
	if (!isSessionReady) return '세션 시작 중';
	if (isSubmitted) return '제출 완료';
	return '세션 진행 중';
}

function buildTurnPayload(
	question: StudentExamSessionQuestion,
	content: string,
	metadata: Record<string, string> = {},
): RecordExamTurnRequest {
	return {
		role: 'student',
		event_type: 'answer',
		content,
		metadata: {
			question_id: question.id,
			question_type: question.question_type,
			input_mode: getQuestionInputMode(question.question_type),
			...metadata,
		},
		occurred_at: new Date().toISOString(),
	};
}

function toOralTurn(turn: ExamTurn): OralTurn {
	if (turn.role !== 'student' && turn.role !== 'assistant') {
		throw new Error('대화 턴 응답이 올바르지 않습니다.');
	}

	return {
		id: turn.id,
		role: turn.role,
		event_type: turn.event_type,
		content: turn.content,
	};
}

function findLatestAssistantTurn(turns: OralTurn[]): OralTurn | null {
	for (let index = turns.length - 1; index >= 0; index -= 1) {
		const turn = turns[index];
		if (turn?.role === 'assistant') return turn;
	}

	return null;
}

function getFallbackOptionLabel(index: number): string {
	return String(index + 1);
}

function normalizeAnswerOption(option: ExamQuestionAnswerOption, index: number): StudentExamSessionAnswerOption {
	const fallbackLabel = getFallbackOptionLabel(index);
	return {
		id: option.id.trim() || fallbackLabel,
		label: option.label.trim() || fallbackLabel,
		text: option.text.trim(),
	};
}

function hasValidStructuredOptions(options: StudentExamSessionAnswerOption[]): boolean {
	const optionIds = new Set<string>();

	return options.every((option) => {
		if (!option.id || !option.text || optionIds.has(option.id)) {
			return false;
		}

		optionIds.add(option.id);
		return true;
	});
}

function getStudentExamSessionAnswerOptions(question: StudentExamSessionQuestion): StudentExamSessionAnswerOption[] {
	const structuredOptions = (question.answer_options_data ?? []).map(normalizeAnswerOption);

	if (structuredOptions.length > 0 && hasValidStructuredOptions(structuredOptions)) {
		return structuredOptions;
	}

	return question.answer_options.map((text, index) => {
		const fallbackLabel = getFallbackOptionLabel(index);
		return {
			id: fallbackLabel,
			label: fallbackLabel,
			text,
		};
	});
}

function getSelectedOptionIndexes(options: StudentExamSessionAnswerOption[], selectedOptionIds: string[]): number[] {
	return selectedOptionIds
		.map((optionId) => options.findIndex((option) => option.id === optionId))
		.filter((index) => index >= 0);
}

function getSelectedOptionIds(options: StudentExamSessionAnswerOption[], selectedIndexes: number[]): string[] {
	return selectedIndexes
		.map((index) => options[index]?.id)
		.filter((optionId): optionId is string => Boolean(optionId));
}

function buildMultipleChoiceAnswer(
	question: StudentExamSessionQuestion,
	selectedOptionIds: string[],
): { content: string; metadata: Record<string, string> } {
	const options = getStudentExamSessionAnswerOptions(question);
	const selectedOptions = selectedOptionIds
		.map((optionId) => options.find((option) => option.id === optionId))
		.filter((option): option is StudentExamSessionAnswerOption => Boolean(option));
	const content = selectedOptions.map((option) => `${option.label}. ${option.text}`).join('\n');
	const firstOption = selectedOptions[0];

	return {
		content,
		metadata: {
			selected_option_id: firstOption?.id ?? '',
			selected_option_label: firstOption?.label ?? '',
		},
	};
}

export function StudentExamSessionPage({ examId }: StudentExamSessionPageProps) {
	const {
		data: sheet,
		isLoading: isSheetLoading,
		isError: isSheetError,
		error: sheetError,
		refetch: refetchSheet,
	} = useStudentExamSessionSheet(examId);
	const questions = useMemo(() => sheet?.questions ?? [], [sheet?.questions]);
	const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
	const [showEndConfirm, setShowEndConfirm] = useState(false);
	const [showConversationTree, setShowConversationTree] = useState(false);
	const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
	const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<Record<string, string[]>>({});
	const [multipleChoiceDrafts, setMultipleChoiceDrafts] = useState<Record<string, string[]>>({});
	const [subjectiveAnswers, setSubjectiveAnswers] = useState<Record<string, string>>({});
	const [subjectiveDrafts, setSubjectiveDrafts] = useState<Record<string, string>>({});
	const [isFinished, setIsFinished] = useState(false);
	const [remainingSeconds, setRemainingSeconds] = useState(getFallbackRemainingSeconds(undefined));
	const [session, setSession] = useState<ExamSession | null>(null);
	const [sessionError, setSessionError] = useState<string | null>(null);
	const [turnError, setTurnError] = useState<string | null>(null);
	const [finishError, setFinishError] = useState<string | null>(null);
	const [isAnswerSubmitting, setIsAnswerSubmitting] = useState(false);
	const [isFinishing, setIsFinishing] = useState(false);
	const [sessionStartRetryCount, setSessionStartRetryCount] = useState(0);
	const [cameraStatus, setCameraStatus] = useState<CameraStatus>(() =>
		typeof navigator !== 'undefined' && !navigator.mediaDevices?.getUserMedia ? 'unavailable' : 'checking',
	);

	// Oral question state
	const [oralTurns, setOralTurns] = useState<OralTurn[]>([]);
	const [oralInput, setOralInput] = useState('');
	const [isOralSubmitting, setIsOralSubmitting] = useState(false);
	const [showTextInput, setShowTextInput] = useState(false);

	const router = useRouter();
	const queryClient = useQueryClient();
	const hasStartedSessionRef = useRef(false);
	const isCompletingSessionRef = useRef(false);
	const lastSpokenAssistantTurnIdRef = useRef<string | null>(null);
	const endExamDialogRef = useRef<HTMLDivElement>(null);
	const continueButtonRef = useRef<HTMLButtonElement>(null);
	const previousFocusedElementRef = useRef<HTMLElement | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const supportsCamera = typeof navigator === 'undefined' || Boolean(navigator.mediaDevices?.getUserMedia);
	const { isSpeaking, speak, stop: stopTTS } = useTTS();
	const {
		isListening: isSubjectiveListening,
		isSupported: isSubjectiveSttSupported,
		isPermissionBlocked: isSubjectiveSttPermissionBlocked,
		errorMessage: subjectiveSttErrorMessage,
		toggle: toggleSubjectiveMic,
		stop: stopSubjectiveMic,
	} = useSTT((text) => {
		if (!currentQuestionId) return;
		setSubjectiveDrafts((prev) => ({ ...prev, [currentQuestionId]: text }));
	});
	const {
		isListening,
		isSupported: isOralSttSupported,
		isPermissionBlocked: isOralSttPermissionBlocked,
		errorMessage: oralSttErrorMessage,
		toggle: toggleMic,
	} = useSTT((text) => setOralInput(text));

	const currentQuestion = questions.find((q) => q.id === selectedQuestionId) ?? questions[0] ?? null;
	const currentQuestionId = currentQuestion?.id ?? null;
	const unansweredCount = Math.max(0, questions.length - answeredIds.size);
	const isSessionReady = Boolean(session && !sessionError);
	const cameraStatusMessage = getCameraStatusMessage(cameraStatus);
	const currentQuestionAnswerOptions = currentQuestion ? getStudentExamSessionAnswerOptions(currentQuestion) : [];
	const multipleChoiceSelectedOptionIds = currentQuestionId
		? (multipleChoiceDrafts[currentQuestionId] ?? multipleChoiceAnswers[currentQuestionId] ?? [])
		: [];
	const multipleChoiceSelected = getSelectedOptionIndexes(
		currentQuestionAnswerOptions,
		multipleChoiceSelectedOptionIds,
	);
	const subjectiveInput = currentQuestionId
		? (subjectiveDrafts[currentQuestionId] ?? subjectiveAnswers[currentQuestionId] ?? '')
		: '';
	const currentAssistantTurn = useMemo<OralTurn | null>(() => {
		if (currentQuestion?.question_type !== 'oral') return null;
		return (
			findLatestAssistantTurn(oralTurns) ?? {
				id: `question-${currentQuestion.id}`,
				role: 'assistant',
				event_type: 'question',
				content: currentQuestion.question_text,
			}
		);
	}, [currentQuestion, oralTurns]);
	const statusMessage = getSessionStatusMessage({
		hasError: Boolean(sessionError || turnError || finishError),
		isAnswerSubmitting,
		isFinishing,
		isOralSubmitting,
		isSessionReady,
		isSubmitted: Boolean(currentQuestion && answeredIds.has(currentQuestion.id)),
	});

	useEffect(() => {
		if (showEndConfirm) {
			previousFocusedElementRef.current =
				document.activeElement instanceof HTMLElement ? document.activeElement : null;
			continueButtonRef.current?.focus();
			return undefined;
		}

		previousFocusedElementRef.current?.focus();
		previousFocusedElementRef.current = null;
		return undefined;
	}, [showEndConfirm]);

	useEffect(() => {
		if (!sheet || hasStartedSessionRef.current) return;

		hasStartedSessionRef.current = true;
		setSessionError(null);
		examsApi
			.startSession(examId)
			.then((startedSession) => {
				setSession(startedSession);
				setRemainingSeconds(getInitialRemainingSeconds(sheet, startedSession));
			})
			.catch((error: unknown) => {
				setSessionError(getErrorMessage(error));
			});
	}, [examId, sessionStartRetryCount, sheet]);

	// 이탈 방지
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (!isFinished && !isFinishing) {
				e.preventDefault();
				e.returnValue = '';
			}
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [isFinished, isFinishing]);

	// Camera setup
	useEffect(() => {
		const videoElement = videoRef.current;
		if (!supportsCamera) return undefined;

		let isCancelled = false;
		let activeStream: MediaStream | null = null;

		navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then((stream) => {
				if (isCancelled) {
					stream.getTracks().forEach((track) => track.stop());
					return;
				}

				activeStream = stream;
				if (videoElement) videoElement.srcObject = stream;
				setCameraStatus('ready');
			})
			.catch((error: unknown) => {
				if (!isCancelled) {
					setCameraStatus(getCameraErrorStatus(error));
				}
			});
		return () => {
			isCancelled = true;
			activeStream?.getTracks().forEach((track) => track.stop());
			if (videoElement?.srcObject) {
				(videoElement.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
				videoElement.srcObject = null;
			}
		};
	}, [supportsCamera]);

	const resetOralQuestionState = () => {
		setOralInput('');
		setOralTurns([]);
		setShowTextInput(false);
		setTurnError(null);
		lastSpokenAssistantTurnIdRef.current = null;
	};

	const selectQuestion = (questionId: string) => {
		stopSubjectiveMic();
		resetOralQuestionState();
		setSelectedQuestionId(questionId);
	};

	const retryStartSession = () => {
		hasStartedSessionRef.current = false;
		setSession(null);
		setSessionError(null);
		setSessionStartRetryCount((count) => count + 1);
	};

	const goToNextQuestion = (currentId: string) => {
		const currentIndex = questions.findIndex((q) => q.id === currentId);
		if (currentIndex >= 0 && currentIndex < questions.length - 1) {
			selectQuestion(questions[currentIndex + 1].id);
		}
	};

	const recordAnswerTurn = async (question: StudentExamSessionQuestion, payload: RecordExamTurnRequest) => {
		if (!session) {
			throw new Error('시험 세션이 아직 시작되지 않았습니다. 잠시 후 다시 제출해주세요.');
		}
		return examsApi.recordTurn(examId, session.session_id, payload);
	};

	const moveFromOralQuestion = (questionId: string) => {
		setAnsweredIds((prev) => new Set([...prev, questionId]));
		goToNextQuestion(questionId);
	};

	const handleMultipleChoiceSubmit = async (selected: number[]) => {
		if (!currentQuestion || currentQuestion.question_type !== 'multiple_choice' || isAnswerSubmitting) return;
		const selectedOptionIds = getSelectedOptionIds(currentQuestionAnswerOptions, selected);
		const { content, metadata } = buildMultipleChoiceAnswer(currentQuestion, selectedOptionIds);

		setTurnError(null);
		setIsAnswerSubmitting(true);
		try {
			await recordAnswerTurn(currentQuestion, buildTurnPayload(currentQuestion, content, metadata));
			setMultipleChoiceAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOptionIds }));
			setMultipleChoiceDrafts((prev) => ({ ...prev, [currentQuestion.id]: selectedOptionIds }));
			setAnsweredIds((prev) => new Set([...prev, currentQuestion.id]));
			goToNextQuestion(currentQuestion.id);
		} catch (error: unknown) {
			setTurnError(getErrorMessage(error));
		} finally {
			setIsAnswerSubmitting(false);
		}
	};

	const handleSubjectiveSubmit = async () => {
		if (!currentQuestion || !subjectiveInput.trim() || isAnswerSubmitting) return;

		setTurnError(null);
		setIsAnswerSubmitting(true);
		try {
			const answer = subjectiveInput.trim();
			await recordAnswerTurn(currentQuestion, buildTurnPayload(currentQuestion, answer));
			setSubjectiveAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
			setSubjectiveDrafts((prev) => ({ ...prev, [currentQuestion.id]: answer }));
			setAnsweredIds((prev) => new Set([...prev, currentQuestion.id]));
			goToNextQuestion(currentQuestion.id);
		} catch (error: unknown) {
			setTurnError(getErrorMessage(error));
		} finally {
			setIsAnswerSubmitting(false);
		}
	};

	const handleOralSubmit = async () => {
		if (!currentQuestion || !session || !oralInput.trim() || isOralSubmitting) return;
		stopTTS();

		const answer = oralInput.trim();
		const inputMode = showTextInput ? 'text' : 'speech';

		setTurnError(null);
		setIsOralSubmitting(true);
		try {
			const studentTurn = await recordAnswerTurn(
				currentQuestion,
				buildTurnPayload(currentQuestion, answer, { input_mode: inputMode }),
			);
			if (studentTurn.role !== 'student') {
				throw new Error('학생 답변 기록 응답이 올바르지 않습니다.');
			}
			setOralTurns((prev) => [...prev, toOralTurn(studentTurn)]);
			setOralInput('');
			setShowTextInput(false);
			const assistantTurn = await examsApi.generateFollowUp(examId, session.session_id, {
				question_id: currentQuestion.id,
				answer_content: answer,
				metadata: { input_mode: inputMode },
				occurred_at: new Date().toISOString(),
			});
			if (assistantTurn.role !== 'assistant') {
				throw new Error('꼬리질문 응답이 올바르지 않습니다.');
			}
			setOralTurns((prev) => [...prev, toOralTurn(assistantTurn)]);
		} catch (error: unknown) {
			setTurnError(getErrorMessage(error));
		} finally {
			setIsOralSubmitting(false);
		}
	};

	const invalidateExamCompletionQueries = useCallback(
		async (sessionId: string) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: getStudentExamsQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getStudentExamDetailQueryKey(examId) }),
				queryClient.invalidateQueries({ queryKey: getStudentExamSessionSheetQueryKey(examId) }),
				queryClient.invalidateQueries({ queryKey: getStudentExamResultsQueryKey(examId) }),
				queryClient.invalidateQueries({ queryKey: getStudentExamSessionResultQueryKey(examId, sessionId) }),
			]);
		},
		[examId, queryClient],
	);

	const completeSessionAndNavigate = useCallback(async () => {
		if (!session || isCompletingSessionRef.current) {
			setFinishError('시험 세션이 아직 시작되지 않았습니다. 잠시 후 다시 시도해주세요.');
			setShowEndConfirm(false);
			return;
		}

		const sessionId = session.session_id;
		isCompletingSessionRef.current = true;
		setFinishError(null);
		setIsFinishing(true);
		try {
			const completedSession = await examsApi.completeSession(examId, sessionId, {
				occurred_at: new Date().toISOString(),
			});
			let isFinalizePending = false;
			setSession(completedSession);
			try {
				await examsApi.finalizeResult(examId, sessionId, { occurred_at: new Date().toISOString() });
			} catch (finalizeError: unknown) {
				isFinalizePending = true;
				storeFinalizePendingMessage(examId, sessionId, getFinalizePendingMessage(finalizeError));
			} finally {
				await invalidateExamCompletionQueries(sessionId);
			}
			setIsFinished(true);
			setShowEndConfirm(false);
			const resultSearchParams = new URLSearchParams({ sessionId });
			if (isFinalizePending) {
				resultSearchParams.set('finalize', 'pending');
			}
			router.push(`/student/exams/${examId}/result?${resultSearchParams.toString()}`);
		} catch (error: unknown) {
			isCompletingSessionRef.current = false;
			setFinishError(getErrorMessage(error));
			setShowEndConfirm(false);
		} finally {
			setIsFinishing(false);
		}
	}, [examId, invalidateExamCompletionQueries, router, session]);

	const handleEndExam = () => {
		setFinishError(null);
		setShowEndConfirm(true);
	};

	const handleEndConfirmKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape' && !isFinishing) {
			event.preventDefault();
			setShowEndConfirm(false);
			return;
		}

		if (event.key !== 'Tab') return;

		const focusableElements = endExamDialogRef.current?.querySelectorAll<HTMLElement>(
			'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		);
		if (!focusableElements?.length) return;

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];
		if (event.shiftKey && document.activeElement === firstElement) {
			event.preventDefault();
			lastElement.focus();
			return;
		}
		if (!event.shiftKey && document.activeElement === lastElement) {
			event.preventDefault();
			firstElement.focus();
		}
	};

	const handleConfirmEnd = async () => {
		await completeSessionAndNavigate();
	};

	useEffect(() => {
		if (isFinished || isFinishing || !sheet) return undefined;

		const updateRemainingSeconds = () => {
			if (session?.expires_at) {
				const nextRemainingSeconds = getExpiresAtRemainingSeconds(session.expires_at);
				setRemainingSeconds(nextRemainingSeconds);
				if (nextRemainingSeconds <= 0) {
					void completeSessionAndNavigate();
				}
				return;
			}

			setRemainingSeconds((prev) => {
				const nextRemainingSeconds = Math.max(0, prev - 1);
				if (nextRemainingSeconds <= 0) {
					void completeSessionAndNavigate();
				}
				return nextRemainingSeconds;
			});
		};

		const timer = setInterval(updateRemainingSeconds, TIMER_TICK_MS);
		return () => clearInterval(timer);
	}, [completeSessionAndNavigate, isFinished, isFinishing, session?.expires_at, sheet]);

	useEffect(() => {
		if (!currentAssistantTurn || currentQuestion?.question_type !== 'oral') return;
		if (lastSpokenAssistantTurnIdRef.current === currentAssistantTurn.id) return;
		lastSpokenAssistantTurnIdRef.current = currentAssistantTurn.id;
		speak(currentAssistantTurn.content);
	}, [currentAssistantTurn, currentQuestion?.question_type, speak]);

	useEffect(() => {
		return () => stopTTS();
	}, [stopTTS]);

	if (isSheetLoading) {
		return (
			<div className="bg-surface-muted text-neutral-gray-500 flex h-screen items-center justify-center text-sm">
				시험지를 불러오는 중입니다...
			</div>
		);
	}

	if (isSheetError) {
		return (
			<div className="bg-surface-muted flex h-screen items-center justify-center px-6">
				<div
					className="shadow-card border-danger-text/20 bg-danger-soft w-full max-w-md rounded-3xl border p-6
						text-center"
				>
					<h1 className="text-danger-text text-lg font-semibold">시험지를 불러오지 못했습니다.</h1>
					<p className="text-danger-text mt-2 text-sm">{getErrorMessage(sheetError)}</p>
					<Button className="shadow-button mt-5" variant="primary" onPress={() => void refetchSheet()}>
						다시 시도
					</Button>
				</div>
			</div>
		);
	}

	if (!sheet || questions.length === 0 || !currentQuestion) {
		return (
			<div className="bg-surface-muted flex h-screen items-center justify-center px-6 text-center">
				<div className="border-border-subtle shadow-card w-full max-w-md rounded-3xl border bg-white p-6">
					<h1 className="text-neutral-text text-lg font-semibold">응시 가능한 문항이 없습니다.</h1>
					<p className="text-neutral-gray-500 mt-2 text-sm">담당자가 문항을 준비한 뒤 다시 시도해주세요.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-surface-muted text-neutral-text flex h-screen flex-col">
			{/* 평가 종료 확인 다이얼로그 */}
			{showEndConfirm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
					<div
						ref={endExamDialogRef}
						aria-describedby="end-exam-description"
						aria-labelledby="end-exam-title"
						aria-modal="true"
						className="border-border-subtle bg-surface text-neutral-text shadow-card mx-4 w-full max-w-sm
							rounded-3xl border p-6"
						role="alertdialog"
						onKeyDown={handleEndConfirmKeyDown}
					>
						<h2 id="end-exam-title" className="text-neutral-text text-lg font-semibold">
							평가를 종료하시겠습니까?
						</h2>
						<div id="end-exam-description">
							{unansweredCount > 0 ? (
								<p className="text-warning-text mt-2 text-sm">
									아직 {unansweredCount}개 문제가 답변되지 않았습니다.
								</p>
							) : (
								<p className="text-brand-deep mt-2 text-sm">모든 문제에 답변을 완료했습니다.</p>
							)}
							<p className="text-neutral-gray-500 mt-1 text-xs">종료 후에는 답변을 수정할 수 없습니다.</p>
						</div>
						<div className="mt-5 flex gap-3">
							<Button
								ref={continueButtonRef}
								className="flex-1"
								isDisabled={isFinishing}
								variant="outline"
								onPress={() => setShowEndConfirm(false)}
							>
								계속 풀기
							</Button>
							<Button
								className="flex-1"
								isDisabled={!session}
								isPending={isFinishing}
								variant="danger"
								onPress={() => void handleConfirmEnd()}
							>
								{isFinishing ? '종료 처리 중...' : '종료하기'}
							</Button>
						</div>
					</div>
				</div>
			)}

			<div className="sr-only" role="status" aria-live="polite">
				{statusMessage}
			</div>

			<SessionHeader
				answeredCount={answeredIds.size}
				bloomLevel={currentQuestion.bloom_level}
				examTitle={sheet.title}
				isFinished={isFinished || isFinishing}
				questionNumber={currentQuestion.question_number}
				remainingSeconds={remainingSeconds}
				showConversationTree={showConversationTree}
				totalQuestions={questions.length}
				onEndExam={handleEndExam}
				onToggleConversationTree={() => setShowConversationTree((value) => !value)}
			/>

			{sessionError && (
				<div
					className="border-danger-text/20 bg-danger-soft text-danger-text border-b px-4 py-3 text-sm sm:px-6"
				>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<span>시험 세션을 시작하지 못했습니다. {sessionError}</span>
						<Button size="sm" variant="outline" onPress={retryStartSession}>
							다시 시도
						</Button>
					</div>
				</div>
			)}

			{turnError && (
				<div
					className="border-danger-text/20 bg-danger-soft text-danger-text border-b px-4 py-3 text-sm sm:px-6"
				>
					답변을 제출하지 못했습니다. {turnError}
				</div>
			)}

			{finishError && (
				<div
					className="border-danger-text/20 bg-danger-soft text-danger-text border-b px-4 py-3 text-sm sm:px-6"
				>
					평가 종료 처리에 실패했습니다. {finishError}
				</div>
			)}

			{isFinishing && (
				<div
					className="border-brand-border bg-brand-soft text-brand-deep border-b px-4 py-3 text-sm font-medium
						sm:px-6"
				>
					평가를 종료하고 결과를 생성하는 중입니다...
				</div>
			)}

			<div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
				<QuestionNav
					questions={questions}
					currentId={currentQuestion.id}
					answeredIds={answeredIds}
					onSelect={selectQuestion}
				/>

				<div
					className="relative flex flex-1 flex-col items-center gap-6 overflow-y-auto px-4 py-6 pb-40 sm:px-6
						sm:py-8 md:pb-8"
				>
					<div
						className="pointer-events-none absolute inset-0
							bg-[radial-gradient(circle_at_top,var(--color-brand-soft),transparent_42%)]"
					/>

					{/* 객관식 */}
					{currentQuestion.question_type === 'multiple_choice' && (
						<div className="z-10 flex w-full max-w-2xl flex-col gap-5">
							<div
								className="border-border-subtle bg-surface shadow-card rounded-3xl border px-5 py-4
									sm:px-6"
							>
								<span className="text-brand-deep mb-2 block text-xs font-medium">객관식</span>
								<p className="text-neutral-text text-base leading-relaxed font-medium">
									{currentQuestion.question_text}
								</p>
							</div>
							<MultipleChoiceInput
								disabledReason={
									!isSessionReady
										? '세션을 준비하는 중입니다. 잠시 후 답안을 제출할 수 있습니다.'
										: undefined
								}
								isAnswered={answeredIds.has(currentQuestion.id)}
								isDisabled={!isSessionReady}
								isSubmitting={isAnswerSubmitting}
								options={currentQuestionAnswerOptions.map((option) => option.text)}
								selected={multipleChoiceSelected}
								onChange={(selected) =>
									setMultipleChoiceDrafts((prev) => ({
										...prev,
										[currentQuestion.id]: getSelectedOptionIds(
											currentQuestionAnswerOptions,
											selected,
										),
									}))
								}
								onSubmit={(selected) => void handleMultipleChoiceSubmit(selected)}
							/>
						</div>
					)}

					{/* 주관식 */}
					{currentQuestion.question_type === 'subjective' && (
						<div className="z-10 flex w-full max-w-2xl flex-col gap-5">
							<div
								className="border-border-subtle bg-surface shadow-card rounded-3xl border px-5 py-4
									sm:px-6"
							>
								<span className="text-warning-text mb-2 block text-xs font-medium">주관식</span>
								<p className="text-neutral-text text-base leading-relaxed font-medium">
									<LatexText text={currentQuestion.question_text} />
								</p>
							</div>
							<div
								className="border-border-subtle bg-surface shadow-card flex flex-col gap-4 rounded-3xl
									border p-5 sm:p-6"
							>
								<textarea
									aria-label="주관식 답변 입력"
									className="border-border-subtle bg-surface-muted text-neutral-text
										placeholder:text-neutral-gray-500 focus:border-brand-border w-full resize-none
										rounded-2xl border px-4 py-3 text-sm focus:bg-white focus:outline-none
										disabled:cursor-not-allowed disabled:opacity-70"
									disabled={
										answeredIds.has(currentQuestion.id) || isAnswerSubmitting || !isSessionReady
									}
									placeholder="답변을 입력하거나 마이크로 말하세요."
									rows={6}
									value={subjectiveInput}
									onChange={(event) =>
										setSubjectiveDrafts((prev) => ({
											...prev,
											[currentQuestion.id]: event.target.value,
										}))
									}
								/>
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div className="flex items-center gap-3">
										<MicButton
											disabled={
												answeredIds.has(currentQuestion.id) ||
												isAnswerSubmitting ||
												!isSessionReady ||
												!isSubjectiveSttSupported ||
												isSubjectiveSttPermissionBlocked
											}
											disabledReason={
												subjectiveSttErrorMessage ??
												(!isSubjectiveSttSupported
													? '이 브라우저는 음성 인식을 지원하지 않습니다.'
													: null)
											}
											isListening={isSubjectiveListening}
											onToggle={toggleSubjectiveMic}
										/>
										<p
											className="text-neutral-gray-500 text-xs"
											role={subjectiveSttErrorMessage ? 'status' : undefined}
										>
											{subjectiveSttErrorMessage ??
												(!isSubjectiveSttSupported
													? '이 브라우저는 음성 인식을 지원하지 않습니다. 직접 입력해주세요.'
													: isSubjectiveListening
														? '음성 인식 중... 말씀해주세요.'
														: '마이크로 답변하거나 직접 입력하세요.')}
										</p>
									</div>
									{!answeredIds.has(currentQuestion.id) ? (
										<Button
											className="shadow-button w-full sm:w-auto"
											isDisabled={
												!subjectiveInput.trim() || isAnswerSubmitting || !isSessionReady
											}
											isPending={isAnswerSubmitting}
											variant="primary"
											onPress={() => void handleSubjectiveSubmit()}
										>
											{isAnswerSubmitting ? '제출 중...' : '제출'}
										</Button>
									) : (
										<p className="text-brand-deep text-xs font-medium">제출 완료</p>
									)}
								</div>
							</div>
						</div>
					)}

					{/* 구술 */}
					{currentQuestion.question_type === 'oral' && (
						<>
							<AICharacter isSpeaking={isSpeaking} />
							{currentAssistantTurn && (
								<div
									className="border-border-subtle bg-surface shadow-card w-full max-w-2xl rounded-3xl
										border px-5 py-4 text-center sm:px-6"
								>
									<span className="text-brand-deep mb-2 block text-xs font-medium">
										{currentAssistantTurn.event_type === 'question' ? '질문' : '꼬리질문'}
									</span>
									<p className="text-neutral-text text-base leading-relaxed font-medium">
										{currentAssistantTurn.content}
									</p>
								</div>
							)}
							{isOralSubmitting && (
								<p className="text-neutral-gray-500 animate-pulse text-sm" role="status">
									답변을 기록하고 AI가 꼬리질문을 생성하고 있습니다...
								</p>
							)}
							{oralTurns.filter((turn) => turn.role === 'student').length > 0 && (
								<div className="w-full max-w-2xl space-y-2">
									{oralTurns
										.filter((turn) => turn.role === 'student')
										.map((turn) => (
											<div key={turn.id} className="flex justify-end">
												<div
													className="border-brand-border bg-brand-soft text-brand-deep
														shadow-button max-w-[85%] rounded-2xl border px-4 py-2 text-sm"
												>
													{turn.content}
												</div>
											</div>
										))}
								</div>
							)}
							<SessionControls
								input={oralInput}
								isDisabled={!isSessionReady || answeredIds.has(currentQuestion.id)}
								isFinished={isFinished}
								isListening={isListening}
								isSttSupported={isOralSttSupported}
								isSttPermissionBlocked={isOralSttPermissionBlocked}
								isSubmitting={isOralSubmitting}
								showTextInput={showTextInput}
								sttErrorMessage={oralSttErrorMessage}
								onInputChange={setOralInput}
								onMicToggle={toggleMic}
								onSubmit={() => void handleOralSubmit()}
								onToggleTextInput={() => setShowTextInput((value) => !value)}
							/>
							{oralTurns.some((turn) => turn.role === 'student') &&
								!answeredIds.has(currentQuestion.id) && (
									<Button
										className="shadow-button w-full max-w-2xl sm:w-auto"
										isDisabled={isOralSubmitting || !isSessionReady}
										variant="secondary"
										onPress={() => moveFromOralQuestion(currentQuestion.id)}
									>
										다음 문항으로
									</Button>
								)}
						</>
					)}

					{/* 카메라 미리보기 */}
					<div
						className={cn(
							`border-border-subtle bg-neutral-text shadow-card absolute right-4 bottom-4 overflow-hidden
							rounded-2xl border transition-transform duration-300`,
							showConversationTree && 'md:-translate-x-72',
						)}
					>
						{cameraStatusMessage ? (
							<div
								className="text-danger-soft flex h-24 w-36 items-center justify-center p-3 text-center
									text-xs leading-relaxed sm:h-32 sm:w-44"
								role="status"
							>
								{cameraStatusMessage}
							</div>
						) : (
							<video
								ref={videoRef}
								autoPlay
								muted
								playsInline
								className="bg-neutral-text h-24 w-36 object-cover sm:h-32 sm:w-44"
							/>
						)}
						<div className="absolute bottom-1 left-2 text-xs text-white/70">나</div>
					</div>
				</div>

				{/* 대화 흐름 트리 패널 */}
				<ConversationTree
					isOpen={showConversationTree}
					turns={oralTurns}
					onClose={() => setShowConversationTree(false)}
				/>
			</div>
		</div>
	);
}
