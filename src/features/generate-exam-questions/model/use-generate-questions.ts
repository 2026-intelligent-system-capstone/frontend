import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Exam, GenerateExamQuestionsRequest, GenerateExamQuestionsSubmitResponse } from '@/entities/exam';
import { examsApi, getClassroomExamDetailQueryKey, getClassroomExamsQueryKey } from '@/entities/exam';

const applyGenerationSubmitState = (exam: Exam, response: GenerateExamQuestionsSubmitResponse): Exam => {
	return {
		...exam,
		generation_status: response.generation_status,
		generation_error: response.generation_error,
		generation_job_id: response.job_id,
		generation_requested_at: response.generation_requested_at,
		generation_completed_at: null,
	};
};

export const useGenerateExamQuestions = (classroomId: string, examId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: GenerateExamQuestionsRequest) => examsApi.generateQuestions(classroomId, examId, payload),
		onSuccess: async (response) => {
			queryClient.setQueryData<Exam | undefined>(
				getClassroomExamDetailQueryKey(classroomId, examId),
				(previousExam) => {
					if (!previousExam) {
						return previousExam;
					}

					return applyGenerationSubmitState(previousExam, response);
				},
			);
			queryClient.setQueryData<Exam[] | undefined>(getClassroomExamsQueryKey(classroomId), (previousExams) => {
				if (!previousExams) {
					return previousExams;
				}

				return previousExams.map((exam) => {
					if (exam.id !== examId) {
						return exam;
					}

					return applyGenerationSubmitState(exam, response);
				});
			});
			await queryClient.invalidateQueries({ queryKey: getClassroomExamsQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: getClassroomExamDetailQueryKey(classroomId, examId) });
		},
	});
};
