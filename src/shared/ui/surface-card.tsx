import type { ComponentPropsWithoutRef } from 'react';

import { Card } from '@heroui/react';

import { cn } from './cn';

type SurfaceCardProps = ComponentPropsWithoutRef<typeof Card>;

export function SurfaceCard({ children, className, ...props }: SurfaceCardProps) {
	return (
		<Card
			className={cn(
				`border-border-subtle bg-surface-raised text-neutral-text shadow-card focus-within:border-border-medium
				hover:border-border-medium rounded-3xl border p-6 transition-colors sm:p-8`,
				className,
			)}
			{...props}
		>
			{children}
		</Card>
	);
}
