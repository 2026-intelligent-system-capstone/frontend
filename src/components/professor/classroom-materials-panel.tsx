'use client';

import type { SVGProps } from 'react';

import { Button, ButtonGroup, Card, Chip, Skeleton, Table, Tooltip } from '@heroui/react';

import type { ClassroomMaterial } from '@/types/classroom';

import { MaterialUploadModal } from '@/components/professor/material-upload-modal';
import { classroomsApi } from '@/lib/api/classrooms';
import { SEOUL_TIME_ZONE, dayjs } from '@/lib/dayjs';
import { useDeleteClassroomMaterial } from '@/lib/hooks/use-classrooms';

interface ClassroomMaterialsPanelProps {
	classroomId: string;
	materials: ClassroomMaterial[];
	isLoading: boolean;
	isError: boolean;
	canManageMaterials: boolean;
}

const formatDateTime = (value: string | null) => {
	if (!value) {
		return '업로드 시각 없음';
	}

	return dayjs.utc(value).tz(SEOUL_TIME_ZONE).format('YYYY.MM.DD HH:mm');
};

const formatFileSize = (value: number) => {
	if (value < 1024) {
		return `${value} B`;
	}
	if (value < 1024 * 1024) {
		return `${(value / 1024).toFixed(1)} KB`;
	}

	return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileChipColor = (extension: string) => {
	switch (extension.toLowerCase()) {
		case 'pdf':
			return 'danger';
		case 'ppt':
		case 'pptx':
			return 'accent';
		case 'doc':
		case 'docx':
			return 'warning';
		default:
			return 'default';
	}
};

const PdfIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path
			d="M7 3.75h7.5L19.25 8.5V19A2.25 2.25 0 0 1 17 21.25H7A2.25 2.25 0 0 1 4.75 19V6A2.25 2.25 0 0 1 7 3.75Z"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="M14.5 3.75V8.5h4.75"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="M7.75 15.75h1.1a1.4 1.4 0 1 0 0-2.8h-1.1v4.3"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="M12 17.25c.9 0 1.6-.7 1.6-1.55v-1.2c0-.85-.7-1.55-1.6-1.55h-.75v4.3H12Z"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="M16.25 17.25v-4.3h2.25"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="M16.25 15.1h1.8"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
	</svg>
);

const FileIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path
			d="M7 3.75h7.5L19.25 8.5V19A2.25 2.25 0 0 1 17 21.25H7A2.25 2.25 0 0 1 4.75 19V6A2.25 2.25 0 0 1 7 3.75Z"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="M14.5 3.75V8.5h4.75"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path d="M8.75 13.25h6.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path d="M8.75 16.75h6.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);

const DownloadIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path d="M12 4.75v9.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path
			d="m8.25 10.75 3.75 3.75 3.75-3.75"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path d="M5.75 18.25h12.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);

const TrashIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path d="M9.25 4.75h5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path d="M5.75 7.75h12.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path
			d="M8.25 7.75v10a1.5 1.5 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5v-10"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path d="M10.25 10.5v5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path d="M13.75 10.5v5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);

