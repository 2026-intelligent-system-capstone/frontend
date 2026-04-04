import type {
	Classroom,
	CreateClassroomRequest,
	InviteClassroomStudentsRequest,
	UpdateClassroomRequest,
} from '@/types/classroom';

import { classroomMaterialsApi } from '@/lib/api/classroom-materials';
import { type ApiResponse, apiClient } from '@/lib/api/client';

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
	removeStudent: async (classroomId: string, studentId: string): Promise<Classroom> => {
		const response = await apiClient.delete<ApiResponse<Classroom>>(
			`/api/classrooms/${classroomId}/students/${studentId}`,
		);
		return response.data;
	},
	listClassrooms: async (): Promise<Classroom[]> => {
		const response = await apiClient.get<ApiResponse<Classroom[]>>('/api/classrooms');
		return response.data;
	},
	updateClassroom: async (classroomId: string, payload: UpdateClassroomRequest): Promise<Classroom> => {
		const response = await apiClient.patch<ApiResponse<Classroom>>(`/api/classrooms/${classroomId}`, payload);
		return response.data;
	},
	...classroomMaterialsApi,
};
