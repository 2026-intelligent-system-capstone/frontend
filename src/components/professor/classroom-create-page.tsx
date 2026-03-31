'use client';

import { Card } from '@heroui/react';

import { ClassroomForm } from '@/components/professor/classroom-form';

export function ClassroomCreatePage() {
	return (
		<div className="min-h-screen bg-slate-50 px-6 py-10">
			<div className="mx-auto max-w-4xl">
				<Card>
					<Card.Header className="gap-2">
						<Card.Title className="text-2xl font-semibold text-slate-900">새 강의실 생성</Card.Title>
						<Card.Description className="text-sm text-slate-500">
							강의실 기본 정보를 입력하고 자료/시험 관리의 시작점을 만드세요.
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<ClassroomForm />
					</Card.Content>
				</Card>
			</div>
		</div>
	);
}
