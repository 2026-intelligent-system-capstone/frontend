import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type ApiResponse, apiClient } from '@/shared/api/client';

import { CLASSROOMS_QUERY_KEY, getClassroomDetailQueryKey } from '../model/query-keys';
import type {
	Classroom,
	CreateClassroomRequest,
	InviteClassroomStudentsRequest,
	UpdateClassroomRequest,
} from '../model/types';

export const classroomsApi = {
	createClassroom: async (payload: CreateClassroomRequest): Promise<Classroom> => {
		const response = await apiClient.post<ApiResponse<Classroom>>('/api/classrooms', payload);
		return response.data;
	},
	deleteClassroom: async (classroomId: string): Promise<Classroom> => {
		const response = await apiClient.delete<ApiResponse<Classroom>>(`/api/classrooms/${classroomId}`);
		return response.data;
	},
	getClassroom: async (classroomId: string): Promise<Classroom> => {
		const response = await apiClient.get<ApiResponse<Classroom>>(`/api/classrooms/${classroomId}`);
		return response.data;
	},
	inviteStudents: async (classroomId: string, payload: InviteClassroomStudentsRequest): Promise<Classroom> => {
		const response = await apiClient.post<ApiResponse<Classroom>>(
			`/api/classrooms/${classroomId}/students`,
			payload,
		);
		return response.data;
	},
	listClassrooms: async (): Promise<Classroom[]> => {
		const response = await apiClient.get<ApiResponse<Classroom[]>>('/api/classrooms');
		return response.data;
	},
	removeStudent: async (classroomId: string, studentId: string): Promise<Classroom> => {
		const response = await apiClient.delete<ApiResponse<Classroom>>(
			`/api/classrooms/${classroomId}/students/${studentId}`,
		);
		return response.data;
	},
	updateClassroom: async (classroomId: string, payload: UpdateClassroomRequest): Promise<Classroom> => {
		const response = await apiClient.patch<ApiResponse<Classroom>>(`/api/classrooms/${classroomId}`, payload);
		return response.data;
	},
};

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
		queryKey: getClassroomDetailQueryKey(classroomId),
		queryFn: () => classroomsApi.getClassroom(classroomId),
		enabled: Boolean(classroomId),
		initialData,
		staleTime: 60 * 1000,
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
