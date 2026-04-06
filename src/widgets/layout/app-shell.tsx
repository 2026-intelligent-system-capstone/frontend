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
		<div className="flex min-h-screen bg-slate-50">
			<Sidebar role={role} />
			<div className="flex min-h-screen flex-1 flex-col">
				<Header initialUser={currentUser} />
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
}
