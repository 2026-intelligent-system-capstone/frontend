'use client';

export {
	useClassroomDetail,
	useClassroomMaterial,
	useClassroomMaterials,
	useClassrooms,
} from '@/lib/hooks/classrooms/use-classroom-queries';
export {
	useCreateClassroom,
	useCreateClassroomMaterial,
	useDeleteClassroomMaterial,
	useInviteClassroomStudents,
	useReingestClassroomMaterial,
	useRemoveClassroomStudent,
} from '@/lib/hooks/classrooms/use-classroom-mutations';
export {
	useClassroomExam,
	useClassroomExams,
	useCreateExam,
	useCreateExamQuestion,
	useDeleteExamQuestion,
	useGenerateExamQuestions,
	useUpdateExamQuestion,
} from '@/lib/hooks/classrooms/use-exam-hooks';
export { useUsers } from '@/lib/hooks/classrooms/use-user-hooks';
export { CLASSROOMS_QUERY_KEY, CLASSROOM_USERS_QUERY_KEY } from '@/lib/hooks/classroom-query-keys';
