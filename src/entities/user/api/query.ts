import { useQuery } from '@tanstack/react-query';

import { type ApiResponse, apiClient } from '@/shared/api/client';

import { USERS_QUERY_KEY } from '../model/query-keys';
import type { User } from '../model/types';

export const usersApi = {
	getMe: async (): Promise<User> => {
		const response = await apiClient.get<ApiResponse<User>>('/api/users/me');
		return response.data;
	},
	getUser: async (userId: string): Promise<User> => {
		const response = await apiClient.get<ApiResponse<User>>(`/api/users/${userId}`);
		return response.data;
	},
	listUsers: async (): Promise<User[]> => {
		const response = await apiClient.get<ApiResponse<User[]>>('/api/users');
		return response.data;
	},
};

export const useUsers = (initialData?: Awaited<ReturnType<typeof usersApi.listUsers>>) => {
	return useQuery({
		queryKey: USERS_QUERY_KEY,
		queryFn: usersApi.listUsers,
		initialData,
		staleTime: 60 * 1000,
	});
};
