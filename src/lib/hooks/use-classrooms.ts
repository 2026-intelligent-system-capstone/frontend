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

const CLASSROOMS_QUERY_KEY = ['classrooms'] as const;
const CLASSROOM_USERS_QUERY_KEY = ['users'] as const;

const getClassroomMaterialsQueryKey = (classroomId: string) => [...CLASSROOMS_QUERY_KEY, classroomId, 'materials'] as const;

export const useClassrooms = () => {
	return useQuery({
		queryKey: CLASSROOMS_QUERY_KEY,
		queryFn: classroomsApi.listClassrooms,
		staleTime: 60 * 1000,
	});
};

export const useClassroomDetail = (classroomId: string) => {
	return useQuery({
		queryKey: [...CLASSROOMS_QUERY_KEY, classroomId, 'detail'] as const,
		queryFn: () => classroomsApi.getClassroom(classroomId),
		enabled: Boolean(classroomId),
		staleTime: 60 * 1000,
	});
};

export const useClassroomMaterials = (classroomId: string) => {
	return useQuery({
		queryKey: getClassroomMaterialsQueryKey(classroomId),
		queryFn: () => classroomsApi.listMaterials(classroomId),
		enabled: Boolean(classroomId),
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

export const useClassroomExams = (classroomId: string) => {
	return useQuery({
		queryKey: [...CLASSROOMS_QUERY_KEY, classroomId, 'exams'] as const,
		queryFn: () => examsApi.listExams(classroomId),
		enabled: Boolean(classroomId),
		staleTime: 60 * 1000,
	});
};

export const useUsers = () => {
	return useQuery({
		queryKey: CLASSROOM_USERS_QUERY_KEY,
		queryFn: usersApi.listUsers,
		staleTime: 60 * 1000,
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
