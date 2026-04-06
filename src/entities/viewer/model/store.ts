'use client';

import type { User, UserRole } from '@/entities/user';
import { create } from 'zustand';

interface ViewerState {
	isAuthenticated: boolean;
	isHydrated: boolean;
	role: UserRole | null;
	user: User | null;
	clearViewer: () => void;
	setHydrated: (value: boolean) => void;
	setViewer: (user: User | null) => void;
}

export const useViewerStore = create<ViewerState>()((set) => ({
	isAuthenticated: false,
	isHydrated: false,
	role: null,
	user: null,
	clearViewer: () =>
		set({
			isAuthenticated: false,
			role: null,
			user: null,
		}),
	setHydrated: (value) => set({ isHydrated: value }),
	setViewer: (user) =>
		set({
			isAuthenticated: user !== null,
			role: user?.role ?? null,
			user,
		}),
}));
