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
	const hasPermissionsApi = typeof navigator !== 'undefined' && 'permissions' in navigator;
	const initialPermissionState: PermissionState = hasPermissionsApi ? 'checking' : 'prompt';
	const [mic, setMic] = useState<PermissionState>(initialPermissionState);
	const [camera, setCamera] = useState<PermissionState>(initialPermissionState);

	useEffect(() => {
		if (!hasPermissionsApi) {
			return;
		}

		let isActive = true;
		let micPermissionStatus: PermissionStatus | null = null;
		let cameraPermissionStatus: PermissionStatus | null = null;

		void navigator.permissions
			.query({ name: 'microphone' as PermissionName })
			.then((result) => {
				micPermissionStatus = result;
				if (isActive) {
					setMic(result.state as PermissionState);
				}
				result.onchange = () => {
					if (isActive) {
						setMic(result.state as PermissionState);
					}
				};
			})
			.catch(() => {
				if (isActive) {
					setMic('prompt');
				}
			});

		void navigator.permissions
			.query({ name: 'camera' as PermissionName })
			.then((result) => {
				cameraPermissionStatus = result;
				if (isActive) {
					setCamera(result.state as PermissionState);
				}
				result.onchange = () => {
					if (isActive) {
						setCamera(result.state as PermissionState);
					}
				};
			})
			.catch(() => {
				if (isActive) {
					setCamera('prompt');
				}
			});

		return () => {
			isActive = false;
			if (micPermissionStatus) {
				micPermissionStatus.onchange = null;
			}
			if (cameraPermissionStatus) {
				cameraPermissionStatus.onchange = null;
			}
		};
	}, [hasPermissionsApi]);

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
