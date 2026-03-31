'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import type { UserRole } from '@/types/auth';

interface AppShellProps {
	children: React.ReactNode;
	role: UserRole;
}

export function AppShell({ children, role }: AppShellProps) {
	return (
		<div className="flex min-h-screen bg-slate-50">
			<Sidebar role={role} />
			<div className="flex min-h-screen flex-1 flex-col">
				<Header />
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
}
