import { apiClient, type ApiResponse } from '@/lib/api/client';
import type { User } from '@/types/user';

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
