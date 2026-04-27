import { getBloomLevelLabel } from '@/entities/exam';
import type { BloomLevel } from '@/entities/exam';

const BLOOM_ORDER: BloomLevel[] = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

interface BloomBarProps {
	level: BloomLevel | null;
}

export function BloomBar({ level }: BloomBarProps) {
	const index = level ? BLOOM_ORDER.indexOf(level) + 1 : 0;

	return (
		<div className="flex items-center gap-2">
			<div className="flex flex-1 gap-0.5">
				{BLOOM_ORDER.map((l, i) => (
					<div
						key={l}
						className={`h-2 flex-1 rounded-full transition-all ${i < index ? 'bg-emerald-500' : 'bg-slate-200'}`}
					/>
				))}
			</div>
			<span className="w-16 text-right text-xs text-slate-500">
				{level ? getBloomLevelLabel(level) : '미평가'}
			</span>
		</div>
	);
}
