import type { ReactNode } from 'react';

import { cn } from './cn';

interface PageHeaderProps {
	eyebrow?: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
	className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
	return (
		<header
			className={cn(
				'border-border-subtle flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-end lg:justify-between',
				className,
			)}
		>
			<div className="max-w-3xl space-y-4">
				{eyebrow ? (
					<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.05em] uppercase">
						{eyebrow}
					</p>
				) : null}
				<div className="space-y-3">
					<h1
						className="text-neutral-text text-3xl leading-tight font-semibold tracking-[-0.02em] sm:text-4xl
							md:text-5xl"
					>
						{title}
					</h1>
					{description ? (
						<p className="text-neutral-gray-500 max-w-2xl text-base leading-7 md:text-lg">{description}</p>
					) : null}
				</div>
			</div>
			{actions ? (
				<div className="flex flex-wrap items-center gap-3 self-start lg:justify-end lg:self-auto">
					{actions}
				</div>
			) : null}
		</header>
	);
}
