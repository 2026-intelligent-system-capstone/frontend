'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { classroomsApi } from '@/lib/api/classrooms';
import { examsApi } from '@/lib/api/exams';
import { usersApi } from '@/lib/api/users';
import type {
	CreateClassroomMaterialRequest,
	CreateClassroomRequest,
	InviteClassroomStudentsRequest,
} from '@/types/classroom';
import type {
	CreateExamQuestionRequest,
	CreateExamRequest,
	GenerateExamQuestionsRequest,
	UpdateExamQuestionRequest,
} from '@/types/exam';

const CLASSROOMS_QUERY_KEY = ['classrooms'] as const;
const CLASSROOM_USERS_QUERY_KEY = ['users'] as const;

const getClassroomMaterialsQueryKey = (classroomId: string) => [...CLASSROOMS_QUERY_KEY, classroomId, 'materials'] as const;
const getClassroomExamsQueryKey = (classroomId: string) => [...CLASSROOMS_QUERY_KEY, classroomId, 'exams'] as const;
const getClassroomExamDetailQueryKey = (classroomId: string, examId: string) =>
	[...CLASSROOMS_QUERY_KEY, classroomId, 'exams', examId] as const;

export const useClassrooms = (initialData?: Awaited<ReturnType<typeof classroomsApi.listClassrooms>>) => {
	return useQuery({
		queryKey: CLASSROOMS_QUERY_KEY,
		queryFn: classroomsApi.listClassrooms,
		initialData,
		staleTime: 60 * 1000,
	});
};

export const useClassroomDetail = (
	classroomId: string,
	initialData?: Awaited<ReturnType<typeof classroomsApi.getClassroom>>,
) => {
	return useQuery({
		queryKey: [...CLASSROOMS_QUERY_KEY, classroomId, 'detail'] as const,
		queryFn: () => classroomsApi.getClassroom(classroomId),
		enabled: Boolean(classroomId),
		initialData,
		staleTime: 60 * 1000,
	});
};

export const useClassroomMaterials = (
	classroomId: string,
	initialData?: Awaited<ReturnType<typeof classroomsApi.listMaterials>>,
) => {
	return useQuery({
		queryKey: getClassroomMaterialsQueryKey(classroomId),
		queryFn: () => classroomsApi.listMaterials(classroomId),
		enabled: Boolean(classroomId),
		initialData,
		staleTime: 60 * 1000,
	});
};

export const useCreateClassroomMaterial = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateClassroomMaterialRequest) => classroomsApi.createMaterial(classroomId, payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: getClassroomMaterialsQueryKey(classroomId) });
			void queryClient.invalidateQueries({ queryKey: [...CLASSROOMS_QUERY_KEY, classroomId, 'detail'] as const });
		},
	});
};

export const useDeleteClassroomMaterial = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (materialId: string) => classroomsApi.deleteMaterial(classroomId, materialId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getClassroomMaterialsQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: [...CLASSROOMS_QUERY_KEY, classroomId, 'detail'] as const });
		},
	});
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

export const useUsers = (initialData?: Awaited<ReturnType<typeof usersApi.listUsers>>) => {
	return useQuery({
		queryKey: CLASSROOM_USERS_QUERY_KEY,
		queryFn: usersApi.listUsers,
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

export const useCreateClassroom = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateClassroomRequest) => classroomsApi.createClassroom(payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: CLASSROOMS_QUERY_KEY });
		},
	});
};

export const useInviteClassroomStudents = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: InviteClassroomStudentsRequest) => classroomsApi.inviteStudents(classroomId, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [...CLASSROOMS_QUERY_KEY, classroomId, 'detail'] as const });
			await queryClient.invalidateQueries({ queryKey: CLASSROOMS_QUERY_KEY });
		},
	});
};

export const useRemoveClassroomStudent = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (studentId: string) => classroomsApi.removeStudent(classroomId, studentId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [...CLASSROOMS_QUERY_KEY, classroomId, 'detail'] as const });
			await queryClient.invalidateQueries({ queryKey: CLASSROOMS_QUERY_KEY });
		},
	});
};

export { CLASSROOMS_QUERY_KEY, CLASSROOM_USERS_QUERY_KEY };
