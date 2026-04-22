'use client';

import { useId, useState } from 'react';

import {
	type ClassroomMaterialSourceKind,
	MATERIAL_FILE_GUIDE,
	useCreateClassroomMaterial,
} from '@/entities/classroom-material';
import { ApiClientError } from '@/shared/api/types';
import { Button, Description, ErrorMessage, Input, Label, Modal, TextArea, TextField } from '@heroui/react';

interface MaterialUploadModalProps {
	classroomId: string;
	week: number;
}

export function MaterialUploadModal({ classroomId, week }: MaterialUploadModalProps) {
	const titleId = useId();
	const descriptionId = useId();
	const fileId = useId();
	const sourceUrlId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const [sourceKind, setSourceKind] = useState<ClassroomMaterialSourceKind>('file');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { mutateAsync: createMaterial, isPending } = useCreateClassroomMaterial(classroomId);

	const resetState = (form?: HTMLFormElement) => {
		setSourceKind('file');
		setErrorMessage(null);
		form?.reset();
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, close: () => void) => {
		event.preventDefault();
		setErrorMessage(null);

		const form = event.currentTarget;
		const formData = new FormData(form);
		const title = String(formData.get('title') ?? '').trim();
		const descriptionValue = String(formData.get('description') ?? '').trim();
		const sourceUrl = String(formData.get('source_url') ?? '').trim();
		const uploadedFile = formData.get('uploaded_file');

		if (sourceKind === 'file') {
			if (!(uploadedFile instanceof File) || uploadedFile.size === 0) {
				setErrorMessage('업로드할 파일을 선택해주세요.');
				return;
			}
		} else if (sourceUrl.length === 0) {
			setErrorMessage('YouTube 링크를 입력해주세요.');
			return;
		}

		try {
			if (sourceKind === 'file') {
				await createMaterial({
					title,
					week,
					description: descriptionValue || null,
					source_kind: 'file',
					uploaded_file: uploadedFile as File,
				});
			} else {
				await createMaterial({
					title,
					week,
					description: descriptionValue || null,
					source_kind: 'link',
					source_url: sourceUrl,
				});
			}

			resetState(form);
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
			<Modal.Backdrop
				isOpen={isOpen}
				onOpenChange={(nextOpen) => {
					setIsOpen(nextOpen);
					if (!nextOpen) {
						resetState();
					}
				}}
			>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-xl">
						{({ close }) => (
							<>
								<Modal.CloseTrigger />
								<Modal.Header>
									<Modal.Heading>강의 자료 업로드</Modal.Heading>
								</Modal.Header>
								<Modal.Body className="p-6">
									<form className="space-y-4" onSubmit={(event) => handleSubmit(event, close)}>
										<TextField isRequired className="w-full" name="title">
											<Label htmlFor={titleId}>자료 제목</Label>
											<Input id={titleId} placeholder="예: 1주차 강의 자료" />
										</TextField>

										<div className="space-y-2">
											<p className="text-sm font-medium text-slate-700">자료 등록 방식</p>
											<div className="grid gap-2 sm:grid-cols-2">
												<button
													type="button"
													className={`rounded-large border px-4 py-3 text-left ${
														sourceKind === 'file'
															? 'border-primary-500 bg-primary-50 text-primary-700'
															: 'border-slate-200 bg-white text-slate-700'
													}`}
													onClick={() => setSourceKind('file')}
												>
													<p className="text-sm font-semibold">파일 업로드</p>
													<p className="mt-1 text-xs text-slate-500">
														문서·영상·압축 파일을 등록합니다.
													</p>
												</button>
												<button
													type="button"
													className={`rounded-large border px-4 py-3 text-left ${
														sourceKind === 'link'
															? 'border-primary-500 bg-primary-50 text-primary-700'
															: 'border-slate-200 bg-white text-slate-700'
													}`}
													onClick={() => setSourceKind('link')}
												>
													<p className="text-sm font-semibold">YouTube 링크</p>
													<p className="mt-1 text-xs text-slate-500">
														공개 또는 접근 가능한 영상 URL을 등록합니다.
													</p>
												</button>
											</div>
										</div>

										{sourceKind === 'file' ? (
											<div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
												<Label htmlFor={fileId}>파일</Label>
												<input
													id={fileId}
													name="uploaded_file"
													type="file"
													className="rounded-medium file:rounded-medium block h-10 w-full
														border border-slate-200 bg-white px-3 py-2 text-sm
														text-slate-700 file:mr-3 file:border-0 file:bg-slate-100
														file:px-3 file:py-1.5 file:text-sm file:font-medium
														file:text-slate-700"
												/>
												<p className="text-xs text-slate-500">
													지원 형식: {MATERIAL_FILE_GUIDE}
												</p>
											</div>
										) : (
											<TextField isRequired className="w-full" name="source_url">
												<Label htmlFor={sourceUrlId}>YouTube URL</Label>
												<Input
													id={sourceUrlId}
													placeholder="https://www.youtube.com/watch?v=..."
													type="url"
												/>
												<Description>
													YouTube 링크형 자료로 저장되어 적재를 진행합니다.
												</Description>
											</TextField>
										)}

										<TextField className="w-full" name="description">
											<Label htmlFor={descriptionId}>설명</Label>
											<TextArea
												id={descriptionId}
												className="min-h-28"
												placeholder="자료 설명이나 학습 포인트를 입력하세요."
											/>
										</TextField>

										{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

										<div className="flex justify-end gap-3">
											<Button
												type="button"
												variant="secondary"
												onPress={() => {
													resetState();
													close();
												}}
											>
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
