import { type ApiResponse, apiClient } from '@/shared/api/client';

import type { Organization } from '../model/types';

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
