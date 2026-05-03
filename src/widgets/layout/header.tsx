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
	const currentUser = userUnauthenticated ? initialUser : (user ?? initialUser);
	const shouldRedirectToLogin = userUnauthenticated && !initialUser;

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
		<header
			className="border-border-subtle bg-surface flex items-center justify-between gap-4 border-b px-4 py-4
				sm:px-6"
		>
			<div className="min-w-0">
				<p className="text-neutral-gray-500 text-sm">반갑습니다.</p>
				<h1 className="text-neutral-text truncate text-lg font-semibold tracking-[-0.01em]">
					{currentUser.name}님
				</h1>
			</div>

			<div
				className="border-border-subtle bg-surface-muted flex min-w-0 items-center gap-3 rounded-full border
					px-2 py-1.5 sm:px-3"
			>
				<div className="hidden min-w-0 text-right sm:block">
					<p className="text-neutral-text truncate text-sm font-medium">{currentUser.login_id}</p>
					<p className="text-neutral-gray-500 font-mono text-xs font-semibold tracking-[0.08em] uppercase">
						{currentUser.role}
					</p>
				</div>
				<Avatar className="border-border-subtle bg-surface text-brand-deep border" size="sm">
					<Avatar.Fallback>{initials}</Avatar.Fallback>
				</Avatar>
				<Button
					className="border-border-subtle bg-surface text-neutral-gray-700 hover:text-neutral-text
						rounded-full px-4"
					isPending={logoutPending}
					size="sm"
					variant="outline"
					onPress={handleLogout}
				>
					로그아웃
				</Button>
			</div>
		</header>
	);
}
