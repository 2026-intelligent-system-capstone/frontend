'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import type { User } from '@/entities/user';
import { useViewer, useViewerAuthActions } from '@/entities/viewer/client';
import { Avatar, Button } from '@heroui/react';

const getInitials = (name: string) => {
	return name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
};

interface HeaderProps {
	initialUser: User;
}

export function Header({ initialUser }: HeaderProps) {
	const router = useRouter();
	const { user, userUnauthenticated } = useViewer();
	const { logout, logoutPending } = useViewerAuthActions();
	const currentUser = userUnauthenticated ? null : (user ?? initialUser);
	const shouldRedirectToLogin = userUnauthenticated;

	useEffect(() => {
		if (!shouldRedirectToLogin) {
			return;
		}

		router.replace('/login');
		router.refresh();
	}, [router, shouldRedirectToLogin]);

	if (!currentUser) {
		return null;
	}

	const initials = currentUser.name ? getInitials(currentUser.name) : 'DL';

	const handleLogout = async () => {
		try {
			await logout();
			router.replace('/login');
			router.refresh();
		} catch {
			router.refresh();
		}
	};

	return (
		<header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
			<div>
				<p className="text-sm text-slate-500">반갑습니다.</p>
				<h1 className="text-lg font-semibold text-slate-900">{currentUser.name}님</h1>
			</div>

			<div className="flex items-center gap-3">
				<div className="hidden text-right sm:block">
					<p className="text-sm font-medium text-slate-900">{currentUser.login_id}</p>
					<p className="text-xs tracking-wide text-slate-400 uppercase">{currentUser.role}</p>
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
