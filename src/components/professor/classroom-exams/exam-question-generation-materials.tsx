import { Button, Checkbox, Chip, Label } from '@heroui/react';

import type { ClassroomMaterial } from '@/types/classroom';

import { toggleStringValue } from '@/lib/classrooms/exam-presentation';
import { getMaterialIngestStatusColor, getMaterialIngestStatusLabel } from '@/lib/classrooms/material-presentation';

interface ExamQuestionGenerationMaterialsProps {
	materials: ClassroomMaterial[];
	selectedMaterialIds: string[];
	hasCompletedMaterials: boolean;
	onSelectedMaterialIdsChange: (nextIds: string[]) => void;
	onAppendScopeCandidate: (candidateText: string) => void;
}

export function ExamQuestionGenerationMaterials({
	materials,
	selectedMaterialIds,
	hasCompletedMaterials,
	onSelectedMaterialIdsChange,
	onAppendScopeCandidate,
}: ExamQuestionGenerationMaterialsProps) {
	return (
		<div className="rounded-large space-y-3 border border-slate-200 bg-slate-50 p-4">
			<div>
				<p className="text-sm font-medium text-slate-800">참고 자료 선택</p>
				<p className="mt-1 text-xs text-slate-500">적재 완료된 자료를 선택하면 RAG 검색 품질이 좋아집니다.</p>
			</div>
			<div className="grid gap-3">
				{materials.map((material) => (
					<div key={material.id} className="rounded-medium border border-slate-200 bg-white p-3">
						<Checkbox
							className="w-full items-start justify-between gap-3"
							isDisabled={material.ingest_status !== 'completed'}
							isSelected={selectedMaterialIds.includes(material.id)}
							onChange={() =>
								onSelectedMaterialIdsChange(toggleStringValue(selectedMaterialIds, material.id))
							}
						>
							<Checkbox.Control className="mt-0.5 shrink-0">
								<Checkbox.Indicator />
							</Checkbox.Control>
							<Checkbox.Content className="min-w-0 flex-1">
								<div className="flex min-w-0 flex-wrap items-center gap-2">
									<Label className="truncate text-sm font-medium text-slate-900">
										{material.title}
									</Label>
									<Chip
										color={getMaterialIngestStatusColor(material.ingest_status)}
										size="sm"
										variant="soft"
									>
										<Chip.Label>{getMaterialIngestStatusLabel(material.ingest_status)}</Chip.Label>
									</Chip>
								</div>
								<p className="mt-1 truncate text-xs text-slate-500">{material.file.file_name}</p>
								{material.ingest_error ? (
									<p className="mt-1 text-xs text-red-600">{material.ingest_error}</p>
								) : null}
							</Checkbox.Content>
						</Checkbox>
						{material.scope_candidates.length > 0 ? (
							<div className="mt-3 flex flex-wrap gap-2">
								{material.scope_candidates.map((candidate) => (
									<Button
										key={`${material.id}-${candidate.label}`}
										size="sm"
										variant="secondary"
										onPress={() => onAppendScopeCandidate(candidate.scope_text)}
									>
										{candidate.label}
									</Button>
								))}
							</div>
						) : null}
					</div>
				))}
			</div>
			{!hasCompletedMaterials ? (
				<p className="text-xs text-amber-600">
					아직 적재 완료된 강의 자료가 없습니다. 자료 적재가 완료된 뒤 다시 시도하세요.
				</p>
			) : null}
		</div>
	);
}
