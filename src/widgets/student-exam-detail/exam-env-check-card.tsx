'use client';

import { useEffect, useState } from 'react';
import { Card } from '@heroui/react';

type PermissionState = 'granted' | 'denied' | 'prompt' | 'checking';

interface CheckItem {
	label: string;
	status: PermissionState;
}

function StatusBadge({ status }: { status: PermissionState }) {
	if (status === 'checking') {
		return <span className="text-xs text-slate-400">확인 중...</span>;
	}
	if (status === 'granted') {
		return <span className="text-xs font-medium text-emerald-600">준비됨</span>;
	}
	if (status === 'denied') {
		return <span className="text-xs font-medium text-red-600">권한 없음</span>;
	}
	return <span className="text-xs font-medium text-amber-600">허용 필요</span>;
}

export function ExamEnvCheckCard() {
	const [mic, setMic] = useState<PermissionState>('checking');
	const [camera, setCamera] = useState<PermissionState>('checking');

	useEffect(() => {
		if (!navigator.permissions) {
			setMic('prompt');
			setCamera('prompt');
			return;
		}

		navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
			setMic(result.state as PermissionState);
			result.onchange = () => setMic(result.state as PermissionState);
		}).catch(() => setMic('prompt'));

		navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
			setCamera(result.state as PermissionState);
			result.onchange = () => setCamera(result.state as PermissionState);
		}).catch(() => setCamera('prompt'));
	}, []);

	const items: CheckItem[] = [
		{ label: '마이크', status: mic },
		{ label: '카메라', status: camera },
	];

	const allReady = items.every((item) => item.status === 'granted');

	return (
		<Card className="border border-slate-200 bg-white">
			<Card.Header>
				<Card.Title className="text-base font-semibold text-slate-900">응시 환경 확인</Card.Title>
				<Card.Description className="text-sm text-slate-500">
					평가 입장 전 환경을 확인해주세요.
				</Card.Description>
			</Card.Header>
			<Card.Content className="space-y-3">
				{items.map((item) => (
					<div key={item.label} className="flex items-center justify-between text-sm">
						<span className="text-slate-600">{item.label}</span>
						<StatusBadge status={item.status} />
					</div>
				))}
				{!allReady && mic !== 'checking' && camera !== 'checking' && (
					<p className="pt-1 text-xs text-amber-600">
						브라우저 설정에서 마이크/카메라 권한을 허용하면 더 원활하게 응시할 수 있습니다.
					</p>
				)}
			</Card.Content>
		</Card>
	);
}
