import { apiClient, type ApiResponse } from '@/lib/api/client';
import type {
	CompleteExamSessionRequest,
	CreateExamRequest,
	CreateExamQuestionRequest,
	Exam,
	ExamQuestion,
	ExamResult,
	ExamSession,
	ExamTurn,
	FinalizeExamResultRequest,
	GenerateExamQuestionsRequest,
	RecordExamTurnRequest,
	UpdateExamQuestionRequest,
} from '@/types/exam';

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
	): Promise<ExamQuestion[]> => {
		const response = await apiClient.post<ApiResponse<ExamQuestion[]>>(
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
};
