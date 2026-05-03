interface AICharacterProps {
	isSpeaking: boolean;
}

export function AICharacter({ isSpeaking }: AICharacterProps) {
	return (
		<div
			className="border-border-subtle bg-surface shadow-card relative flex flex-col items-center justify-center
				rounded-3xl border p-6"
		>
			{isSpeaking && (
				<>
					<div
						className="bg-brand/10 absolute h-72 w-72 animate-ping rounded-full"
						style={{ animationDuration: '1.5s' }}
					/>
					<div
						className="bg-brand/20 absolute h-60 w-60 animate-ping rounded-full"
						style={{ animationDuration: '1s' }}
					/>
				</>
			)}

			<div
				className="relative"
				style={{
					animation: isSpeaking
						? 'aiFloat 0.6s ease-in-out infinite alternate'
						: 'aiFloatIdle 3s ease-in-out infinite alternate',
				}}
			>
				<style>{`
					@keyframes aiFloat {
						0% { transform: translateY(0px) scale(1); }
						100% { transform: translateY(-12px) scale(1.04); }
					}
					@keyframes aiFloatIdle {
						0% { transform: translateY(0px); }
						100% { transform: translateY(-8px); }
					}
					@keyframes blink {
						0%, 90%, 100% { transform: scaleY(1); }
						95% { transform: scaleY(0.1); }
					}
					@keyframes mouthTalk {
						0% { transform: scaleY(0.3); }
						100% { transform: scaleY(1); }
					}
				`}</style>

				<div
					className={`shadow-card relative flex h-40 w-40 flex-col items-center justify-center rounded-full
						transition-all duration-300 sm:h-44 sm:w-44 ${
							isSpeaking
								? 'from-brand to-brand-deep bg-gradient-to-br via-emerald-400'
								: 'from-brand-light via-brand to-brand-deep bg-gradient-to-br'
						}`}
				>
					<div className="absolute top-6 left-6 h-8 w-8 rounded-full bg-white/20 blur-sm" />

					<div className="mb-3 flex gap-5">
						{[0, 1].map((i) => (
							<div
								key={i}
								className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white
									shadow-inner"
								style={{ animation: isSpeaking ? 'none' : 'blink 4s ease-in-out infinite' }}
							>
								<div
									className={`h-4 w-4 rounded-full bg-slate-900 transition-all duration-200
									${isSpeaking ? 'scale-110' : ''}`}
								/>
								<div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-white" />
							</div>
						))}
					</div>

					<div
						className="flex h-7 w-16 items-center justify-center overflow-hidden rounded-full
							bg-slate-900/80"
					>
						{isSpeaking ? (
							<div
								className="h-4 w-10 rounded-full bg-white/90"
								style={{ animation: 'mouthTalk 0.3s ease-in-out infinite alternate' }}
							/>
						) : (
							<div className="h-2 w-10 rounded-full bg-white/60" />
						)}
					</div>

					<div className="absolute -top-8 left-1/2 -translate-x-1/2">
						<div className="bg-brand-light mx-auto h-8 w-1 rounded-full" />
						<div
							className={`mx-auto -mt-1 h-4 w-4 rounded-full transition-all duration-300 ${
								isSpeaking ? 'bg-yellow-300 shadow-lg shadow-yellow-300/60' : 'bg-brand-light'
							}`}
						/>
					</div>
				</div>
			</div>

			<p
				className="border-border-subtle bg-surface-muted text-neutral-gray-500 mt-5 rounded-full border px-3
					py-1 text-sm font-medium"
			>
				{isSpeaking ? '질문 중...' : '대기 중'}
			</p>
		</div>
	);
}
