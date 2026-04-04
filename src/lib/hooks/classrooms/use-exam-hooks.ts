import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
	CreateExamQuestionRequest,
	CreateExamRequest,
	GenerateExamQuestionsRequest,
	UpdateExamQuestionRequest,
} from '@/types/exam';

import { examsApi } from '@/lib/api/exams';
import { getClassroomExamDetailQueryKey, getClassroomExamsQueryKey } from '@/lib/hooks/classroom-query-keys';

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

export const useCreateExam = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateExamRequest) => examsApi.createExam(classroomId, payload),
		onSuccess: async (exam) => {
			await queryClient.invalidateQueries({ queryKey: getClassroomExamsQueryKey(classroomId) });
			queryClient.setQueryData(getClassroomExamDetailQueryKey(classroomId, exam.id), exam);
		},
	});
};

export const useGenerateExamQuestions = (classroomId: string, examId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: GenerateExamQuestionsRequest) => examsApi.generateQuestions(classroomId, examId, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getClassroomExamsQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: getClassroomExamDetailQueryKey(classroomId, examId) });
		},
	});
};

export const useCreateExamQuestion = (classroomId: string, examId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateExamQuestionRequest) => examsApi.createQuestion(classroomId, examId, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getClassroomExamsQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: getClassroomExamDetailQueryKey(classroomId, examId) });
		},
	});
};

export const useUpdateExamQuestion = (classroomId: string, examId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ questionId, payload }: { questionId: string; payload: UpdateExamQuestionRequest }) =>
			examsApi.updateQuestion(classroomId, examId, questionId, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getClassroomExamsQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: getClassroomExamDetailQueryKey(classroomId, examId) });
		},
	});
};

export const useDeleteExamQuestion = (classroomId: string, examId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (questionId: string) => examsApi.deleteQuestion(classroomId, examId, questionId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getClassroomExamsQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: getClassroomExamDetailQueryKey(classroomId, examId) });
		},
	});
};
