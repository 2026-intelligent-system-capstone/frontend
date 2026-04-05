import type { BloomLevel } from '@/types/exam';

import { bloomLevelOptions } from '@/lib/classrooms/exam-presentation';

export const bloomPyramidPreviewLevels = [...bloomLevelOptions].reverse();

export const bloomPyramidWidthClassNames: Record<BloomLevel, string> = {
	create: 'w-4/12',
	evaluate: 'w-5/12',
	analyze: 'w-6/12',
	apply: 'w-8/12',
	understand: 'w-10/12',
	remember: 'w-full',
};

export const bloomPyramidToneClassNames: Record<BloomLevel, string> = {
	create: 'bg-violet-100 text-violet-900',
	evaluate: 'bg-rose-100 text-rose-900',
	analyze: 'bg-amber-100 text-amber-900',
	apply: 'bg-emerald-100 text-emerald-900',
	understand: 'bg-sky-100 text-sky-900',
	remember: 'bg-slate-200 text-slate-800',
};

export const getDisplayCountValue = (value: string) => {
	const parsedValue = Number(value);

	return Number.isFinite(parsedValue) ? parsedValue : 0;
};
