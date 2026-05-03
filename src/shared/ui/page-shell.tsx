import type { ElementType, ReactNode } from 'react';

import { cn } from './cn';

interface PageShellProps {
	as?: ElementType;
	children: ReactNode;
	className?: string;
}

export function PageShell({ as, children, className }: PageShellProps) {
	const Component = as ?? 'section';

	return (
		<Component
			className={cn('mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-7 sm:px-6 lg:px-8 lg:py-10', className)}
		>
			{children}
		</Component>
	);
}
