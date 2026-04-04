export const CLASSROOMS_QUERY_KEY = ['classrooms'] as const;
export const CLASSROOM_USERS_QUERY_KEY = ['users'] as const;

export const getClassroomDetailQueryKey = (classroomId: string) =>
	[...CLASSROOMS_QUERY_KEY, classroomId, 'detail'] as const;

export const getClassroomMaterialsQueryKey = (classroomId: string) =>
	[...CLASSROOMS_QUERY_KEY, classroomId, 'materials'] as const;

export const getClassroomMaterialDetailQueryKey = (classroomId: string, materialId: string) =>
	[...CLASSROOMS_QUERY_KEY, classroomId, 'materials', materialId] as const;

export const getClassroomExamsQueryKey = (classroomId: string) =>
	[...CLASSROOMS_QUERY_KEY, classroomId, 'exams'] as const;

export const getClassroomExamDetailQueryKey = (classroomId: string, examId: string) =>
	[...CLASSROOMS_QUERY_KEY, classroomId, 'exams', examId] as const;
