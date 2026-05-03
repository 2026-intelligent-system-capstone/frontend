import type { ReactNode } from 'react';

import { cn } from './cn';

type StateBlockTone = 'loading' | 'empty' | 'error' | 'disabled';

interface StateBlockProps {
	icon?: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
	tone?: StateBlockTone;
	className?: string;
}

const toneClassName: Record<StateBlockTone, string> = {
	loading: 'border-border-subtle bg-surface-muted text-neutral-gray-500',
	empty: 'border-border-subtle bg-surface text-neutral-gray-500',
	error: 'border-red-200 bg-red-50 text-red-700',
	disabled: 'border-border-subtle bg-surface-muted text-neutral-gray-400',
};

export function StateBlock({ icon, title, description, action, tone = 'empty', className }: StateBlockProps) {
	return (
		<section
			aria-live={tone === 'loading' || tone === 'error' ? 'polite' : undefined}
			className={cn(
				'flex flex-col items-center justify-center rounded-3xl border px-6 py-12 text-center',
				toneClassName[tone],
				className,
			)}
		>
			{icon ? (
				<div
					className="bg-brand-light text-brand-deep mb-4 flex size-12 items-center justify-center
						rounded-full"
				>
					{icon}
				</div>
			) : null}
			<div className="space-y-2">
				<h2 className="text-neutral-text text-xl leading-tight font-semibold tracking-[-0.01em]">{title}</h2>
				{description ? <p className="mx-auto max-w-md text-sm leading-6 text-current">{description}</p> : null}
			</div>
			{action ? <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{action}</div> : null}
		</section>
	);
}
