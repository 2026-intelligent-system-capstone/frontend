import { SurfaceCard } from '@/shared/ui';

const GUIDE_ITEMS = [
	'AI가 질문을 제시하면 텍스트 또는 음성으로 자유롭게 답변하세요.',
	'답변 내용에 따라 AI가 심층 꼬리질문을 이어갑니다.',
	'제한 시간 내에 모든 질문에 답변하고 완료 버튼으로 제출하세요.',
	'평가 중 새로고침하면 진행 상황이 초기화될 수 있으니 안정적인 네트워크에서 응시하세요.',
];

export function ExamGuideCard() {
	return (
		<SurfaceCard className="space-y-5">
			<div className="space-y-2">
				<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.05em] uppercase">
					04 · Instructions
				</p>
				<h2 className="text-neutral-text text-xl font-semibold tracking-[-0.01em]">응시 안내사항</h2>
				<p className="text-neutral-gray-500 text-sm leading-6">
					시작 전 아래 항목을 읽고 답변 흐름을 미리 확인하세요.
				</p>
			</div>
			<ol className="space-y-3">
				{GUIDE_ITEMS.map((item, index) => (
					<li
						key={item}
						className="border-border-subtle bg-surface-muted text-neutral-gray-500 flex gap-3 rounded-2xl
							border p-4 text-sm leading-6"
					>
						<span
							className="bg-surface text-brand-deep ring-border-subtle flex size-7 shrink-0 items-center
								justify-center rounded-full text-xs font-semibold ring-1"
						>
							{index + 1}
						</span>
						<span>{item}</span>
					</li>
				))}
			</ol>
		</SurfaceCard>
	);
}
