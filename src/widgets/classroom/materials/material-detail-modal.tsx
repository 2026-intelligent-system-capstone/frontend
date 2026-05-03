'use client';

import {
	type ClassroomMaterial,
	formatMaterialDateTime,
	formatMaterialFileSize,
	getMaterialDisplayName,
	getMaterialFileTypeLabel,
	getMaterialIngestStatusColor,
	getMaterialIngestStatusDescription,
	getMaterialIngestStatusLabel,
	getMaterialSourceKindColor,
	getMaterialSourceKindLabel,
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
	const { data, isError, isLoading, isFetching } = useClassroomMaterial(
		classroomId,
		materialId,
		material ?? undefined,
	);
	const resolvedMaterial = data ?? material;
	const isRefreshingPendingMaterial = isFetching && resolvedMaterial?.ingest_status === 'pending';
	const isIngestFailed = resolvedMaterial?.ingest_status === 'failed';
	const ingestFailureMessage =
		resolvedMaterial?.ingest_error ?? '분석 원인을 확인할 수 없습니다. 파일을 확인한 뒤 다시 적재해주세요.';

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
										<div className="flex flex-wrap items-center gap-2">
											<Modal.Heading>{resolvedMaterial.title}</Modal.Heading>
											<Chip
												color={getMaterialSourceKindColor(resolvedMaterial.source_kind)}
												size="sm"
												variant="soft"
											>
												<Chip.Label>
													{getMaterialSourceKindLabel(resolvedMaterial.source_kind)}
												</Chip.Label>
											</Chip>
											<Chip
												color={getMaterialIngestStatusColor(resolvedMaterial.ingest_status)}
												size="sm"
												variant="soft"
											>
												<Chip.Label>
													{getMaterialIngestStatusLabel(resolvedMaterial.ingest_status)}
												</Chip.Label>
											</Chip>
											{isRefreshingPendingMaterial ? (
												<span className="text-neutral-gray-500 text-xs">최신 상태 확인 중</span>
											) : null}
										</div>
										<p className="text-neutral-gray-500 text-sm">
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
										<Card className="border-border-subtle bg-surface-muted border">
											<Card.Content className="text-neutral-gray-500 space-y-2 py-4 text-sm">
												<p className="text-neutral-text font-medium">자료 정보</p>
												<p>유형 {getMaterialFileTypeLabel(resolvedMaterial)}</p>
												<p>출처 {getMaterialDisplayName(resolvedMaterial)}</p>
												<p>
													크기{' '}
													{resolvedMaterial.file
														? formatMaterialFileSize(resolvedMaterial.file.file_size)
														: '링크 자료'}
												</p>
											</Card.Content>
										</Card>
										<Card className="border-border-subtle bg-surface-muted border">
											<Card.Content className="text-neutral-gray-500 space-y-2 py-4 text-sm">
												<p className="text-neutral-text font-medium">분석 결과</p>
												<p>
													상태 {getMaterialIngestStatusLabel(resolvedMaterial.ingest_status)}
												</p>
												<p>
													{getMaterialIngestStatusDescription(resolvedMaterial.ingest_status)}
												</p>
												<p>핵심 개념 {resolvedMaterial.scope_candidates.length}개</p>
												{isIngestFailed ? (
													<div
														className="space-y-1 rounded-lg border border-amber-200
															bg-amber-50/70 p-3 text-amber-900"
													>
														<p className="font-medium">자료 분석에 실패했습니다</p>
														<p>{ingestFailureMessage}</p>
														<p className="text-amber-800">
															파일을 확인한 뒤 다시 적재해주세요.
														</p>
													</div>
												) : (
													<p>오류 없음</p>
												)}
											</Card.Content>
										</Card>
										<Card className="border-border-subtle bg-surface-muted border">
											<Card.Content className="text-neutral-gray-500 space-y-2 py-4 text-sm">
												<p className="text-neutral-text font-medium">설명</p>
												<p>{resolvedMaterial.description ?? '설명 없음'}</p>
											</Card.Content>
										</Card>
									</div>

									<div className="space-y-3">
										<div className="flex flex-wrap items-start justify-between gap-3">
											<div className="space-y-1">
												<h3 className="text-neutral-text text-base font-semibold">핵심 개념</h3>
												<p className="text-neutral-gray-500 text-sm">
													핵심 개념은 이후 Bloom 단계 기반 시험문제 생성 시 주요 출제 소재로
													활용될 수 있습니다.
												</p>
											</div>
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
										{resolvedMaterial.ingest_status === 'pending' ? (
											<EmptyState
												className="border-border-subtle flex w-full flex-col items-center
													justify-center rounded-xl border border-dashed py-10 text-center"
											>
												<span className="text-neutral-gray-500 text-sm">
													핵심 개념을 분석 중입니다. 잠시 후 자동으로 갱신됩니다.
												</span>
											</EmptyState>
										) : resolvedMaterial.scope_candidates.length === 0 ? (
											<EmptyState
												className="border-border-subtle flex w-full flex-col items-center
													justify-center rounded-xl border border-dashed py-10 text-center"
											>
												{isIngestFailed ? (
													<span className="text-neutral-gray-500 text-sm">
														분석 실패로 핵심 개념을 표시할 수 없습니다. 위 분석 결과 안내를
														확인해주세요.
													</span>
												) : (
													<span className="text-neutral-gray-500 text-sm">
														추출된 핵심 개념이 없습니다.
													</span>
												)}
											</EmptyState>
										) : (
											<div className="space-y-3">
												{resolvedMaterial.scope_candidates.map((candidate, index) => (
													<Card
														key={`${candidate.label}-${index}`}
														className="border-border-subtle bg-surface border"
													>
														<Card.Content className="space-y-4 py-4">
															<div className="space-y-1">
																<p className="text-xs font-medium text-emerald-700">
																	핵심 개념 이름/분류
																</p>
																<h4
																	className="text-neutral-text text-base
																		font-semibold"
																>
																	{candidate.label}
																</h4>
															</div>
															<div className="space-y-1">
																<p className="text-neutral-gray-500 text-xs font-medium">
																	개념 설명
																</p>
																<p className="text-neutral-gray-700 text-sm leading-6">
																	{candidate.scope_text}
																</p>
															</div>
															<div className="space-y-2">
																<p className="text-neutral-gray-500 text-xs font-medium">
																	관련 키워드
																</p>
																<div className="flex flex-wrap gap-2">
																	{candidate.keywords.length === 0 ? (
																		<span className="text-neutral-gray-500 text-sm">
																			관련 키워드 없음
																		</span>
																	) : (
																		candidate.keywords.map((keyword) => (
																			<Chip
																				key={keyword}
																				size="sm"
																				variant="soft"
																			>
																				<Chip.Label>{keyword}</Chip.Label>
																			</Chip>
																		))
																	)}
																</div>
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
