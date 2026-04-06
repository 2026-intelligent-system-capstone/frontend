export const CLASSROOM_EXAMS_QUERY_KEY = ['classrooms'] as const;

export const getClassroomExamsQueryKey = (classroomId: string) =>
	[...CLASSROOM_EXAMS_QUERY_KEY, classroomId, 'exams'] as const;

export const getClassroomExamDetailQueryKey = (classroomId: string, examId: string) =>
	[...CLASSROOM_EXAMS_QUERY_KEY, classroomId, 'exams', examId] as const;
