import { useMutation, useQueryClient } from '@tanstack/react-query';

import { examsApi, getClassroomExamDetailQueryKey, getClassroomExamsQueryKey } from '@/entities/exam';

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
