'use client';

import { useState } from 'react';

import { Card, ErrorMessage, Skeleton } from '@heroui/react';

import { ApiClientError } from '@/types/api';
import type { ClassroomMaterial } from '@/types/classroom';

import { useDeleteClassroomMaterial, useReingestClassroomMaterial } from '@/lib/hooks/use-classrooms';

import { MaterialDetailModal } from '@/components/professor/classroom-materials/material-detail-modal';
import { MaterialsTable } from '@/components/professor/classroom-materials/materials-table';
import { MaterialUploadModal } from '@/components/professor/material-upload-modal';

interface ClassroomMaterialsPanelProps {
	classroomId: string;
	materials: ClassroomMaterial[];
	isLoading: boolean;
	isError: boolean;
	canManageMaterials: boolean;
	showActions?: boolean;
	actionWeek?: number;
}

export function ClassroomMaterialsPanel({
	classroomId,
	materials,
	isLoading,
	isError,
	canManageMaterials,
	showActions = true,
	actionWeek,
}: ClassroomMaterialsPanelProps) {
	const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
	const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);
	const [processingMaterialId, setProcessingMaterialId] = useState<string | null>(null);
	const { mutate: deleteMaterial, isPending: deletePending } = useDeleteClassroomMaterial(classroomId);
	const { mutateAsync: reingestMaterial, isPending: reingestPending } = useReingestClassroomMaterial(classroomId);
	const selectedMaterial = materials.find((material) => material.id === selectedMaterialId) ?? null;

	const handleReingest = async (materialId: string) => {
		setActionErrorMessage(null);
		setProcessingMaterialId(materialId);

		try {
			await reingestMaterial(materialId);
		} catch (error) {
			if (error instanceof ApiClientError) {
				setActionErrorMessage(error.message);
			} else {
				setActionErrorMessage('강의 자료를 다시 적재하지 못했습니다.');
			}
		} finally {
			setProcessingMaterialId(null);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-lg font-semibold text-slate-900">강의 자료</h2>
					<p className="mt-1 text-sm text-slate-500">주차 자료를 업로드하고 적재 상태를 관리합니다.</p>
				</div>
				{showActions && canManageMaterials && actionWeek ? (
					<MaterialUploadModal classroomId={classroomId} week={actionWeek} />
				) : null}
			</div>

			{actionErrorMessage ? <ErrorMessage>{actionErrorMessage}</ErrorMessage> : null}

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
				<ErrorMessage>자료 목록을 불러오지 못했습니다.</ErrorMessage>
			) : (
				<>
					<MaterialsTable
						canManageMaterials={canManageMaterials}
						classroomId={classroomId}
						deletePending={deletePending}
						materials={materials}
						onDelete={deleteMaterial}
						onReingest={handleReingest}
						onSelectMaterial={(materialId) => {
							setActionErrorMessage(null);
							setSelectedMaterialId(materialId);
						}}
						processingMaterialId={processingMaterialId}
						reingestPending={reingestPending}
					/>

					<MaterialDetailModal
						actionErrorMessage={actionErrorMessage}
						classroomId={classroomId}
						isOpen={selectedMaterial !== null}
						material={selectedMaterial}
						onOpenChange={(isOpen) => {
							if (!isOpen) {
								setSelectedMaterialId(null);
								setActionErrorMessage(null);
							}
						}}
					/>
				</>
			)}
		</div>
	);
}
