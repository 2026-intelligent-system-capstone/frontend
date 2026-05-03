import { getBloomLevelLabel } from '@/entities/exam';
import type { BloomLevel } from '@/entities/exam';
import { cn } from '@/shared/ui';

const BLOOM_ORDER: BloomLevel[] = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

interface BloomBarProps {
	level: BloomLevel | null;
}

export function BloomBar({ level }: BloomBarProps) {
	const index = level ? BLOOM_ORDER.indexOf(level) + 1 : 0;

	return (
		<div
			aria-label={level ? `Bloom 단계: ${getBloomLevelLabel(level)}` : 'Bloom 단계 평가 불가'}
			className="flex items-center gap-3"
		>
			<div aria-hidden="true" className="flex flex-1 gap-1">
				{BLOOM_ORDER.map((bloomLevel, i) => (
					<div
						key={bloomLevel}
						className={cn(
							'h-2 flex-1 rounded-full transition-colors',
							i < index ? 'bg-brand-deep' : 'bg-surface-muted ring-border-subtle ring-1',
						)}
					/>
				))}
			</div>
			<span className="text-neutral-gray-500 w-16 text-right text-xs font-medium">
				{level ? getBloomLevelLabel(level) : '미평가'}
			</span>
		</div>
	);
}
