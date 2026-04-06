'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CLASSROOMS_QUERY_KEY, classroomsApi } from '@/entities/classroom';
import type { CreateClassroomRequest } from '@/entities/classroom';

export const useCreateClassroom = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateClassroomRequest) => classroomsApi.createClassroom(payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: CLASSROOMS_QUERY_KEY });
		},
	});
};
