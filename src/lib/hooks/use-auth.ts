'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import type { LoginRequest } from '@/types/auth';
import type { User } from '@/types/user';

const AUTH_USER_QUERY_KEY = ['auth', 'user'] as const;

export const useAuth = () => {
	const queryClient = useQueryClient();
	const setAuth = useAuthStore((state) => state.setAuth);
	const setHydrated = useAuthStore((state) => state.setHydrated);
	const clearAuth = useAuthStore((state) => state.clearAuth);

	const userQuery = useQuery<User | null>({
		queryKey: AUTH_USER_QUERY_KEY,
		queryFn: async () => {
			try {
				return await authApi.getCurrentUser();
			} catch {
				return null;
			}
		},
		retry: false,
		staleTime: 60 * 1000,
	});

	useEffect(() => {
		if (userQuery.isSuccess) {
			setAuth(userQuery.data);
			setHydrated(true);
		}
	}, [setAuth, setHydrated, userQuery.data, userQuery.isSuccess]);

	useEffect(() => {
		if (userQuery.isError) {
			clearAuth();
			setHydrated(true);
		}
	}, [clearAuth, setHydrated, userQuery.isError]);

	const loginMutation = useMutation({
		mutationFn: async (payload: LoginRequest) => {
			await authApi.login(payload);
			return authApi.getCurrentUser();
		},
		onSuccess: async (nextUser) => {
			setAuth(nextUser);
			setHydrated(true);
			queryClient.setQueryData(AUTH_USER_QUERY_KEY, nextUser);
		},
	});

	const logoutMutation = useMutation({
		mutationFn: authApi.logout,
		onSettled: async () => {
			clearAuth();
			setHydrated(true);
			queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
		},
	});

	return {
		login: loginMutation.mutateAsync,
		logout: logoutMutation.mutateAsync,
		loginPending: loginMutation.isPending,
		logoutPending: logoutMutation.isPending,
		user: userQuery.data ?? null,
		userLoading: userQuery.isLoading,
	};
};

export { AUTH_USER_QUERY_KEY };
