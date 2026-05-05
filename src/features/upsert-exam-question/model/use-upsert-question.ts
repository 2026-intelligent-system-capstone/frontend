import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateExamQuestionRequest } from '@/entities/exam';
import { examsApi, getClassroomExamDetailQueryKey, getClassroomExamsQueryKey } from '@/entities/exam';

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
