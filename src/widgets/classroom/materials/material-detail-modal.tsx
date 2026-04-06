'use client';

import {
	type ClassroomMaterial,
	formatMaterialDateTime,
	formatMaterialFileSize,
	getMaterialIngestStatusColor,
	getMaterialIngestStatusLabel,
	useClassroomMaterial,
} from '@/entities/classroom-material';
import { Card, Chip, EmptyState, ErrorMessage, Modal, Skeleton } from '@heroui/react';

interface MaterialDetailModalProps {
	classroomId: string;
	material: ClassroomMaterial | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	actionErrorMessage: string | null;
}

export function MaterialDetailModal({
	classroomId,
	material,
	isOpen,
	onOpenChange,
	actionErrorMessage,
}: MaterialDetailModalProps) {
	const materialId = material?.id ?? '';
	const { data, isError, isLoading } = useClassroomMaterial(classroomId, materialId, material ?? undefined);
	const resolvedMaterial = data ?? material;

	return (
		<Modal>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-5xl">
						{resolvedMaterial ? (
							<>
								<Modal.CloseTrigger />
								<Modal.Header>
									<div className="space-y-2">
										<Modal.Heading>{resolvedMaterial.title}</Modal.Heading>
										<p className="text-sm text-slate-500">
											{getMaterialIngestStatusLabel(resolvedMaterial.ingest_status)} ·{' '}
											{resolvedMaterial.week}주차 ·{' '}
											{formatMaterialDateTime(resolvedMaterial.uploaded_at)}
										</p>
									</div>
								</Modal.Header>
								<Modal.Body className="space-y-6 p-6">
									{actionErrorMessage ? <ErrorMessage>{actionErrorMessage}</ErrorMessage> : null}
									{isError ? (
										<p className="text-sm text-amber-700">
											최신 자료 정보를 불러오지 못해 현재 목록 정보를 표시합니다.
										</p>
									) : null}
									{isLoading && data == null ? (
										<div className="grid gap-3 md:grid-cols-3">
											{Array.from({ length: 3 }).map((_, index) => (
												<Skeleton key={index} className="h-28 rounded-xl" />
											))}
										</div>
									) : null}
									<div className="grid gap-3 md:grid-cols-3">
										<Card className="border border-slate-200 bg-slate-50">
											<Card.Content className="space-y-2 py-4 text-sm text-slate-600">
												<p className="font-medium text-slate-900">파일 정보</p>
												<p>파일명 {resolvedMaterial.file.file_name}</p>
												<p>형식 {resolvedMaterial.file.file_extension.toUpperCase()}</p>
												<p>크기 {formatMaterialFileSize(resolvedMaterial.file.file_size)}</p>
											</Card.Content>
										</Card>
										<Card className="border border-slate-200 bg-slate-50">
											<Card.Content className="space-y-2 py-4 text-sm text-slate-600">
												<p className="font-medium text-slate-900">적재 결과</p>
												<p>
													상태 {getMaterialIngestStatusLabel(resolvedMaterial.ingest_status)}
												</p>
												<p>시험 범위 후보 {resolvedMaterial.scope_candidates.length}개</p>
												<p>오류 {resolvedMaterial.ingest_error ?? '없음'}</p>
											</Card.Content>
										</Card>
										<Card className="border border-slate-200 bg-slate-50">
											<Card.Content className="space-y-2 py-4 text-sm text-slate-600">
												<p className="font-medium text-slate-900">설명</p>
												<p>{resolvedMaterial.description ?? '설명 없음'}</p>
											</Card.Content>
										</Card>
									</div>

									<div className="space-y-3">
										<div className="flex items-center justify-between gap-3">
											<h3 className="text-base font-semibold text-slate-900">시험 범위 후보</h3>
											<Chip
												color={getMaterialIngestStatusColor(resolvedMaterial.ingest_status)}
												size="sm"
												variant="soft"
											>
												<Chip.Label>
													{getMaterialIngestStatusLabel(resolvedMaterial.ingest_status)}
												</Chip.Label>
											</Chip>
										</div>
										{resolvedMaterial.scope_candidates.length === 0 ? (
											<EmptyState
												className="flex w-full flex-col items-center justify-center rounded-xl
													border border-dashed border-slate-200 py-10 text-center"
											>
												<span className="text-sm text-slate-500">
													추출된 시험 범위가 없습니다.
												</span>
											</EmptyState>
										) : (
											<div className="space-y-3">
												{resolvedMaterial.scope_candidates.map((candidate, index) => (
													<Card
														key={`${candidate.label}-${index}`}
														className="border border-slate-200 bg-white"
													>
														<Card.Content className="space-y-3 py-4">
															<div className="flex flex-wrap items-center gap-2">
																<Chip color="accent" size="sm" variant="soft">
																	<Chip.Label>{candidate.label}</Chip.Label>
																</Chip>
																{candidate.week_range ? (
																	<Chip size="sm" variant="secondary">
																		<Chip.Label>{candidate.week_range}</Chip.Label>
																	</Chip>
																) : null}
																{candidate.confidence !== null ? (
																	<Chip size="sm" variant="secondary">
																		<Chip.Label>
																			신뢰도{' '}
																			{(candidate.confidence * 100).toFixed(0)}%
																		</Chip.Label>
																	</Chip>
																) : null}
															</div>
															<p className="text-sm text-slate-700">
																{candidate.scope_text}
															</p>
															<div className="flex flex-wrap gap-2">
																{candidate.keywords.length === 0 ? (
																	<span className="text-sm text-slate-500">
																		키워드 없음
																	</span>
																) : (
																	candidate.keywords.map((keyword) => (
																		<Chip key={keyword} size="sm" variant="soft">
																			<Chip.Label>{keyword}</Chip.Label>
																		</Chip>
																	))
																)}
															</div>
														</Card.Content>
													</Card>
												))}
											</div>
										)}
									</div>
								</Modal.Body>
							</>
						) : null}
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}
