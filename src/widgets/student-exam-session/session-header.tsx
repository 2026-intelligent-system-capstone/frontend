import Link from 'next/link';
import { Button, Chip } from '@heroui/react';
import { getBloomLevelColor, getBloomLevelLabel } from '@/entities/exam';
import type { BloomLevel } from '@/entities/exam';

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
	remainingSeconds: number;
	isFinished: boolean;
	examId: string;
}

export function SessionHeader({
	examTitle,
	bloomLevel,
	questionNumber,
	totalQuestions,
	remainingSeconds,
	isFinished,
	examId,
}: SessionHeaderProps) {
	const isWarning = remainingSeconds < 5 * 60;

	return (
		<div className="flex items-center justify-between border-b border-white/10 bg-[#16213e]/80 px-6 py-3 backdrop-blur-sm">
			<div className="flex items-center gap-3">
				<span className="text-sm font-semibold text-white">{examTitle}</span>
				<Chip color={getBloomLevelColor(bloomLevel)} size="sm" variant="soft">
					<Chip.Label>{getBloomLevelLabel(bloomLevel)}</Chip.Label>
				</Chip>
			</div>
			<div className="flex items-center gap-4">
				<span className="text-xs text-slate-400">
					{questionNumber} / {totalQuestions} 문항
				</span>
				<div
					className={`rounded-lg px-3 py-1.5 font-mono text-sm font-semibold ${
						isWarning ? 'animate-pulse bg-red-900/60 text-red-300' : 'bg-white/10 text-white'
					}`}
				>
					{formatTime(remainingSeconds)}
				</div>
				{!isFinished && (
					<Link href={`/student/exams/${examId}/result`}>
						<Button
							className="border-white/20 text-white hover:bg-white/10"
							size="sm"
							variant="outline"
						>
							평가 종료
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
}
