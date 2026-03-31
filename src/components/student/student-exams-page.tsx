'use client';

import { Card } from '@heroui/react';

export function StudentExamsPageContent() {
	return (
		<div className="min-h-screen bg-slate-50 px-6 py-10">
			<Card className="mx-auto max-w-4xl">
				<Card.Header>
					<Card.Title>학생 평가 목록</Card.Title>
					<Card.Description>다음 단계에서 실제 평가 목록과 상세 흐름을 연결합니다.</Card.Description>
				</Card.Header>
				<Card.Content className="text-sm text-slate-600">기반 라우팅과 인증 보호가 먼저 구성되었습니다.</Card.Content>
			</Card>
		</div>
	);
}
