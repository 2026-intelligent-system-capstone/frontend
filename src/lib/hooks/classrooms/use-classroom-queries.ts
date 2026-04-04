import { useQuery } from '@tanstack/react-query';

import { classroomsApi } from '@/lib/api/classrooms';
import {
	CLASSROOMS_QUERY_KEY,
	getClassroomDetailQueryKey,
	getClassroomMaterialDetailQueryKey,
	getClassroomMaterialsQueryKey,
} from '@/lib/hooks/classroom-query-keys';

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

export const useClassroomMaterial = (
	classroomId: string,
	materialId: string,
	initialData?: Awaited<ReturnType<typeof classroomsApi.getMaterial>>,
) => {
	return useQuery({
		queryKey: getClassroomMaterialDetailQueryKey(classroomId, materialId),
		queryFn: () => classroomsApi.getMaterial(classroomId, materialId),
		enabled: Boolean(classroomId && materialId),
		initialData,
		staleTime: 60 * 1000,
	});
};
