'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { classroomsApi } from '@/lib/api/classrooms';
import type { CreateClassroomRequest } from '@/types/classroom';

const CLASSROOMS_QUERY_KEY = ['classrooms'] as const;

export const useClassrooms = () => {
	return useQuery({
		queryKey: CLASSROOMS_QUERY_KEY,
		queryFn: classroomsApi.listClassrooms,
		staleTime: 60 * 1000,
	});
};

export const useCreateClassroom = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateClassroomRequest) => classroomsApi.createClassroom(payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: CLASSROOMS_QUERY_KEY });
		},
	});
};

export { CLASSROOMS_QUERY_KEY };
