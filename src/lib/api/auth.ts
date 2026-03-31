import { apiClient, type ApiResponse } from '@/lib/api/client';
import type { LoginRequest } from '@/types/auth';
import type { Organization } from '@/types/organization';
import type { User } from '@/types/user';

export const authApi = {
	getOrganizations: async (): Promise<Organization[]> => {
		const response = await apiClient.get<ApiResponse<Organization[]>>('/api/organizations');
		return response.data;
	},
	login: async (payload: LoginRequest): Promise<void> => {
		await apiClient.post<void>('/api/auth/login', payload);
	},
	logout: async (): Promise<void> => {
		await apiClient.post<void>('/api/auth/logout');
	},
	refresh: async (): Promise<void> => {
		await apiClient.post<void>('/api/auth/refresh');
	},
	getCurrentUser: async (): Promise<User | null> => {
		const response = await apiClient.get<ApiResponse<User>>('/api/users/me');
		return response.data;
	},
};
