'use client';

import { create } from 'zustand';

import type { AuthenticatedUser, UserRole } from '@/types/auth';

interface AuthState {
	isAuthenticated: boolean;
	isHydrated: boolean;
	role: UserRole | null;
	user: AuthenticatedUser | null;
	clearAuth: () => void;
	setAuth: (user: AuthenticatedUser | null) => void;
	setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
	isAuthenticated: false,
	isHydrated: false,
	role: null,
	user: null,
	clearAuth: () =>
		set({
			isAuthenticated: false,
			role: null,
			user: null,
		}),
	setAuth: (user) =>
		set({
			isAuthenticated: user !== null,
			role: user?.role ?? null,
			user,
		}),
	setHydrated: (value) => set({ isHydrated: value }),
}));
