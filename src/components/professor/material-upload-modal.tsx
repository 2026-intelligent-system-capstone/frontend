'use client';

import { Button, Input, Label, Modal, TextArea, TextField } from '@heroui/react';
import { useId, useState } from 'react';

import { useCreateClassroomMaterial } from '@/lib/hooks/use-classrooms';
import { ApiClientError } from '@/types/api';

interface MaterialUploadModalProps {
	classroomId: string;
}

export function MaterialUploadModal({ classroomId }: MaterialUploadModalProps) {
	const titleId = useId();
	const weekId = useId();
	const descriptionId = useId();
	const fileId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { mutateAsync: createMaterial, isPending } = useCreateClassroomMaterial(classroomId);

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
		close: () => void,
	) => {
		event.preventDefault();
		setErrorMessage(null);

		const form = event.currentTarget;
		const formData = new FormData(form);
		const title = String(formData.get('title') ?? '').trim();
		const week = Number(formData.get('week'));
		const descriptionValue = String(formData.get('description') ?? '').trim();
		const uploadedFile = formData.get('uploaded_file');

		if (!(uploadedFile instanceof File) || uploadedFile.size === 0) {
			setErrorMessage('업로드할 파일을 선택해주세요.');
			return;
		}

		try {
			await createMaterial({
				title,
				week,
				description: descriptionValue || null,
				uploaded_file: uploadedFile,
			});

			form.reset();
			close();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('자료 업로드 중 오류가 발생했습니다.');
		}
	};

	return (
		<Modal>
			<Button variant="primary" onPress={() => setIsOpen(true)}>
				자료 업로드
			</Button>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-xl">
						{({ close }) => (
							<>
								<Modal.CloseTrigger />
								<Modal.Header>
									<Modal.Heading>강의 자료 업로드</Modal.Heading>
									<p className="mt-1 text-sm text-slate-500">
										이 강의실에 연결된 자료만 등록됩니다.
									</p>
								</Modal.Header>
								<Modal.Body className="p-6">
									<form className="space-y-4" onSubmit={(event) => handleSubmit(event, close)}>
										<TextField isRequired className="w-full" name="title">
											<Label htmlFor={titleId}>자료 제목</Label>
											<Input id={titleId} placeholder="예: 1주차 강의 자료" />
										</TextField>

										<div className="grid gap-4 md:grid-cols-2">
											<TextField isRequired className="w-full" defaultValue="1" name="week">
												<Label htmlFor={weekId}>주차</Label>
												<Input id={weekId} min={1} step={1} type="number" />
											</TextField>

											<div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
												<Label htmlFor={fileId}>파일</Label>
												<input
													id={fileId}
													name="uploaded_file"
													type="file"
													className="block h-10 w-full rounded-medium border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-medium file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700"
												/>
											</div>
										</div>

										<TextField className="w-full" name="description">
											<Label htmlFor={descriptionId}>설명</Label>
											<TextArea id={descriptionId} className="min-h-28" placeholder="자료 설명이나 학습 포인트를 입력하세요." />
										</TextField>

										{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

										<div className="flex justify-end gap-3">
											<Button type="button" variant="secondary" onPress={close}>
												취소
											</Button>
											<Button isPending={isPending} type="submit" variant="primary">
												업로드
											</Button>
										</div>
									</form>
								</Modal.Body>
							</>
						)}
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}
