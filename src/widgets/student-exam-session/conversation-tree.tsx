import type { ExamTurnEventType } from '@/entities/exam';

interface OralTurn {
	id: string;
	role: 'student' | 'assistant';
	event_type: ExamTurnEventType;
	content: string;
}

interface ConversationTreeProps {
	turns: OralTurn[];
	isOpen: boolean;
	onClose: () => void;
}

export function ConversationTree({ turns, isOpen, onClose }: ConversationTreeProps) {
	return (
		<div
			className={`absolute top-0 right-0 z-40 flex h-full w-72 flex-col border-l border-white/10 bg-[#16213e]/95
				backdrop-blur-sm transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
		>
			{/* 헤더 */}
			<div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
				<p className="text-sm font-semibold text-white">대화 흐름</p>
				<button
					className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
					onClick={onClose}
				>
					✕
				</button>
			</div>

			{/* 트리 */}
			<div className="flex-1 overflow-y-auto px-3 py-4">
				{turns.length === 0 ? (
					<p className="text-center text-xs text-slate-500">아직 대화 내용이 없습니다.</p>
				) : (
					<div className="flex flex-col gap-1">
						{turns.map((turn, index) => {
							const depth = Math.floor(index / 2);
							const isAI = turn.role === 'assistant';

							return (
								<div key={turn.id} style={{ paddingLeft: `${depth * 12}px` }}>
									{/* 연결선 */}
									{index > 0 && (
										<div
											style={{ marginLeft: `${depth * 12 - 6}px` }}
											className="my-0.5 ml-3 h-3 w-px bg-white/20"
										/>
									)}
									<div
										className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
											isAI
												? 'border border-violet-500/30 bg-violet-900/30 text-violet-200'
												: 'border border-white/10 bg-white/5 text-slate-300'
										}`}
									>
										<span
											className={`mb-1 block text-[10px] font-semibold ${isAI ? 'text-violet-400' : 'text-slate-500'}`}
										>
											{isAI
												? turn.event_type === 'question'
													? '🤖 질문'
													: '🤖 꼬리질문'
												: '👤 내 답변'}
										</span>
										<p className="line-clamp-3">{turn.content}</p>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
