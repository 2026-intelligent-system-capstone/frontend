'use client';

import { Avatar, Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/lib/hooks/use-auth';

const getInitials = (name: string) => {
	return name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
};

export function Header() {
	const router = useRouter();
	const { logout, logoutPending, user } = useAuth();

	const initials = user?.name ? getInitials(user.name) : 'DL';

	const handleLogout = async () => {
		await logout();
		router.replace('/login');
		router.refresh();
	};

	return (
		<header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
			<div>
				<p className="text-sm text-slate-500">반갑습니다.</p>
				<h1 className="text-lg font-semibold text-slate-900">{user?.name ?? '사용자'}님</h1>
			</div>

			<div className="flex items-center gap-3">
				<div className="hidden text-right sm:block">
					<p className="text-sm font-medium text-slate-900">{user?.login_id ?? '-'}</p>
					<p className="text-xs uppercase tracking-wide text-slate-400">{user?.role ?? 'guest'}</p>
				</div>
				<Avatar size="sm">
					<Avatar.Fallback>{initials}</Avatar.Fallback>
				</Avatar>
				<Button isPending={logoutPending} size="sm" variant="outline" onPress={handleLogout}>
					로그아웃
				</Button>
			</div>
		</header>
	);
}
