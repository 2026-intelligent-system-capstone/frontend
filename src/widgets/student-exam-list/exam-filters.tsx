import { Button } from '@heroui/react';
import type { ExamStatus, ExamType } from '@/entities/exam';

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
		<div className="flex flex-wrap gap-6">
			<div className="flex flex-wrap items-center gap-2">
				<span className="text-xs font-medium text-slate-500">상태</span>
				{STATUS_FILTERS.map((f) => (
					<Button
						key={f.value}
						size="sm"
						variant={statusFilter === f.value ? 'primary' : 'outline'}
						onPress={() => onStatusChange(f.value)}
					>
						{f.label}
					</Button>
				))}
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<span className="text-xs font-medium text-slate-500">유형</span>
				{TYPE_FILTERS.map((f) => (
					<Button
						key={f.value}
						size="sm"
						variant={typeFilter === f.value ? 'primary' : 'outline'}
						onPress={() => onTypeChange(f.value)}
					>
						{f.label}
					</Button>
				))}
			</div>
		</div>
	);
}
