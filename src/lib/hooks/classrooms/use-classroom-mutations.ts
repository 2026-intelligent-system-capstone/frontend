import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
	CreateClassroomMaterialRequest,
	CreateClassroomRequest,
	InviteClassroomStudentsRequest,
} from '@/types/classroom';

import { classroomsApi } from '@/lib/api/classrooms';
import {
	CLASSROOMS_QUERY_KEY,
	getClassroomDetailQueryKey,
	getClassroomMaterialDetailQueryKey,
	getClassroomMaterialsQueryKey,
} from '@/lib/hooks/classroom-query-keys';

export const useCreateClassroomMaterial = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateClassroomMaterialRequest) => classroomsApi.createMaterial(classroomId, payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: getClassroomMaterialsQueryKey(classroomId) });
			void queryClient.invalidateQueries({ queryKey: getClassroomDetailQueryKey(classroomId) });
		},
	});
};

export const useDeleteClassroomMaterial = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (materialId: string) => classroomsApi.deleteMaterial(classroomId, materialId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getClassroomMaterialsQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: getClassroomDetailQueryKey(classroomId) });
		},
	});
};

export const useReingestClassroomMaterial = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (materialId: string) => classroomsApi.reingestMaterial(classroomId, materialId),
		onSuccess: async (_material, materialId) => {
			await queryClient.invalidateQueries({ queryKey: getClassroomMaterialsQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: getClassroomDetailQueryKey(classroomId) });
			await queryClient.invalidateQueries({
				queryKey: getClassroomMaterialDetailQueryKey(classroomId, materialId),
			});
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
			await queryClient.invalidateQueries({ queryKey: getClassroomDetailQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: CLASSROOMS_QUERY_KEY });
		},
	});
};

export const useRemoveClassroomStudent = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (studentId: string) => classroomsApi.removeStudent(classroomId, studentId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getClassroomDetailQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: CLASSROOMS_QUERY_KEY });
		},
	});
};
