import Link from 'next/link';
import { Button } from '@heroui/react';
import { MicButton } from './mic-button';

interface SessionControlsProps {
	isListening: boolean;
	isSubmitting: boolean;
	isFinished: boolean;
	showTextInput: boolean;
	input: string;
	examId: string;
	onMicToggle: () => void;
	onToggleTextInput: () => void;
	onInputChange: (value: string) => void;
	onSubmit: () => void;
}

export function SessionControls({
	isListening,
	isSubmitting,
	isFinished,
	showTextInput,
	input,
	examId,
	onMicToggle,
	onToggleTextInput,
	onInputChange,
	onSubmit,
}: SessionControlsProps) {
	if (isFinished) {
		return (
			<div className="flex flex-col items-center gap-3">
				<p className="text-sm font-medium text-slate-300">시험이 종료되었습니다.</p>
				<Link href={`/student/exams/${examId}/result`}>
					<Button variant="primary">결과 확인하기</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-3">
			<div className="flex items-center gap-6">
				<MicButton disabled={isSubmitting} isListening={isListening} onToggle={onMicToggle} />
				<button
					className="rounded-full border border-white/20 px-4 py-2 text-xs text-slate-300 transition-colors hover:bg-white/10"
					onClick={onToggleTextInput}
				>
					{showTextInput ? '텍스트 닫기' : '텍스트로 입력'}
				</button>
			</div>

			<p className="text-xs text-slate-500">
				{isListening
					? '음성 인식 중... 말씀해주세요.'
					: '마이크를 눌러 답변하거나 텍스트로 입력하세요.'}
			</p>

			{showTextInput && (
				<div className="flex w-full max-w-2xl gap-3">
					<textarea
						className="flex-1 resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
						disabled={isSubmitting}
						placeholder="답변을 입력하세요. (Ctrl+Enter로 제출)"
						rows={3}
						value={input}
						onChange={(e) => onInputChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
								e.preventDefault();
								onSubmit();
							}
						}}
					/>
					<Button isDisabled={!input.trim()} isPending={isSubmitting} variant="primary" onPress={onSubmit}>
						제출
					</Button>
				</div>
			)}
		</div>
	);
}
