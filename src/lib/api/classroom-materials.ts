import type {
	ClassroomMaterial,
	CreateClassroomMaterialRequest,
	UpdateClassroomMaterialRequest,
} from '@/types/classroom';

import { type ApiResponse, apiClient } from '@/lib/api/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

const toMaterialFormData = (payload: CreateClassroomMaterialRequest | UpdateClassroomMaterialRequest): FormData => {
	const formData = new FormData();

	if (payload.title !== undefined) {
		formData.set('title', payload.title);
	}
	if (payload.week !== undefined) {
		formData.set('week', String(payload.week));
	}
	if (payload.description !== undefined && payload.description !== null && payload.description !== '') {
		formData.set('description', payload.description);
	}
	if (payload.description === null) {
		formData.set('description', '');
	}
	if (payload.uploaded_file) {
		formData.set('uploaded_file', payload.uploaded_file);
	}

	return formData;
};

export const classroomMaterialsApi = {
	listMaterials: async (classroomId: string): Promise<ClassroomMaterial[]> => {
		const response = await apiClient.get<ApiResponse<ClassroomMaterial[]>>(
			`/api/classrooms/${classroomId}/materials`,
		);
		return response.data;
	},
	getMaterial: async (classroomId: string, materialId: string): Promise<ClassroomMaterial> => {
		const response = await apiClient.get<ApiResponse<ClassroomMaterial>>(
			`/api/classrooms/${classroomId}/materials/${materialId}`,
		);
		return response.data;
	},
	createMaterial: async (
		classroomId: string,
		payload: CreateClassroomMaterialRequest,
	): Promise<ClassroomMaterial> => {
		const response = await apiClient.post<ApiResponse<ClassroomMaterial>>(
			`/api/classrooms/${classroomId}/materials`,
			toMaterialFormData(payload),
		);
		return response.data;
	},
	updateMaterial: async (
		classroomId: string,
		materialId: string,
		payload: UpdateClassroomMaterialRequest,
	): Promise<ClassroomMaterial> => {
		const response = await apiClient.patch<ApiResponse<ClassroomMaterial>>(
			`/api/classrooms/${classroomId}/materials/${materialId}`,
			toMaterialFormData(payload),
		);
		return response.data;
	},
	deleteMaterial: async (classroomId: string, materialId: string): Promise<ClassroomMaterial> => {
		const response = await apiClient.delete<ApiResponse<ClassroomMaterial>>(
			`/api/classrooms/${classroomId}/materials/${materialId}`,
		);
		return response.data;
	},
	reingestMaterial: async (classroomId: string, materialId: string): Promise<ClassroomMaterial> => {
		const response = await apiClient.post<ApiResponse<ClassroomMaterial>>(
			`/api/classrooms/${classroomId}/materials/${materialId}/reingest`,
		);
		return response.data;
	},
	getMaterialDownloadUrl: (classroomId: string, materialId: string): string => {
		return `${API_BASE_URL}/api/classrooms/${classroomId}/materials/${materialId}/download`;
	},
};
