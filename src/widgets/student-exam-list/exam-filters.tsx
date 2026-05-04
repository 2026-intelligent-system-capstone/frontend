import type { ExamStatus, ExamType } from '@/entities/exam';
import { Button } from '@heroui/react';

const STATUS_FILTERS: { label: string; value: ExamStatus | 'all' }[] = [
	{ label: '전체', value: 'all' },
	{ label: '진행 중', value: 'in_progress' },
	{ label: '준비', value: 'ready' },
	{ label: '종료', value: 'closed' },
];

const TYPE_FILTERS: { label: string; value: ExamType | 'all' }[] = [
	{ label: '전체', value: 'all' },
	{ label: '주간평가', value: 'weekly' },
	{ label: '중간평가', value: 'midterm' },
	{ label: '기말평가', value: 'final' },
	{ label: '프로젝트평가', value: 'project' },
	{ label: '모의평가', value: 'mock' },
];

interface ExamFiltersProps {
	statusFilter: ExamStatus | 'all';
	typeFilter: ExamType | 'all';
	onStatusChange: (value: ExamStatus | 'all') => void;
	onTypeChange: (value: ExamType | 'all') => void;
}

export function ExamFilters({ statusFilter, typeFilter, onStatusChange, onTypeChange }: ExamFiltersProps) {
	return (
		<section
			className="border-border-subtle bg-surface-muted flex flex-col gap-4 rounded-3xl border p-4 sm:p-5"
			aria-label="평가 필터"
		>
			<div className="flex flex-wrap items-center gap-2">
				<span className="text-neutral-gray-500 mr-1 font-mono text-xs font-semibold tracking-[0.05em] uppercase">
					상태
				</span>
				{STATUS_FILTERS.map((f) => (
					<Button
						key={f.value}
						size="sm"
						variant={statusFilter === f.value ? 'secondary' : 'outline'}
						onPress={() => onStatusChange(f.value)}
					>
						{f.label}
					</Button>
				))}
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<span className="text-neutral-gray-500 mr-1 font-mono text-xs font-semibold tracking-[0.05em] uppercase">
					유형
				</span>
				{TYPE_FILTERS.map((f) => (
					<Button
						key={f.value}
						size="sm"
						variant={typeFilter === f.value ? 'secondary' : 'outline'}
						onPress={() => onTypeChange(f.value)}
					>
						{f.label}
					</Button>
				))}
			</div>
		</section>
	);
}
