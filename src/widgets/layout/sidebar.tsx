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
			<Link href="/" className="block px-3">
				<p className="text-xs font-semibold tracking-[0.24em] text-slate-400 uppercase">Dialearn</p>
				<h2 className="mt-2 text-lg font-semibold text-slate-900">
					{role === 'student' ? '학생 포털' : '교수자 포털'}
				</h2>
			</Link>

			<nav className="mt-8 flex flex-col gap-2">
				{navigation.map((item) => {
					const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

					return (
						<Link key={item.href} href={item.href}>
							<Button className="justify-start" fullWidth variant={isActive ? 'primary' : 'ghost'}>
								{item.label}
							</Button>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
