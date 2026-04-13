import { Card } from '@heroui/react';

export function ExamGuideCard() {
	return (
		<Card className="border border-slate-200 bg-white">
			<Card.Header>
				<Card.Title className="text-base font-semibold text-slate-900">응시 안내</Card.Title>
			</Card.Header>
			<Card.Content className="space-y-2 text-sm text-slate-600">
				<p>• AI가 질문을 제시하면 자유롭게 답변하세요.</p>
				<p>• 답변에 따라 AI가 심층 꼬리질문을 이어갑니다.</p>
				<p>• 텍스트 또는 음성으로 답변할 수 있습니다.</p>
				<p>• 제한 시간 내에 모든 질문에 답변해주세요.</p>
				<p>• 평가 중 새로고침 시 진행 상황이 초기화될 수 있습니다.</p>
			</Card.Content>
		</Card>
	);
}
