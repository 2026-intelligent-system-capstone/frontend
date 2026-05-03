'use client';

import {
	type ClassroomMaterial,
	classroomMaterialsApi,
	formatMaterialDateTime,
	formatMaterialFileSize,
	getMaterialDisplayName,
	getMaterialFileChipColor,
	getMaterialFileTypeLabel,
	getMaterialIngestStatusColor,
	getMaterialIngestStatusDescription,
	getMaterialIngestStatusLabel,
	getMaterialSourceKindColor,
	getMaterialSourceKindLabel,
} from '@/entities/classroom-material';
import { DownloadIcon, RefreshIcon, TrashIcon } from '@/shared/ui/icons/action-icons';
import { FileIcon, LinkIcon, PdfIcon } from '@/shared/ui/icons/file-icons';
import { Button, ButtonGroup, Chip, EmptyState, Table, Tooltip } from '@heroui/react';

const DEFAULT_INGEST_ERROR_MESSAGE = '분석 원인을 확인할 수 없습니다. 다시 적재를 시도해주세요.';
const INGEST_ERROR_TOOLTIP_THRESHOLD = 48;

interface MaterialsTableProps {
	classroomId: string;
	materials: ClassroomMaterial[];
	canManageMaterials: boolean;
	processingMaterialId: string | null;
	reingestPending: boolean;
	deletePending: boolean;
	onSelectMaterial: (materialId: string) => void;
	onReingest: (materialId: string) => Promise<void>;
	onDelete: (materialId: string) => void;
}

