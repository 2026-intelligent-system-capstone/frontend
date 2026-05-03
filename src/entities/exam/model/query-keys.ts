export const CLASSROOM_EXAMS_QUERY_KEY = ['classrooms'] as const;
export const STUDENT_EXAMS_QUERY_KEY = ['student', 'exams'] as const;

export const getClassroomExamsQueryKey = (classroomId: string) =>
	[...CLASSROOM_EXAMS_QUERY_KEY, classroomId, 'exams'] as const;

export const getClassroomExamDetailQueryKey = (classroomId: string, examId: string) =>
	[...CLASSROOM_EXAMS_QUERY_KEY, classroomId, 'exams', examId] as const;

export const getStudentExamsQueryKey = () => STUDENT_EXAMS_QUERY_KEY;

export const getStudentExamDetailQueryKey = (examId: string) => [...STUDENT_EXAMS_QUERY_KEY, examId] as const;

export const getStudentExamSessionSheetQueryKey = (examId: string) =>
	[...STUDENT_EXAMS_QUERY_KEY, examId, 'session-sheet'] as const;

export const getStudentExamSessionResultQueryKey = (examId: string, sessionId: string) =>
	[...STUDENT_EXAMS_QUERY_KEY, examId, 'sessions', sessionId, 'result'] as const;

export const getStudentExamResultsQueryKey = (examId: string) =>
	[...STUDENT_EXAMS_QUERY_KEY, examId, 'results', 'me'] as const;
