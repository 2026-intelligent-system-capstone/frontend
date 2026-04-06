'use client';

import { useEffect } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usersApi } from '@/entities/user';
import { apiClient } from '@/shared/api/client';
import { ApiClientError } from '@/shared/api/types';

import { useViewerStore } from './model/store';

interface LoginRequest {
	organization_code: string;
	login_id: string;
	password: string;
}

const authApi = {
	login: async (payload: LoginRequest): Promise<void> => {
		await apiClient.post<void>('/api/auth/login', payload);
	},
	logout: async (): Promise<void> => {
		await apiClient.post<void>('/api/auth/logout');
	},
};

export const VIEWER_QUERY_KEY = ['viewer', 'me'] as const;

export const useViewer = () => {
	const setViewer = useViewerStore((state) => state.setViewer);
	const setHydrated = useViewerStore((state) => state.setHydrated);
	const clearViewer = useViewerStore((state) => state.clearViewer);

	const userQuery = useQuery({
		queryKey: VIEWER_QUERY_KEY,
		queryFn: async () => {
			try {
				return await usersApi.getMe();
			} catch (error) {
				if (error instanceof ApiClientError && error.status === 401) {
					return null;
				}

				throw error;
			}
		},
		retry: false,
		staleTime: 60 * 1000,
	});

	useEffect(() => {
		if (userQuery.isSuccess) {
			setViewer(userQuery.data ?? null);
			setHydrated(true);
		}
	}, [setHydrated, setViewer, userQuery.data, userQuery.isSuccess]);

	useEffect(() => {
		if (userQuery.isError) {
			clearViewer();
			setHydrated(true);
		}
	}, [clearViewer, setHydrated, userQuery.isError]);

	const userUnauthenticated = userQuery.isSuccess && (userQuery.data ?? null) === null;

	return {
		user: userQuery.data ?? null,
		userLoading: userQuery.isLoading,
		userError: userQuery.isError,
		userUnauthenticated,
	};
};

export const useViewerAuthActions = () => {
	const queryClient = useQueryClient();
	const setViewer = useViewerStore((state) => state.setViewer);
	const setHydrated = useViewerStore((state) => state.setHydrated);
	const clearViewer = useViewerStore((state) => state.clearViewer);

	const loginMutation = useMutation({
		mutationFn: async (payload: LoginRequest) => {
			await authApi.login(payload);

			try {
				return await usersApi.getMe();
			} catch {
				return usersApi.getMe();
			}
		},
		onSuccess: async (nextUser) => {
			setViewer(nextUser);
			setHydrated(true);
			queryClient.setQueryData(VIEWER_QUERY_KEY, nextUser);
		},
	});

	const clearViewerState = () => {
		clearViewer();
		setHydrated(true);
		queryClient.setQueryData(VIEWER_QUERY_KEY, null);
	};

	const logoutMutation = useMutation({
		mutationFn: authApi.logout,
		onSuccess: clearViewerState,
		onError: async () => {
			try {
				await usersApi.getMe();
			} catch (error) {
				if (error instanceof ApiClientError && error.status === 401) {
					clearViewerState();
				}
			}
		},
	});

	return {
		login: loginMutation.mutateAsync,
		loginPending: loginMutation.isPending,
		logout: logoutMutation.mutateAsync,
		logoutPending: logoutMutation.isPending,
	};
};
