'use client';

import type { User, UserRole } from '@/entities/user';

import { Header } from './header';
import { Sidebar } from './sidebar';

interface AppShellProps {
	children: React.ReactNode;
	role: UserRole;
	currentUser: User;
}

export function AppShell({ children, role, currentUser }: AppShellProps) {
	return (
		<div className="bg-surface text-neutral-text flex min-h-screen overflow-x-hidden">
			<Sidebar role={role} />
			<div className="flex min-h-screen min-w-0 flex-1 flex-col">
				<Header initialUser={currentUser} />
				<main className="min-w-0 flex-1">{children}</main>
			</div>
		</div>
	);
}
