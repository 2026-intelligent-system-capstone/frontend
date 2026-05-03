import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Query } from '@tanstack/react-query';

import { getClassroomDetailQueryKey } from '@/entities/classroom';
import {
	getClassroomMaterialDetailQueryKey,
	getClassroomMaterialsQueryKey,
} from '@/entities/classroom-material/model/query-keys';
import type {
	ClassroomMaterial,
	CreateClassroomMaterialRequest,
	UpdateClassroomMaterialRequest,
} from '@/entities/classroom-material/model/types';
import { type ApiResponse, apiClient, buildApiUrl } from '@/shared/api/client';

const toMaterialFormData = (payload: CreateClassroomMaterialRequest | UpdateClassroomMaterialRequest): FormData => {
	const formData = new FormData();

	if (payload.title !== undefined) {
		formData.set('title', payload.title);
	}
	if (payload.week !== undefined) {
		formData.set('week', String(payload.week));
	}
	if ('description' in payload) {
		if (payload.description !== undefined && payload.description !== null && payload.description !== '') {
			formData.set('description', payload.description);
		}
		if (payload.description === null) {
			formData.set('description', '');
		}
	}
	if (payload.source_kind !== undefined) {
		formData.set('source_kind', payload.source_kind);
	}
	if ('uploaded_file' in payload && payload.uploaded_file) {
		formData.set('uploaded_file', payload.uploaded_file);
	}
	if ('source_url' in payload && payload.source_url) {
		formData.set('source_url', payload.source_url);
	}

	return formData;
};

const MATERIALS_POLL_INTERVAL_MS = 2_000;

const hasPendingMaterials = (materials: ClassroomMaterial[] | undefined): boolean => {
	return (materials ?? []).some((material) => material.ingest_status === 'pending');
};

const getMaterialsRefetchInterval = (query: Query<ClassroomMaterial[]>): number | false => {
	if (query.state.error) {
		return false;
	}

	return hasPendingMaterials(query.state.data) ? MATERIALS_POLL_INTERVAL_MS : false;
};

const getMaterialRefetchInterval = (query: Query<ClassroomMaterial>): number | false => {
	if (query.state.error) {
		return false;
	}

	return query.state.data?.ingest_status === 'pending' ? MATERIALS_POLL_INTERVAL_MS : false;
};

export const classroomMaterialsApi = {
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
	deleteMaterial: async (classroomId: string, materialId: string): Promise<ClassroomMaterial> => {
		const response = await apiClient.delete<ApiResponse<ClassroomMaterial>>(
			`/api/classrooms/${classroomId}/materials/${materialId}`,
		);
		return response.data;
	},
	getMaterial: async (classroomId: string, materialId: string): Promise<ClassroomMaterial> => {
		const response = await apiClient.get<ApiResponse<ClassroomMaterial>>(
			`/api/classrooms/${classroomId}/materials/${materialId}`,
		);
		return response.data;
	},
	getMaterialDownloadUrl: (classroomId: string, materialId: string): string => {
		return buildApiUrl(`/api/classrooms/${classroomId}/materials/${materialId}/download`);
	},
	listMaterials: async (classroomId: string): Promise<ClassroomMaterial[]> => {
		const response = await apiClient.get<ApiResponse<ClassroomMaterial[]>>(
			`/api/classrooms/${classroomId}/materials`,
		);
		return response.data;
	},
	reingestMaterial: async (classroomId: string, materialId: string): Promise<ClassroomMaterial> => {
		const response = await apiClient.post<ApiResponse<ClassroomMaterial>>(
			`/api/classrooms/${classroomId}/materials/${materialId}/reingest`,
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
};

export const useClassroomMaterials = (
	classroomId: string,
	initialData?: Awaited<ReturnType<typeof classroomMaterialsApi.listMaterials>>,
) => {
	return useQuery({
		queryKey: getClassroomMaterialsQueryKey(classroomId),
		queryFn: () => classroomMaterialsApi.listMaterials(classroomId),
		enabled: Boolean(classroomId),
		initialData,
		refetchInterval: getMaterialsRefetchInterval,
		staleTime: 60 * 1000,
	});
};

export const useClassroomMaterial = (
	classroomId: string,
	materialId: string,
	initialData?: Awaited<ReturnType<typeof classroomMaterialsApi.getMaterial>>,
) => {
	return useQuery({
		queryKey: getClassroomMaterialDetailQueryKey(classroomId, materialId),
		queryFn: () => classroomMaterialsApi.getMaterial(classroomId, materialId),
		enabled: Boolean(classroomId && materialId),
		initialData,
		refetchInterval: getMaterialRefetchInterval,
		staleTime: 60 * 1000,
	});
};

export const useCreateClassroomMaterial = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateClassroomMaterialRequest) =>
			classroomMaterialsApi.createMaterial(classroomId, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getClassroomMaterialsQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: getClassroomDetailQueryKey(classroomId) });
		},
	});
};

export const useDeleteClassroomMaterial = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (materialId: string) => classroomMaterialsApi.deleteMaterial(classroomId, materialId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getClassroomMaterialsQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: getClassroomDetailQueryKey(classroomId) });
		},
	});
};

export const useReingestClassroomMaterial = (classroomId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (materialId: string) => classroomMaterialsApi.reingestMaterial(classroomId, materialId),
		onSuccess: async (_material, materialId) => {
			await queryClient.invalidateQueries({ queryKey: getClassroomMaterialsQueryKey(classroomId) });
			await queryClient.invalidateQueries({ queryKey: getClassroomDetailQueryKey(classroomId) });
			await queryClient.invalidateQueries({
				queryKey: getClassroomMaterialDetailQueryKey(classroomId, materialId),
			});
		},
	});
};
