interface MicButtonProps {
	isListening: boolean;
	onToggle: () => void;
	disabled?: boolean;
	disabledReason?: string | null;
}

export function MicButton({ isListening, onToggle, disabled, disabledReason }: MicButtonProps) {
	const ariaLabel = disabled && disabledReason ? disabledReason : isListening ? '음성 입력 중지' : '음성 입력 시작';

	return (
		<button
			aria-label={ariaLabel}
			aria-pressed={isListening}
			className={`focus-visible:ring-brand-border relative flex h-16 w-16 items-center justify-center rounded-full
				border transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-200 focus-visible:ring-2 focus-visible:ring-offset-2
				focus-visible:ring-offset-white focus-visible:outline-none disabled:cursor-not-allowed
				disabled:opacity-50 ${
					isListening
						? 'border-danger-text/20 bg-danger-soft text-danger-text shadow-button scale-105'
						: 'border-border-subtle bg-surface text-brand-deep shadow-button hover:bg-brand-soft'
				}`}
			disabled={disabled}
			type="button"
			onClick={onToggle}
		>
			{isListening && (
				<div aria-hidden="true" className="bg-danger-text/20 absolute h-full w-full animate-ping rounded-full" />
			)}
			<svg aria-hidden="true" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
				<path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 7 8.94V22h-3v2h8v-2h-3v-2.06A9 9 0 0 0 21 11h-2z" />
			</svg>
		</button>
	);
}
