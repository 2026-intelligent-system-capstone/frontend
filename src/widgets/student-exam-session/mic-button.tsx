interface MicButtonProps {
	isListening: boolean;
	onToggle: () => void;
	disabled?: boolean;
}

export function MicButton({ isListening, onToggle, disabled }: MicButtonProps) {
	return (
		<button
			className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200 disabled:opacity-40 ${
				isListening ? 'scale-110 bg-red-500 shadow-lg shadow-red-500/50' : 'bg-slate-600 hover:bg-slate-500'
			}`}
			disabled={disabled}
			onClick={onToggle}
		>
			{isListening && (
				<div className="absolute h-full w-full animate-ping rounded-full bg-red-400/40" />
			)}
			<svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
				<path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 7 8.94V22h-3v2h8v-2h-3v-2.06A9 9 0 0 0 21 11h-2z" />
			</svg>
		</button>
	);
}
