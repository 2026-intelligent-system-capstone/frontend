import { CLASSROOMS_QUERY_KEY } from '@/entities/classroom';

export const getClassroomMaterialsQueryKey = (classroomId: string) =>
	[...CLASSROOMS_QUERY_KEY, classroomId, 'materials'] as const;

export const getClassroomMaterialDetailQueryKey = (classroomId: string, materialId: string) =>
	[...CLASSROOMS_QUERY_KEY, classroomId, 'materials', materialId] as const;
