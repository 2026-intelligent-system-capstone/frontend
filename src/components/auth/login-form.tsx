'use client';

import type { Key } from '@heroui/react';

import { Button, Card, Form, Input, Label, ListBox, Select, TextField } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getDefaultRouteByRole } from '@/lib/auth/routes';
import { useAuth } from '@/lib/hooks/use-auth';
import { ApiClientError } from '@/types/api';
import type { Organization } from '@/types/organization';

interface LoginFormProps {
	initialOrganizations: Organization[];
	organizationsLoadFailed: boolean;
}

export function LoginForm({ initialOrganizations, organizationsLoadFailed }: LoginFormProps) {
	const router = useRouter();
	const { login, loginPending } = useAuth();
	const [selectedOrganizationCode, setSelectedOrganizationCode] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);

		if (!selectedOrganizationCode) {
			setErrorMessage('학교를 먼저 선택해주세요.');
			return;
		}

		const formData = new FormData(event.currentTarget);
		const loginId = String(formData.get('login_id') ?? '');
		const password = String(formData.get('password') ?? '');

		try {
			const user = await login({
				organization_code: selectedOrganizationCode,
				login_id: loginId,
				password,
			});

			if (!user) {
				setErrorMessage('사용자 정보를 불러오지 못했습니다. 다시 시도해주세요.');
				return;
			}

			router.replace(getDefaultRouteByRole(user.role));
			router.refresh();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('로그인 중 오류가 발생했습니다.');
		}
	};

	return (
		<Card className="w-full max-w-xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur">
			<Card.Header className="gap-2 px-0 pt-0">
				<Card.Title className="text-2xl font-semibold text-slate-900">Dialearn 로그인</Card.Title>
				<Card.Description className="text-sm text-slate-500">
					학교를 선택하고 계정으로 로그인하세요.
				</Card.Description>
			</Card.Header>

			<Form className="flex flex-col gap-6" onSubmit={handleSubmit}>
				<div className="flex w-full flex-col gap-3">
					<Select
						isRequired
						className="w-full"
						isDisabled={initialOrganizations.length === 0}
						name="organization_code"
						placeholder="학교를 선택하세요"
						value={selectedOrganizationCode || null}
						variant="secondary"
						onChange={(value) => setSelectedOrganizationCode((value as Key | null)?.toString() ?? '')}
					>
						<Label>학교 선택</Label>
						<Select.Trigger>
							<Select.Value />
							<Select.Indicator />
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								{initialOrganizations.map((organization) => (
									<ListBox.Item key={organization.id} id={organization.code} textValue={organization.name}>
										<div className="flex flex-col items-start">
											<span className="font-medium">{organization.name}</span>
											<span className="text-xs text-slate-500">{organization.code}</span>
										</div>
										<ListBox.ItemIndicator />
									</ListBox.Item>
								))}
							</ListBox>
						</Select.Popover>
					</Select>
					{organizationsLoadFailed ? <p className="text-sm text-red-600">학교 목록을 불러오지 못했습니다.</p> : null}
					{!organizationsLoadFailed && initialOrganizations.length === 0 ? (
						<p className="text-sm text-slate-500">선택 가능한 학교가 없습니다.</p>
					) : null}
				</div>

				<TextField isRequired className="w-full" name="login_id">
					<Label>학번 또는 로그인 ID</Label>
					<Input placeholder="20260001" />
				</TextField>

				<TextField isRequired className="w-full" name="password" type="password">
					<Label>비밀번호</Label>
					<Input placeholder="비밀번호를 입력하세요" />
				</TextField>

				{errorMessage ? <p className="w-full text-sm text-red-600">{errorMessage}</p> : null}

				<Button className="w-full" isPending={loginPending} type="submit">
					로그인
				</Button>
			</Form>
		</Card>
	);
}
