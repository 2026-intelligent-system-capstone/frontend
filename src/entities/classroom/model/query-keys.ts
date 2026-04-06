export const CLASSROOMS_QUERY_KEY = ['classrooms'] as const;

export const getClassroomDetailQueryKey = (classroomId: string) =>
	[...CLASSROOMS_QUERY_KEY, classroomId, 'detail'] as const;
