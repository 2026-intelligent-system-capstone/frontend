'use client';

import { Button, ButtonGroup, Chip, EmptyState, Table, Tooltip } from '@heroui/react';

import type { ClassroomMaterial } from '@/types/classroom';

import { classroomMaterialsApi } from '@/lib/api/classroom-materials';
import {
	formatMaterialDateTime,
	formatMaterialFileSize,
	getMaterialFileChipColor,
	getMaterialIngestStatusColor,
	getMaterialIngestStatusLabel,
} from '@/lib/classrooms/material-presentation';

import { DownloadIcon, RefreshIcon, TrashIcon } from '@/components/shared/icons/action-icons';
import { FileIcon, PdfIcon } from '@/components/shared/icons/file-icons';

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
						<Table.Column className="w-24">파일 타입</Table.Column>
						<Table.Column className="w-28">적재 상태</Table.Column>
						<Table.Column className="w-24">크기</Table.Column>
						<Table.Column className="w-40">업로드 시각</Table.Column>
						<Table.Column className="w-32">작업</Table.Column>
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<EmptyState className="flex w-full flex-col items-center justify-center py-10 text-center">
								<span className="text-sm text-slate-500">등록된 자료가 없습니다.</span>
							</EmptyState>
						)}
					>
						{materials.map((material) => {
							const extension = material.file.file_extension.toUpperCase();
							const fileChipColor = getMaterialFileChipColor(material.file.file_extension);
							const isProcessing = processingMaterialId === material.id && reingestPending;

							return (
								<Table.Row key={material.id}>
									<Table.Cell>
										<button
											type="button"
											className="flex w-full min-w-0 cursor-pointer flex-col space-y-1 overflow-hidden text-left"
											onClick={() => onSelectMaterial(material.id)}
										>
											<p className="truncate font-medium text-slate-900 underline-offset-2 hover:underline">
												{material.title}
											</p>
											<p className="truncate text-sm text-slate-600">{material.description ?? '설명 없음'}</p>
										</button>
									</Table.Cell>
									<Table.Cell>
										<div className="w-24 overflow-hidden">
											<Chip className="max-w-full" color={fileChipColor} size="sm" variant="soft">
												{material.file.file_extension.toLowerCase() === 'pdf' ? (
													<PdfIcon className="size-3.5" />
												) : (
													<FileIcon className="size-3.5" />
												)}
												<Chip.Label>{extension}</Chip.Label>
											</Chip>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div className="w-28 overflow-hidden">
											<Chip color={getMaterialIngestStatusColor(material.ingest_status)} size="sm" variant="soft">
												<Chip.Label>{getMaterialIngestStatusLabel(material.ingest_status)}</Chip.Label>
											</Chip>
										</div>
									</Table.Cell>
									<Table.Cell>
										<span className="block w-24 truncate font-medium text-slate-700">
											{formatMaterialFileSize(material.file.file_size)}
										</span>
									</Table.Cell>
									<Table.Cell>
										<div className="w-40 overflow-hidden text-sm">
											<p className="truncate font-medium text-slate-700">
												{formatMaterialDateTime(material.uploaded_at)}
											</p>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div className="w-32 overflow-hidden">
											<ButtonGroup size="md">
												{canManageMaterials ? (
													<Button
														aria-label={`${material.title} 다시 적재`}
														isIconOnly
														isPending={isProcessing}
														variant="secondary"
														onPress={() => void onReingest(material.id)}
													>
														<Tooltip delay={0}>
															<Tooltip.Trigger aria-label="다시 적재" className="contents">
																<RefreshIcon className="size-5" />
															</Tooltip.Trigger>
															<Tooltip.Content showArrow>
																<Tooltip.Arrow />
																<p>다시 적재</p>
															</Tooltip.Content>
														</Tooltip>
													</Button>
												) : null}
												<Button
													aria-label={`${material.title} 다운로드`}
													isIconOnly
													variant="secondary"
													onPress={() => handleDownload(material.id)}
												>
													{canManageMaterials ? <ButtonGroup.Separator /> : null}
													<Tooltip delay={0}>
														<Tooltip.Trigger aria-label="다운로드" className="contents">
															<DownloadIcon className="size-5" />
														</Tooltip.Trigger>
														<Tooltip.Content showArrow>
															<Tooltip.Arrow />
															<p>다운로드</p>
														</Tooltip.Content>
													</Tooltip>
												</Button>
												{canManageMaterials ? (
													<Button
														aria-label={`${material.title} 삭제`}
														isIconOnly
														isPending={deletePending}
														variant="danger-soft"
														onPress={() => onDelete(material.id)}
													>
														<ButtonGroup.Separator />
														<Tooltip delay={0}>
															<Tooltip.Trigger aria-label="삭제" className="contents">
																<TrashIcon className="size-5" />
															</Tooltip.Trigger>
															<Tooltip.Content showArrow>
																<Tooltip.Arrow />
																<p>삭제</p>
															</Tooltip.Content>
														</Tooltip>
													</Button>
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
