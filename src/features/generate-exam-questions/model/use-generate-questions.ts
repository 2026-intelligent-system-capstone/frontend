import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { GenerateExamQuestionsRequest } from '@/entities/exam';
import { examsApi, getClassroomExamDetailQueryKey, getClassroomExamsQueryKey } from '@/entities/exam';

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
