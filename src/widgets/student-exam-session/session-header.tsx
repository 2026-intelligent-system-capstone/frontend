import { getBloomLevelColor, getBloomLevelLabel } from '@/entities/exam';
import type { BloomLevel } from '@/entities/exam';
import { cn } from '@/shared/ui';
import { Button, Chip } from '@heroui/react';

function formatTime(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface SessionHeaderProps {
	examTitle: string;
	bloomLevel: BloomLevel;
	questionNumber: number;
	totalQuestions: number;
	answeredCount: number;
	remainingSeconds: number;
	isFinished: boolean;
	showConversationTree: boolean;
	onEndExam: () => void;
	onToggleConversationTree: () => void;
}

export function SessionHeader({
	examTitle,
	bloomLevel,
	questionNumber,
	totalQuestions,
	answeredCount,
	remainingSeconds,
	isFinished,
	showConversationTree,
	onEndExam,
	onToggleConversationTree,
}: SessionHeaderProps) {
	const isWarning = remainingSeconds < 5 * 60;
	const formattedRemainingTime = formatTime(remainingSeconds);

	return (
		<div
			className="border-border-subtle bg-surface/95 shadow-card sticky top-0 z-30 border-b px-4 py-3
				backdrop-blur-md sm:px-6"
		>
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="min-w-0 space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-neutral-text truncate text-sm font-semibold sm:text-base">
							{examTitle}
						</span>
						<Chip color={getBloomLevelColor(bloomLevel)} size="sm" variant="soft">
							<Chip.Label>{getBloomLevelLabel(bloomLevel)}</Chip.Label>
						</Chip>
					</div>
					<div className="text-neutral-gray-500 flex flex-wrap items-center gap-2 text-xs">
						<span
							className="border-border-subtle bg-surface-muted text-neutral-text rounded-full border px-3
								py-1 font-medium"
						>
							{questionNumber} / {totalQuestions} 문항
						</span>
						<span className="border-border-subtle bg-surface-muted rounded-full border px-3 py-1">
							{answeredCount}/{totalQuestions} 완료
						</span>
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-2 sm:justify-end">
					<div
						aria-label={`남은 시간 ${formattedRemainingTime}`}
						className={cn(
							'shadow-button rounded-full border px-4 py-2 font-mono text-sm font-semibold',
							isWarning
								? 'animate-pulse border-red-200 bg-red-50 text-red-700'
								: 'border-brand/20 bg-brand-light text-brand-deep',
						)}
						role="timer"
					>
						{formattedRemainingTime}
					</div>
					<Button
						className={cn(
							'border-border-subtle text-neutral-text hover:bg-surface-muted',
							showConversationTree && 'bg-surface-muted text-brand-deep',
						)}
						size="sm"
						variant="outline"
						onPress={onToggleConversationTree}
					>
						대화 흐름
					</Button>
					{!isFinished && (
						<Button
							className="border-red-200 bg-white text-red-700 hover:bg-red-50"
							size="sm"
							variant="outline"
							onPress={onEndExam}
						>
							평가 종료
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
