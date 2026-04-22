import { useQuery } from '@tanstack/react-query';
import type { Query } from '@tanstack/react-query';

import { type ApiResponse, apiClient } from '@/shared/api/client';

import { getClassroomExamDetailQueryKey, getClassroomExamsQueryKey } from '../model/query-keys';
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
	GenerateExamQuestionsRequest,
	GenerateExamQuestionsSubmitResponse,
	RecordExamTurnRequest,
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
	listExams: async (classroomId: string): Promise<Exam[]> => {
		const response = await apiClient.get<ApiResponse<Exam[]>>(`/api/classrooms/${classroomId}/exams`);
		return response.data;
	},
	listMyResults: async (examId: string): Promise<ExamResult[]> => {
		const response = await apiClient.get<ApiResponse<ExamResult[]>>(`/api/exams/${examId}/results/me`);
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