export function ClassroomMaterialsPanel({
	classroomId,
	materials,
	isLoading,
	isError,
	canManageMaterials,
}: ClassroomMaterialsPanelProps) {
	const { mutate: deleteMaterial, isPending: deletePending } = useDeleteClassroomMaterial(classroomId);

	const handleDownload = (materialId: string) => {
		window.open(classroomsApi.getMaterialDownloadUrl(classroomId, materialId), '_self');
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-lg font-semibold text-slate-900">강의 자료</h2>
					<p className="mt-1 text-sm text-slate-500">자료는 현재 강의실 단위로 업로드되고 관리됩니다.</p>
				</div>
				{canManageMaterials ? <MaterialUploadModal classroomId={classroomId} /> : null}
			</div>

			{isLoading && materials.length === 0 ? (
				<div className="space-y-3">
					{Array.from({ length: 2 }).map((_, index) => (
						<Card key={index} className="border border-slate-200 bg-slate-50">
							<Card.Content className="space-y-4 py-4">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div className="space-y-2">
										<div className="flex gap-2">
											<Skeleton className="h-6 w-16 rounded-full" />
											<Skeleton className="h-6 w-14 rounded-full" />
										</div>
										<Skeleton className="h-6 w-40 rounded-lg" />
										<Skeleton className="h-4 w-64 rounded-lg" />
									</div>
									<Skeleton className="h-8 w-20 rounded-lg" />
								</div>
								<div className="grid gap-2 md:grid-cols-3">
									<Skeleton className="h-4 w-full rounded-lg" />
									<Skeleton className="h-4 w-full rounded-lg" />
									<Skeleton className="h-4 w-full rounded-lg" />
								</div>
							</Card.Content>
						</Card>
					))}
				</div>
			) : isError ? (
				<p className="text-sm text-red-600">자료 목록을 불러오지 못했습니다.</p>
			) : materials.length === 0 ? (
				<Card className="border border-dashed border-slate-200 bg-slate-50">
					<Card.Content className="py-8 text-center text-sm text-slate-500">
						등록된 자료가 없습니다.
					</Card.Content>
				</Card>
			) : (
				<Table>
					<Table.ScrollContainer>
						<Table.Content aria-label="강의 자료 목록" className="min-w-[960px] table-fixed">
							<Table.Header>
								<Table.Column isRowHeader className="w-[96px]">주차</Table.Column>
								<Table.Column className="w-[240px]">제목</Table.Column>
								<Table.Column className="w-[260px]">파일</Table.Column>
								<Table.Column className="w-[110px]">크기</Table.Column>
								<Table.Column className="w-[160px]">업로드 시각</Table.Column>
								<Table.Column className="w-[94px]">작업</Table.Column>
							</Table.Header>
							<Table.Body>
								{materials.map((material) => {
									const extension = material.file.file_extension.toUpperCase();
									const fileChipColor = getFileChipColor(material.file.file_extension);

									return (
										<Table.Row key={material.id}>
											<Table.Cell>
												<Chip color="accent" size="sm" variant="soft">
													<Chip.Label>{material.week}주차</Chip.Label>
												</Chip>
											</Table.Cell>
											<Table.Cell>
												<div className="w-[240px] space-y-1 overflow-hidden">
													<p className="truncate font-medium text-slate-900">{material.title}</p>
													<p className="truncate text-sm text-slate-600">
														{material.description ?? '설명 없음'}
													</p>
												</div>
											</Table.Cell>
											<Table.Cell>
												<div className="flex w-[260px] items-center gap-2 overflow-hidden">
													<Chip className="shrink-0" color={fileChipColor} size="sm" variant="soft">
														{material.file.file_extension.toLowerCase() === 'pdf' ? (
															<PdfIcon className="size-3.5" />
														) : (
															<FileIcon className="size-3.5" />
														)}
														<Chip.Label>{extension}</Chip.Label>
													</Chip>
													<p className="truncate text-sm font-medium text-slate-900">
														{material.file.file_name}
													</p>
												</div>
											</Table.Cell>
											<Table.Cell>
												<span className="block w-[110px] truncate font-medium text-slate-700">
													{formatFileSize(material.file.file_size)}
												</span>
											</Table.Cell>
											<Table.Cell>
												<div className="w-[160px] space-y-1 overflow-hidden text-sm">
													<p className="truncate font-medium text-slate-700">
														{formatDateTime(material.uploaded_at)}
													</p>
												</div>
											</Table.Cell>
											<Table.Cell>
												<div className="w-[94px] overflow-hidden">
													<ButtonGroup size="md">
														<Button
															aria-label={`${material.title} 다운로드`}
															isIconOnly
															variant="secondary"
															onPress={() => handleDownload(material.id)}
														>
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
																onPress={() => deleteMaterial(material.id)}
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
			)}
		</div>
	);
}
