import type { ComponentPropsWithoutRef } from 'react';

import Link from 'next/link';

import { cn } from './cn';

type LinkButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type LinkButtonSize = 'sm' | 'md';

interface LinkButtonProps extends ComponentPropsWithoutRef<typeof Link> {
	variant?: LinkButtonVariant;
	size?: LinkButtonSize;
	isDisabled?: boolean;
}

const variantClassName: Record<LinkButtonVariant, string> = {
	primary: 'bg-neutral-text text-white shadow-button hover:opacity-90',
	secondary:
		'border border-border-subtle bg-surface text-neutral-text hover:border-border-medium hover:bg-surface-muted',
	outline:
		'border border-border-subtle bg-surface text-neutral-gray-700 hover:border-border-medium hover:text-neutral-text',
	ghost: 'text-neutral-gray-500 hover:bg-surface-muted hover:text-neutral-text',
};

const sizeClassName: Record<LinkButtonSize, string> = {
	sm: 'px-4 py-1.5 text-sm',
	md: 'px-5 py-2 text-sm',
};

export function LinkButton({
	children,
	className,
	variant = 'primary',
	size = 'md',
	isDisabled = false,
	...props
}: LinkButtonProps) {
	return (
		<Link
			aria-disabled={isDisabled || undefined}
			className={cn(
				`focus-visible:outline-brand inline-flex items-center justify-center gap-2 rounded-full font-medium
				transition-colors focus-visible:outline-2 focus-visible:outline-offset-3`,
				variantClassName[variant],
				sizeClassName[size],
				isDisabled && 'pointer-events-none opacity-60',
				className,
			)}
			{...props}
		>
			{children}
		</Link>
	);
}
