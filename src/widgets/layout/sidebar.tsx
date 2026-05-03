'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { UserRole } from '@/entities/user';
import { cn } from '@/shared/ui';

interface SidebarProps {
	role: UserRole;
}

interface NavigationItem {
	href: string;
	label: string;
}

const navigationByRole: Record<Exclude<UserRole, 'admin'> | 'admin', NavigationItem[]> = {
	admin: [{ href: '/professor/classrooms', label: '강의실 관리' }],
	professor: [{ href: '/professor/classrooms', label: '강의실 관리' }],
	student: [{ href: '/student/exams', label: '내 평가 목록' }],
};

export function Sidebar({ role }: SidebarProps) {
	const pathname = usePathname();
	const navigation = navigationByRole[role] ?? [];

	return (
		<aside
			className="border-border-subtle bg-surface flex min-h-screen w-20 shrink-0 flex-col self-stretch border-r
				px-3 py-6 sm:w-64 sm:px-4"
		>
			<Link
				href="/"
				className="flex items-center justify-center gap-2.5 rounded-2xl px-2 sm:justify-start sm:px-3"
			>
				<div
					className="border-brand-light bg-brand-light flex size-8 shrink-0 items-center justify-center
						rounded-full border"
				>
					<span className="text-brand-deep text-xs font-bold">D</span>
				</div>
				<div className="hidden min-w-0 sm:block">
					<p className="text-neutral-gray-500 font-mono text-xs font-semibold tracking-[0.08em] uppercase">
						Dialearn
					</p>
					<p className="text-neutral-text truncate text-sm font-semibold">
						{role === 'student' ? '학생 포털' : '교수자 포털'}
					</p>
				</div>
			</Link>

			<nav className="mt-8 flex flex-col gap-2">
				{navigation.map((item) => {
					const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

					return (
						<Link
							key={item.href}
							aria-current={isActive ? 'page' : undefined}
							className={cn(
								`focus-visible:outline-brand flex h-10 w-full items-center justify-center gap-2
								rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-2
								focus-visible:outline-offset-3 sm:justify-start`,
								isActive
									? 'bg-brand-light text-brand-deep hover:bg-brand-light'
									: 'text-neutral-gray-500 hover:bg-surface-muted hover:text-neutral-text',
							)}
							href={item.href}
						>
							<span
								className={cn(
									'size-1.5 rounded-full',
									isActive ? 'bg-brand-deep' : 'bg-border-subtle sm:bg-transparent',
								)}
							/>
							<span className="hidden truncate sm:inline">{item.label}</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
