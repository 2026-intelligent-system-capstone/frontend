'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { classroomsApi } from '@/lib/api/classrooms';
import { examsApi } from '@/lib/api/exams';
import { usersApi } from '@/lib/api/users';
import type { CreateClassroomRequest } from '@/types/classroom';

const CLASSROOMS_QUERY_KEY = ['classrooms'] as const;
const CLASSROOM_USERS_QUERY_KEY = ['users'] as const;

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
		queryKey: [...CLASSROOMS_QUERY_KEY, classroomId, 'materials'] as const,
		queryFn: () => classroomsApi.listMaterials(classroomId),
		enabled: Boolean(classroomId),
		staleTime: 60 * 1000,
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

export { CLASSROOMS_QUERY_KEY, CLASSROOM_USERS_QUERY_KEY };
