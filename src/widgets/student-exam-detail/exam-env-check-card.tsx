'use client';

import { useEffect, useState } from 'react';

import { SurfaceCard } from '@/shared/ui';

type PermissionState = 'granted' | 'denied' | 'prompt' | 'checking';

interface CheckItem {
	label: string;
	status: PermissionState;
}

function getStatusText(status: PermissionState): { label: string; description: string; className: string } {
	if (status === 'checking') {
		return {
			label: '확인 중',
			description: '브라우저 권한 상태를 확인하고 있습니다.',
			className: 'border-border-subtle bg-surface text-neutral-gray-500',
		};
	}
	if (status === 'granted') {
		return {
			label: '준비됨',
			description: '응시에 필요한 권한이 허용되어 있습니다.',
			className: 'border-brand-border bg-brand-soft text-brand-deep',
		};
	}
	if (status === 'denied') {
		return {
			label: '권한 없음',
			description: '브라우저 설정에서 권한을 다시 허용해야 합니다.',
			className: 'border-danger-soft bg-danger-soft text-danger-text',
		};
	}
	return {
		label: '허용 필요',
		description: '입장 시 권한 요청이 표시되면 허용해주세요.',
		className: 'border-warning-soft bg-warning-soft text-warning-text',
	};
}

function StatusBadge({ status }: { status: PermissionState }) {
	const statusText = getStatusText(status);

	return (
		<span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusText.className}`}>
			{statusText.label}
		</span>
	);
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
		<SurfaceCard className="space-y-5">
			<div className="space-y-2">
				<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.05em] uppercase">
					02 · Environment
				</p>
				<h2 className="text-neutral-text text-xl font-semibold tracking-[-0.01em]">응시 환경 확인</h2>
				<p className="text-neutral-gray-500 text-sm leading-6">
					마이크와 카메라 권한은 구술 평가 진행과 부정행위 방지 확인에 사용됩니다.
				</p>
			</div>
			<div className="grid gap-3 md:grid-cols-2">
				{items.map((item) => {
					const statusText = getStatusText(item.status);

					return (
						<div key={item.label} className="border-border-subtle bg-surface-muted rounded-2xl border p-4">
							<div className="flex items-center justify-between gap-3">
								<span className="text-neutral-text font-semibold">{item.label}</span>
								<StatusBadge status={item.status} />
							</div>
							<p className="text-neutral-gray-500 mt-2 text-sm leading-6">{statusText.description}</p>
						</div>
					);
				})}
			</div>
			{!allReady && mic !== 'checking' && camera !== 'checking' && (
				<p
					className="border-warning-soft bg-warning-soft text-warning-text rounded-2xl border px-4 py-3
						text-sm leading-6"
				>
					권한이 준비되지 않아도 입장 안내는 확인할 수 있습니다. 실제 응시 전에는 브라우저 설정에서
					마이크/카메라 권한을 허용해주세요.
				</p>
			)}
		</SurfaceCard>
	);
}
