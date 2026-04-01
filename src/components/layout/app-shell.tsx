'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import type { UserRole } from '@/types/auth';
import type { User } from '@/types/user';

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
