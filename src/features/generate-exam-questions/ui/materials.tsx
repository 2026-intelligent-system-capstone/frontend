import {
	type ClassroomMaterial,
	getMaterialDisplayName,
	getMaterialIngestStatusColor,
	getMaterialIngestStatusLabel,
	getMaterialSourceKindColor,
	getMaterialSourceKindLabel,
} from '@/entities/classroom-material';
import { Button, Checkbox, Chip } from '@heroui/react';

interface GenerateExamQuestionsMaterialsProps {
	hasCompletedMaterials: boolean;
	materials: ClassroomMaterial[];
	selectedConceptKeys: string[];
	selectedMaterialIds: string[];
	onConceptToggle: (conceptKey: string) => void;
	onMaterialToggle: (material: ClassroomMaterial) => void;
}

const createScopeCandidateKey = (materialId: string, candidateIndex: number): string => {
	return `${materialId}:${candidateIndex}`;
};

export function GenerateExamQuestionsMaterials({
	hasCompletedMaterials,
	materials,
	selectedConceptKeys,
	selectedMaterialIds,
	onConceptToggle,
	onMaterialToggle,
}: GenerateExamQuestionsMaterialsProps) {
	const selectedMaterialCount = selectedMaterialIds.length;
	const selectedConceptCount = selectedConceptKeys.length;

	return (
		<div className="rounded-large border-border-subtle bg-surface-muted space-y-4 border p-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0">
					<p className="text-neutral-text text-base font-semibold">자료 및 포함 개념 선택</p>
					<p className="text-neutral-gray-500 mt-1 max-w-2xl text-sm leading-6">
						자료를 선택하면 추출된 개념이 모두 포함됩니다. 제외할 개념은 한 번 더 눌러 해제하세요.
					</p>
				</div>
				<Chip color="success" size="sm" variant="soft" className="shrink-0 self-start rounded-full">
					<Chip.Label>
						선택된 자료 {selectedMaterialCount}개 · 포함 개념 {selectedConceptCount}개
					</Chip.Label>
				</Chip>
			</div>

			<div className="grid gap-3">
				{materials.map((material) => {
					const isMaterialDisabled = material.ingest_status !== 'completed';

					return (
						<div
							key={material.id}
							className={`rounded-large border-border-subtle bg-surface border p-4 shadow-sm
							transition-shadow ${isMaterialDisabled ? 'opacity-75' : 'hover:shadow-md'}`}
						>
							<Checkbox
								className="w-full items-start justify-between gap-3"
								isDisabled={isMaterialDisabled}
								isSelected={selectedMaterialIds.includes(material.id)}
								onChange={() => onMaterialToggle(material)}
							>
								<Checkbox.Control className="mt-0.5 shrink-0">
									<Checkbox.Indicator />
								</Checkbox.Control>
								<Checkbox.Content className="min-w-0 flex-1">
									<div className="flex min-w-0 flex-wrap items-center gap-2">
										<p className="text-neutral-text truncate text-sm font-semibold">
											{material.title}
										</p>
										<Chip
											color={getMaterialSourceKindColor(material.source_kind)}
											size="sm"
											variant="soft"
										>
											<Chip.Label>{getMaterialSourceKindLabel(material.source_kind)}</Chip.Label>
										</Chip>
										<Chip
											color={getMaterialIngestStatusColor(material.ingest_status)}
											size="sm"
											variant="soft"
										>
											<Chip.Label>
												{getMaterialIngestStatusLabel(material.ingest_status)}
											</Chip.Label>
										</Chip>
									</div>
									<p className="text-neutral-gray-500 mt-1 truncate text-xs">
										{getMaterialDisplayName(material)}
									</p>
									{material.ingest_error ? (
										<p className="text-danger-text mt-1 text-xs">{material.ingest_error}</p>
									) : null}
								</Checkbox.Content>
							</Checkbox>

							<div className="border-border-subtle mt-4 border-t pt-4">
								<div className="mb-3 flex items-center justify-between gap-3">
									<p className="text-neutral-text text-xs font-semibold tracking-wide uppercase">
										포함 개념
									</p>
									<p className="text-neutral-gray-500 text-xs">
										{material.scope_candidates.length}개 후보
									</p>
								</div>

								{material.scope_candidates.length > 0 ? (
									<div
										aria-label={`${material.title} 포함 개념`}
										className="flex min-w-0 flex-wrap gap-2"
										role="group"
									>
										{material.scope_candidates.map((candidate, index) => {
											const conceptKey = createScopeCandidateKey(material.id, index);
											const isConceptSelected = selectedConceptKeys.includes(conceptKey);
											const conceptAriaLabel = isConceptSelected
												? `${material.title} 자료의 ${candidate.label} 개념 포함됨. 눌러서 제외`
												: `${material.title} 자료의 ${candidate.label} 개념 제외됨. 눌러서 포함`;

											return (
												<Button
													key={conceptKey}
													aria-label={conceptAriaLabel}
													aria-pressed={isConceptSelected}
													className={`focus-visible:ring-success/40 max-w-full min-w-0
														rounded-full border text-left whitespace-normal transition-all
														focus-visible:ring-2 ${
															isConceptSelected
																? 'border-success/60 ring-success/30 shadow-sm ring-1'
																: `border-border-subtle hover:border-success/40
																	hover:bg-success/5`
														} data-[disabled]:border-border-subtle
														data-[disabled]:opacity-45`}
													isDisabled={isMaterialDisabled}
													size="sm"
													type="button"
													variant={isConceptSelected ? 'primary' : 'secondary'}
													onPress={() => onConceptToggle(conceptKey)}
												>
													{candidate.label}
												</Button>
											);
										})}
									</div>
								) : (
									<p
										className="text-neutral-gray-500 rounded-medium border-border-subtle
											bg-surface-muted border p-3 text-xs leading-5"
									>
										이 자료에는 추출된 개념 후보가 없습니다. 필요한 범위는 추가 포함 내용에
										작성하세요.
									</p>
								)}
							</div>
						</div>
					);
				})}
			</div>
			{!hasCompletedMaterials ? (
				<p className="text-warning-text rounded-medium border-warning/20 bg-warning/5 border p-3 text-xs">
					아직 적재 완료된 강의 자료가 없습니다. 자료 적재가 완료된 뒤 다시 시도하세요.
				</p>
			) : null}
		</div>
	);
}
