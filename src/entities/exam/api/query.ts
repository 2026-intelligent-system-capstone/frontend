import { useQuery } from '@tanstack/react-query';
import type { Query } from '@tanstack/react-query';

import { type ApiResponse, apiClient } from '@/shared/api/client';

import {
	getClassroomExamDetailQueryKey,
	getClassroomExamsQueryKey,
	getStudentExamDetailQueryKey,
	getStudentExamResultsQueryKey,
	getStudentExamSessionResultQueryKey,
	getStudentExamSessionSheetQueryKey,
	getStudentExamsQueryKey,
} from '../model/query-keys';
import type {
	CompleteExamSessionRequest,
	CreateExamQuestionRequest,
	CreateExamRequest,
	Exam,
	ExamQuestion,
	ExamResult,
	ExamSession,
	ExamTurn,
	FinalizeExamResultRequest,
	GenerateExamFollowUpRequest,
	GenerateExamFollowUpResponse,
	GenerateExamQuestionsRequest,
	GenerateExamQuestionsSubmitResponse,
	RecordExamTurnRequest,
	StudentExamPayload,
	StudentExamResult,
	StudentExamSessionSheet,
	UpdateExamQuestionRequest,
} from '../model/types';

const EXAM_POLL_INTERVAL_MS = 2_000;

const getExamRefetchInterval = (query: Query<Exam>): number | false => {
	if (query.state.error) {
		return false;
	}

	const generationStatus = query.state.data?.generation_status;
	return generationStatus === 'queued' || generationStatus === 'running' ? EXAM_POLL_INTERVAL_MS : false;
};

export const examsApi = {
	completeSession: async (
		examId: string,
		sessionId: string,
		payload: CompleteExamSessionRequest,
	): Promise<ExamSession> => {
		const response = await apiClient.post<ApiResponse<ExamSession>>(
			`/api/exams/${examId}/sessions/${sessionId}/complete`,
			payload,
		);
		return response.data;
	},
	createExam: async (classroomId: string, payload: CreateExamRequest): Promise<Exam> => {
		const response = await apiClient.post<ApiResponse<Exam>>(`/api/classrooms/${classroomId}/exams`, payload);
		return response.data;
	},
	createQuestion: async (
		classroomId: string,
		examId: string,
		payload: CreateExamQuestionRequest,
	): Promise<ExamQuestion> => {
		const response = await apiClient.post<ApiResponse<ExamQuestion>>(
			`/api/classrooms/${classroomId}/exams/${examId}/questions`,
			payload,
		);
		return response.data;
	},
	deleteQuestion: async (classroomId: string, examId: string, questionId: string): Promise<ExamQuestion> => {
		const response = await apiClient.delete<ApiResponse<ExamQuestion>>(
			`/api/classrooms/${classroomId}/exams/${examId}/questions/${questionId}`,
		);
		return response.data;
	},
	finalizeResult: async (
		examId: string,
		sessionId: string,
		payload: FinalizeExamResultRequest,
	): Promise<ExamResult> => {
		const response = await apiClient.post<ApiResponse<ExamResult>>(
			`/api/exams/${examId}/sessions/${sessionId}/results/finalize`,
			payload,
		);
		return response.data;
	},
	generateFollowUp: async (
		examId: string,
		sessionId: string,
		payload: GenerateExamFollowUpRequest,
	): Promise<GenerateExamFollowUpResponse> => {
		const response = await apiClient.post<ApiResponse<GenerateExamFollowUpResponse>>(
			`/api/exams/${examId}/sessions/${sessionId}/follow-ups`,
			payload,
		);
		return response.data;
	},
	generateQuestions: async (
		classroomId: string,
		examId: string,
		payload: GenerateExamQuestionsRequest,
	): Promise<GenerateExamQuestionsSubmitResponse> => {
		const response = await apiClient.post<ApiResponse<GenerateExamQuestionsSubmitResponse>>(
			`/api/classrooms/${classroomId}/exams/${examId}/questions/generate`,
			payload,
		);
		return response.data;
	},
	getExam: async (classroomId: string, examId: string): Promise<Exam> => {
		const response = await apiClient.get<ApiResponse<Exam>>(`/api/classrooms/${classroomId}/exams/${examId}`);
		return response.data;
	},
	getSessionResult: async (examId: string, sessionId: string): Promise<StudentExamResult> => {
		const response = await apiClient.get<ApiResponse<StudentExamResult>>(
			`/api/exams/${examId}/sessions/${sessionId}/result`,
		);
		return response.data;
	},
	getStudentExam: async (examId: string): Promise<StudentExamPayload> => {
		const response = await apiClient.get<ApiResponse<StudentExamPayload>>(`/api/exams/${examId}`);
		return response.data;
	},
	getStudentExamSessionSheet: async (examId: string): Promise<StudentExamSessionSheet> => {
		const response = await apiClient.get<ApiResponse<StudentExamSessionSheet>>(
			`/api/exams/${examId}/session-sheet`,
		);
		return response.data;
	},
	listExams: async (classroomId: string): Promise<Exam[]> => {
		const response = await apiClient.get<ApiResponse<Exam[]>>(`/api/classrooms/${classroomId}/exams`);
		return response.data;
	},
	listMyResults: async (examId: string): Promise<StudentExamResult[]> => {
		const response = await apiClient.get<ApiResponse<StudentExamResult[]>>(`/api/exams/${examId}/results/me`);
		return response.data;
	},
	listStudentExams: async (): Promise<StudentExamPayload[]> => {
		const response = await apiClient.get<ApiResponse<StudentExamPayload[]>>('/api/exams');
		return response.data;
	},
	recordTurn: async (examId: string, sessionId: string, payload: RecordExamTurnRequest): Promise<ExamTurn> => {
		const response = await apiClient.post<ApiResponse<ExamTurn>>(
			`/api/exams/${examId}/sessions/${sessionId}/turns`,
			payload,
		);
		return response.data;
	},
	startSession: async (examId: string): Promise<ExamSession> => {
		const response = await apiClient.post<ApiResponse<ExamSession>>(`/api/exams/${examId}/sessions`);
		return response.data;
	},
	updateQuestion: async (
		classroomId: string,
		examId: string,
		questionId: string,
		payload: UpdateExamQuestionRequest,
	): Promise<ExamQuestion> => {
		const response = await apiClient.patch<ApiResponse<ExamQuestion>>(
			`/api/classrooms/${classroomId}/exams/${examId}/questions/${questionId}`,
			payload,
		);
		return response.data;
	},
};