export function MaterialsTable({
	classroomId,
	materials,
	canManageMaterials,
	processingMaterialId,
	reingestPending,
	deletePending,
	onSelectMaterial,
	onReingest,
	onDelete,
}: MaterialsTableProps) {
	const handleDownload = (materialId: string) => {
		window.open(classroomMaterialsApi.getMaterialDownloadUrl(classroomId, materialId), '_self');
	};

	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="강의 자료 목록" className="min-w-4xl table-fixed">
					<Table.Header>
						<Table.Column isRowHeader className="w-56">
							제목
						</Table.Column>
						<Table.Column className="w-24">자료 유형</Table.Column>
						<Table.Column className="w-32">분석 상태</Table.Column>
						<Table.Column className="w-24">크기</Table.Column>
						<Table.Column className="w-40">업로드 시각</Table.Column>
						<Table.Column className="w-32">작업</Table.Column>
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<EmptyState
								className="border-border-subtle bg-surface flex w-full flex-col items-center
									justify-center rounded-2xl border border-dashed py-10 text-center"
							>
								<span className="text-neutral-gray-500 text-sm">등록된 자료가 없습니다.</span>
							</EmptyState>
						)}
					>
						{materials.map((material) => {
							const fileTypeLabel = getMaterialFileTypeLabel(material);
							const fileChipColor = getMaterialFileChipColor(material);
							const isProcessing = processingMaterialId === material.id && reingestPending;
							const canDownload = material.source_kind === 'file';
							const hasFailedIngest = material.ingest_status === 'failed';
							const ingestErrorMessage = material.ingest_error ?? DEFAULT_INGEST_ERROR_MESSAGE;
							const shouldShowIngestErrorTooltip =
								ingestErrorMessage.length > INGEST_ERROR_TOOLTIP_THRESHOLD;

							return (
								<Table.Row key={material.id}>
									<Table.Cell>
										<button
											type="button"
											className="flex w-full min-w-0 cursor-pointer flex-col space-y-1
												overflow-hidden text-left"
											onClick={() => onSelectMaterial(material.id)}
										>
											<div className="flex min-w-0 flex-wrap items-center gap-2">
												<p
													className="text-neutral-text truncate font-medium underline-offset-2
														hover:underline"
												>
													{material.title}
												</p>
												<Chip
													color={getMaterialSourceKindColor(material.source_kind)}
													size="sm"
													variant="soft"
												>
													<Chip.Label>
														{getMaterialSourceKindLabel(material.source_kind)}
													</Chip.Label>
												</Chip>
											</div>
											<p className="text-neutral-gray-500 truncate text-sm">
												{material.description ?? getMaterialDisplayName(material)}
											</p>
										</button>
									</Table.Cell>
									<Table.Cell>
										<div className="flex w-24 flex-col gap-1 overflow-hidden">
											<Chip className="max-w-full" color={fileChipColor} size="sm" variant="soft">
												{material.source_kind === 'link' ? (
													<LinkIcon className="size-3.5" />
												) : material.file.file_extension.toLowerCase() === 'pdf' ? (
													<PdfIcon className="size-3.5" />
												) : (
													<FileIcon className="size-3.5" />
												)}
												<Chip.Label>{fileTypeLabel}</Chip.Label>
											</Chip>
											<p className="text-neutral-gray-500 truncate text-xs">
												{getMaterialDisplayName(material)}
											</p>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div className="flex w-32 flex-col gap-1 overflow-hidden">
											<Chip
												color={
													hasFailedIngest
														? 'danger'
														: getMaterialIngestStatusColor(material.ingest_status)
												}
												size="sm"
												variant="soft"
											>
												<Chip.Label>
													{hasFailedIngest
														? '분석 실패'
														: getMaterialIngestStatusLabel(material.ingest_status)}
												</Chip.Label>
											</Chip>
											{hasFailedIngest ? (
												<div className="flex flex-col gap-1">
													{shouldShowIngestErrorTooltip ? (
														<>
															<p
																className="line-clamp-2 text-xs font-medium break-words
																	text-red-600"
															>
																{ingestErrorMessage}
															</p>
															<Tooltip delay={0}>
																<Tooltip.Trigger>
																	<button
																		type="button"
																		aria-label="분석 실패 원인 전체 보기"
																		className="w-fit text-xs font-medium
																			text-red-700 underline underline-offset-2
																			transition-colors hover:text-red-800
																			focus-visible:outline
																			focus-visible:outline-2
																			focus-visible:outline-offset-2
																			focus-visible:outline-red-500"
																	>
																		전체 보기
																	</button>
																</Tooltip.Trigger>
																<Tooltip.Content showArrow className="max-w-xs">
																	<Tooltip.Arrow />
																	<p className="text-xs leading-relaxed">
																		{ingestErrorMessage}
																	</p>
																</Tooltip.Content>
															</Tooltip>
														</>
													) : (
														<p className="text-xs font-medium break-words text-red-600">
															{ingestErrorMessage}
														</p>
													)}
													{canManageMaterials ? (
														<p className="text-xs break-words text-amber-700">
															문제를 수정한 뒤 다시 적재를 눌러주세요.
														</p>
													) : null}
												</div>
											) : (
												<p className="text-neutral-gray-500 text-xs break-words">
													{getMaterialIngestStatusDescription(material.ingest_status)}
												</p>
											)}
										</div>
									</Table.Cell>
									<Table.Cell>
										<span className="text-neutral-gray-700 block w-24 truncate font-medium">
											{material.file ? formatMaterialFileSize(material.file.file_size) : '링크'}
										</span>
									</Table.Cell>
									<Table.Cell>
										<div className="w-40 overflow-hidden text-sm">
											<p className="text-neutral-gray-700 truncate font-medium">
												{formatMaterialDateTime(material.uploaded_at)}
											</p>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div className="w-32 overflow-hidden">
											<ButtonGroup size="md">
												{canManageMaterials ? (
													<Tooltip delay={0}>
														<Tooltip.Trigger>
															<Button
																aria-label={`${material.title} 다시 적재`}
																isIconOnly
																isPending={isProcessing}
																variant="secondary"
																onPress={() => void onReingest(material.id)}
															>
																<RefreshIcon className="size-5" />
															</Button>
														</Tooltip.Trigger>
														<Tooltip.Content showArrow>
															<Tooltip.Arrow />
															<p>다시 적재</p>
														</Tooltip.Content>
													</Tooltip>
												) : null}
												<Tooltip delay={0}>
													<Tooltip.Trigger>
														<Button
															aria-label={
																canDownload
																	? `${material.title} 다운로드`
																	: `${material.title} 링크 자료`
															}
															isDisabled={!canDownload}
															isIconOnly
															variant="secondary"
															onPress={() => {
																if (canDownload) {
																	handleDownload(material.id);
																}
															}}
														>
															{canManageMaterials ? <ButtonGroup.Separator /> : null}
															<DownloadIcon className="size-5" />
														</Button>
													</Tooltip.Trigger>
													<Tooltip.Content showArrow>
														<Tooltip.Arrow />
														<p>
															{canDownload
																? '다운로드'
																: '링크형 자료는 상세에서 확인하세요'}
														</p>
													</Tooltip.Content>
												</Tooltip>
												{canManageMaterials ? (
													<Tooltip delay={0}>
														<Tooltip.Trigger>
															<Button
																aria-label={`${material.title} 삭제`}
																isIconOnly
																isPending={deletePending}
																variant="danger-soft"
																onPress={() => onDelete(material.id)}
															>
																<ButtonGroup.Separator />
																<TrashIcon className="size-5" />
															</Button>
														</Tooltip.Trigger>
														<Tooltip.Content showArrow>
															<Tooltip.Arrow />
															<p>삭제</p>
														</Tooltip.Content>
													</Tooltip>
												) : null}
											</ButtonGroup>
										</div>
									</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table.Content>
			</Table.ScrollContainer>
		</Table>
	);
}
