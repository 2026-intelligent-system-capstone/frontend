'use client';

import { Button, Card, Skeleton } from '@heroui/react';

import type { ClassroomMaterial } from '@/types/classroom';

import { classroomsApi } from '@/lib/api/classrooms';
import { SEOUL_TIME_ZONE, dayjs } from '@/lib/dayjs';
import { useDeleteClassroomMaterial } from '@/lib/hooks/use-classrooms';

import { MaterialUploadModal } from '@/components/professor/material-upload-modal';

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
				<div className="grid gap-3">
					{materials.map((material) => (
						<Card key={material.id} className="border border-slate-200 bg-slate-50">
							<Card.Content className="space-y-4 py-4">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div className="space-y-2">
										<div className="flex flex-wrap items-center gap-2 text-xs font-medium">
											<span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
												{material.week}주차
											</span>
											<span className="rounded-full bg-slate-200 px-2.5 py-1 text-slate-700">
												{material.file.file_extension.toUpperCase()}
											</span>
										</div>
										<p className="text-base font-semibold text-slate-900">{material.title}</p>
										<p className="text-sm text-slate-600">{material.description ?? '설명 없음'}</p>
									</div>
									<div className="flex flex-wrap gap-2">
										<Button
											size="sm"
											variant="secondary"
											onPress={() => handleDownload(material.id)}
										>
											다운로드
										</Button>
										{canManageMaterials ? (
											<Button
												size="sm"
												variant="danger-soft"
												isPending={deletePending}
												onPress={() => deleteMaterial(material.id)}
											>
												삭제
											</Button>
										) : null}
									</div>
								</div>

								<div className="grid gap-2 text-sm text-slate-600 md:grid-cols-3">
									<p>파일명: {material.file.file_name}</p>
									<p>크기: {formatFileSize(material.file.file_size)}</p>
									<p>업로드: {formatDateTime(material.uploaded_at)}</p>
								</div>
							</Card.Content>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