export const useClassroomExams = (
	classroomId: string,
	initialData?: Awaited<ReturnType<typeof examsApi.listExams>>,
) => {
	return useQuery({
		queryKey: getClassroomExamsQueryKey(classroomId),
		queryFn: () => examsApi.listExams(classroomId),
		enabled: Boolean(classroomId),
		initialData,
		staleTime: 60 * 1000,
	});
};

export const useClassroomExam = (
	classroomId: string,
	examId: string,
	initialData?: Awaited<ReturnType<typeof examsApi.getExam>>,
) => {
	return useQuery({
		queryKey: getClassroomExamDetailQueryKey(classroomId, examId),
		queryFn: () => examsApi.getExam(classroomId, examId),
		enabled: Boolean(classroomId && examId),
		initialData,
		refetchInterval: getExamRefetchInterval,
		staleTime: 60 * 1000,
	});
};

export const useStudentExams = (initialData?: Awaited<ReturnType<typeof examsApi.listStudentExams>>) => {
	return useQuery({
		queryKey: getStudentExamsQueryKey(),
		queryFn: examsApi.listStudentExams,
		initialData,
		staleTime: 60 * 1000,
	});
};

export const useStudentExam = (examId: string, initialData?: Awaited<ReturnType<typeof examsApi.getStudentExam>>) => {
	return useQuery({
		queryKey: getStudentExamDetailQueryKey(examId),
		queryFn: () => examsApi.getStudentExam(examId),
		enabled: Boolean(examId),
		initialData,
		staleTime: 60 * 1000,
	});
};

export const useStudentExamSessionSheet = (
	examId: string,
	initialData?: Awaited<ReturnType<typeof examsApi.getStudentExamSessionSheet>>,
) => {
	return useQuery({
		queryKey: getStudentExamSessionSheetQueryKey(examId),
		queryFn: () => examsApi.getStudentExamSessionSheet(examId),
		enabled: Boolean(examId),
		initialData,
		staleTime: 60 * 1000,
	});
};

export const useStudentExamSessionResult = (examId: string, sessionId: string | null) => {
	return useQuery({
		queryKey: getStudentExamSessionResultQueryKey(examId, sessionId ?? ''),
		queryFn: () => {
			if (!sessionId) {
				throw new Error('시험 세션 ID가 필요합니다.');
			}
			return examsApi.getSessionResult(examId, sessionId);
		},
		enabled: Boolean(examId && sessionId),
		refetchInterval: (query) =>
			query.state.data?.status === 'pending' || query.state.error ? EXAM_POLL_INTERVAL_MS : false,
		staleTime: 0,
	});
};

interface UseStudentExamResultsOptions {
	enabled?: boolean;
	refetchPending?: boolean;
}

export const useStudentExamResults = (examId: string, options: UseStudentExamResultsOptions = {}) => {
	return useQuery({
		queryKey: getStudentExamResultsQueryKey(examId),
		queryFn: () => examsApi.listMyResults(examId),
		enabled: Boolean(examId) && (options.enabled ?? true),
		refetchInterval: (query) => {
			if (!options.refetchPending) return false;
			return query.state.data?.some((result) => result.status === 'pending') || query.state.error
				? EXAM_POLL_INTERVAL_MS
				: false;
		},
		staleTime: 0,
	});
};
