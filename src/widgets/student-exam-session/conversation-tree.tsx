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
			aria-hidden={!isOpen}
			inert={!isOpen}
			className={`border-border-subtle bg-surface/95 shadow-card absolute top-0 right-0 z-40 flex h-full w-72
				max-w-[85vw] flex-col border-l backdrop-blur-md transition-transform duration-300
				${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
		>
			{/* 헤더 */}
			<div className="border-border-subtle flex items-center justify-between border-b px-4 py-3">
				<p className="text-neutral-text text-sm font-semibold">대화 흐름</p>
				<button
					aria-label="대화 흐름 닫기"
					className="border-border-subtle bg-surface-muted text-neutral-gray-500 hover:bg-brand-light
						hover:text-brand-deep rounded-full border px-2 py-1 text-xs transition-colors"
					type="button"
					onClick={onClose}
				>
					닫기
				</button>
			</div>

			{/* 트리 */}
			<div className="flex-1 overflow-y-auto px-3 py-4">
				{turns.length === 0 ? (
					<p
						className="border-border-subtle bg-surface-muted text-neutral-gray-500 rounded-2xl border p-4
							text-center text-xs"
					>
						아직 대화 내용이 없습니다.
					</p>
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
											className="bg-border-subtle my-0.5 ml-3 h-3 w-px"
										/>
									)}
									<div
										className={`rounded-2xl border px-3 py-2 text-xs leading-relaxed ${
											isAI
												? 'border-brand/20 bg-brand-light text-brand-deep'
												: 'border-border-subtle bg-surface-muted text-neutral-text'
											}`}
									>
										<span
											className={`mb-1 block text-[10px] font-semibold
												${isAI ? 'text-brand-deep' : 'text-neutral-gray-500'}`}
										>
											{isAI ? (turn.event_type === 'question' ? '질문' : '꼬리질문') : '내 답변'}
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
