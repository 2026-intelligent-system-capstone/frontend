import { Button } from '@heroui/react';

import { MicButton } from './mic-button';

interface SessionControlsProps {
	isListening: boolean;
	isSubmitting: boolean;
	isFinished: boolean;
	showTextInput: boolean;
	input: string;
	isDisabled?: boolean;
	isSttSupported?: boolean;
	isSttPermissionBlocked?: boolean;
	sttErrorMessage?: string | null;
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
	isDisabled = false,
	isSttSupported = true,
	isSttPermissionBlocked = false,
	sttErrorMessage = null,
	onMicToggle,
	onToggleTextInput,
	onInputChange,
	onSubmit,
}: SessionControlsProps) {
	if (isFinished) {
		return <p className="text-neutral-gray-500 text-sm font-medium">시험이 종료되었습니다.</p>;
	}

	const sttUnavailableMessage = !isSttSupported
		? '이 브라우저는 음성 인식을 지원하지 않습니다. 텍스트 입력으로 답변해주세요.'
		: sttErrorMessage;
	const disabledMessage = isDisabled ? '세션 준비 또는 제출 완료 상태라 답변 입력을 사용할 수 없습니다.' : null;
	const controlStatusMessage = disabledMessage ?? sttUnavailableMessage;
	const isMicDisabled = isSubmitting || isDisabled || !isSttSupported || isSttPermissionBlocked;
	const isTextToggleDisabled = isSubmitting || isDisabled;

	return (
		<div
			className="border-border-subtle bg-surface shadow-card flex w-full max-w-2xl flex-col items-center gap-4
				rounded-3xl border p-5 sm:p-6"
		>
			<div className="flex flex-wrap items-center justify-center gap-4">
				<MicButton
					disabled={isMicDisabled}
					disabledReason={controlStatusMessage}
					isListening={isListening}
					onToggle={onMicToggle}
				/>
				<button
					className="border-border-subtle bg-surface-muted text-neutral-text hover:bg-brand-soft
						hover:text-brand-deep rounded-full border px-4 py-2 text-xs font-medium transition-colors
						disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isTextToggleDisabled}
					type="button"
					onClick={onToggleTextInput}
				>
					{showTextInput ? '텍스트 닫기' : '텍스트로 입력'}
				</button>
			</div>

			<p
				className="text-neutral-gray-500 text-center text-xs"
				role={controlStatusMessage ? 'status' : undefined}
			>
				{controlStatusMessage ??
					(isListening ? '음성 인식 중... 말씀해주세요.' : '마이크를 눌러 답변하거나 텍스트로 입력하세요.')}
			</p>

			{showTextInput && (
				<div className="flex w-full flex-col gap-3 sm:flex-row">
					<textarea
						aria-label="구술형 답변 입력"
						className="border-border-subtle bg-surface-muted text-neutral-text
							placeholder:text-neutral-gray-500 focus:border-brand-border flex-1 resize-none rounded-2xl
							border px-4 py-3 text-sm focus:bg-white focus:outline-none disabled:cursor-not-allowed
							disabled:opacity-70"
						disabled={isSubmitting || isDisabled}
						placeholder="답변을 입력하세요. (Ctrl+Enter로 제출)"
						rows={3}
						value={input}
						onChange={(event) => onInputChange(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
								event.preventDefault();
								onSubmit();
							}
						}}
					/>
					<Button
						className="shadow-button w-full self-stretch sm:w-auto"
						isDisabled={!input.trim() || isDisabled || isSubmitting}
						isPending={isSubmitting}
						variant="primary"
						onPress={onSubmit}
					>
						{isSubmitting ? 'AI 분석 중...' : '제출'}
					</Button>
				</div>
			)}
		</div>
	);
}
