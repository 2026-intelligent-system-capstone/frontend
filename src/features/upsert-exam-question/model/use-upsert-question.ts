import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateExamQuestionRequest, UpdateExamQuestionRequest } from '@/entities/exam';
import { examsApi, getClassroomExamDetailQueryKey, getClassroomExamsQueryKey } from '@/entities/exam';

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
