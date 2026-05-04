'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { type Organization } from '@/entities/organization';
import { getDefaultRouteByRole } from '@/entities/viewer';
import { useViewerAuthActions } from '@/entities/viewer/client';
import { ApiClientError } from '@/shared/api/types';
import { Button, Card, ErrorMessage, Form, Input, Label, ListBox, Select, TextField } from '@heroui/react';

interface SignInFormProps {
	initialOrganizations: Organization[];
	organizationsLoadFailed: boolean;
}

export function SignInForm({ initialOrganizations, organizationsLoadFailed }: SignInFormProps) {
	const router = useRouter();
	const { login, loginPending } = useViewerAuthActions();
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
				setErrorMessage('로그인에 실패했습니다. 입력 정보를 확인해주세요.');
				return;
			}

			setErrorMessage('로그인 중 오류가 발생했습니다.');
		}
	};

	return (
		<Card
			className="border-border-subtle bg-surface-raised shadow-card w-full max-w-xl rounded-3xl border p-6 sm:p-8"
		>
			<Card.Header className="gap-2 px-0 pt-0">
				<Card.Title className="text-neutral-text text-2xl font-semibold tracking-[-0.01em]">
					Dialearn 로그인
				</Card.Title>
				<Card.Description className="text-neutral-gray-500 text-sm leading-6">
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
						onChange={(value) => {
							if (typeof value === 'string') {
								setSelectedOrganizationCode(value);
								return;
							}

							setSelectedOrganizationCode(value?.toString() ?? '');
						}}
					>
						<Label>학교 선택</Label>
						<Select.Trigger>
							<Select.Value />
							<Select.Indicator />
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								{initialOrganizations.map((organization) => (
									<ListBox.Item
										key={organization.id}
										id={organization.code}
										textValue={organization.name}
									>
										<div className="flex flex-col items-start">
											<span className="font-medium">{organization.name}</span>
										</div>
										<ListBox.ItemIndicator />
									</ListBox.Item>
								))}
							</ListBox>
						</Select.Popover>
					</Select>
					{organizationsLoadFailed ? <ErrorMessage>학교 목록을 불러오지 못했습니다.</ErrorMessage> : null}
					{!organizationsLoadFailed && initialOrganizations.length === 0 ? (
						<p className="text-neutral-gray-500 text-sm">선택 가능한 학교가 없습니다.</p>
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

				{errorMessage ? <ErrorMessage className="w-full">{errorMessage}</ErrorMessage> : null}

				<Button
					className="shadow-button w-full rounded-full"
					isPending={loginPending}
					type="submit"
					variant="primary"
				>
					로그인
				</Button>
			</Form>
		</Card>
	);
}
