'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { UserRole } from '@/entities/user';
import { Button } from '@heroui/react';

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
			className="flex min-h-screen w-full max-w-72 flex-col self-stretch border-r border-slate-200 bg-white px-4
				py-6"
		>
			<Link href="/" className="flex items-center gap-2.5 px-3">
				<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600">
					<span className="text-xs font-bold text-white">D</span>
				</div>
				<div>
					<p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Dialearn</p>
					<p className="text-sm font-semibold text-slate-900">
						{role === 'student' ? '학생 포털' : '교수자 포털'}
					</p>
				</div>
			</Link>

			<nav className="mt-8 flex flex-col gap-1">
				{navigation.map((item) => {
					const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

					return (
						<Link key={item.href} href={item.href}>
							<Button
								className={`justify-start rounded-lg ${isActive ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : ''}`}
								fullWidth
								variant={isActive ? 'ghost' : 'ghost'}
							>
								{isActive && <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />}
								{item.label}
							</Button>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
