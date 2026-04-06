'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { examsApi, getClassroomExamDetailQueryKey, getClassroomExamsQueryKey } from '@/entities/exam';
import type { CreateExamRequest } from '@/entities/exam';

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
