import { apiClient, type ApiResponse } from '@/lib/api/client';
import type { Organization } from '@/types/organization';

export const organizationsApi = {
	getOrganization: async (organizationId: string): Promise<Organization> => {
		const response = await apiClient.get<ApiResponse<Organization>>(`/api/organizations/${organizationId}`);
		return response.data;
	},
	listOrganizations: async (): Promise<Organization[]> => {
		const response = await apiClient.get<ApiResponse<Organization[]>>('/api/organizations');
		return response.data;
	},
};
