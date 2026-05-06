import {
	type ClassroomMaterial,
	getMaterialDisplayName,
	getMaterialIngestStatusColor,
	getMaterialIngestStatusLabel,
	getMaterialSourceKindColor,
	getMaterialSourceKindLabel,
} from '@/entities/classroom-material';
import { Button, Checkbox, Chip, Description, Label, TextArea, TextField } from '@heroui/react';

interface GenerateExamQuestionsScopeSectionProps {
	additionalScopeText: string;
	hasCompletedMaterials: boolean;
	materials: ClassroomMaterial[];
	selectedConceptKeys: string[];
	selectedMaterialIds: string[];
	onAdditionalScopeTextChange: (value: string) => void;
	onConceptToggle: (conceptKey: string) => void;
	onMaterialToggle: (material: ClassroomMaterial) => void;
}

const createScopeCandidateKey = (materialId: string, candidateIndex: number): string => {
	return `${materialId}:${candidateIndex}`;
};

export function GenerateExamQuestionsScopeSection({
	additionalScopeText,
	hasCompletedMaterials,
	materials,
	selectedConceptKeys,
	selectedMaterialIds,
	onAdditionalScopeTextChange,
	onConceptToggle,
	onMaterialToggle,
}: GenerateExamQuestionsScopeSectionProps) {
	const selectedMaterialCount = selectedMaterialIds.length;
	const selectedConceptCount = selectedConceptKeys.length;
	const hasAdditionalScopeText = additionalScopeText.trim().length > 0;
	const hasDesignedScope = selectedConceptCount > 0 || hasAdditionalScopeText;

	return (
		<section className="border-border-subtle bg-surface-raised shadow-card rounded-large overflow-hidden border">
			<header className="border-border-subtle bg-surface border-b p-5">
				<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
					<div className="min-w-0">
						<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.08em] uppercase">
							Step 1 · Scope Design
						</p>
						<h3 className="text-neutral-text mt-2 text-xl font-semibold tracking-[-0.01em]">범위 설계</h3>
						<p className="text-neutral-gray-500 mt-2 max-w-2xl text-sm leading-6">
							선택한 자료의 포함 개념과 직접 작성한 추가 내용이 하나의 AI 생성 범위로 합쳐집니다.
						</p>
					</div>
					<div className="flex shrink-0 flex-wrap gap-2">
						<Chip color="success" size="sm" variant="soft" className="rounded-full">
							<Chip.Label>
								자료 {selectedMaterialCount}개 · 개념 {selectedConceptCount}개
							</Chip.Label>
						</Chip>
						<Chip
							color={hasAdditionalScopeText ? 'success' : 'default'}
							size="sm"
							variant="soft"
							className="rounded-full"
						>
							<Chip.Label>직접 입력 {hasAdditionalScopeText ? '작성됨' : '없음'}</Chip.Label>
						</Chip>
					</div>
				</div>
			</header>

			<div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.85fr)] lg:items-start">
				<div className="space-y-4">
					<div>
						<p className="text-neutral-text text-sm font-semibold">자료 및 포함 개념 선택</p>
						<p className="text-neutral-gray-500 mt-1 text-xs leading-5">
							자료를 선택하면 추출된 개념이 모두 포함됩니다. 제외할 개념은 한 번 더 눌러 해제하세요.
						</p>
					</div>

					<div className="grid gap-3">
						{materials.map((material) => {
							const isMaterialDisabled = material.ingest_status !== 'completed';
							const isMaterialSelected = selectedMaterialIds.includes(material.id);

							return (
								<div
									key={material.id}
									className={`rounded-large bg-surface border p-4 shadow-sm transition-all ${
										isMaterialSelected
											? 'border-success/50 bg-success/5 ring-success/20 ring-1'
											: 'border-border-subtle'
									} ${isMaterialDisabled ? 'opacity-75' : 'hover:shadow-md'}`}
								>
									<Checkbox
										className="w-full items-start justify-between gap-3"
										isDisabled={isMaterialDisabled}
										isSelected={isMaterialSelected}
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
													<Chip.Label>
														{getMaterialSourceKindLabel(material.source_kind)}
													</Chip.Label>
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

									<div
										className="border-border-subtle bg-surface-muted/70 rounded-medium mt-4 border
											p-3"
									>
										<div className="mb-3 flex items-center justify-between gap-3">
											<p
												className="text-neutral-text text-xs font-semibold tracking-wide
													uppercase"
											>
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
																rounded-full border text-left whitespace-normal
																transition-all focus-visible:ring-2 ${
																	isConceptSelected
																		? `border-success/60 ring-success/30 shadow-sm
																			ring-1`
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
													bg-surface border p-3 text-xs leading-5"
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
						<p
							className="text-warning-text rounded-medium border-warning/20 bg-warning/5 border p-3
								text-xs"
						>
							아직 적재 완료된 강의 자료가 없습니다. 자료 적재가 완료된 뒤 다시 시도하세요.
						</p>
					) : null}
				</div>

				<aside className="space-y-4">
					<div className="rounded-large border-border-subtle bg-surface space-y-4 border p-4 shadow-sm">
						<div>
							<p className="text-neutral-text text-sm font-semibold">추가 포함 내용</p>
							<p className="text-neutral-gray-500 mt-1 text-xs leading-5">
								자료에서 선택한 개념과 함께 AI에게 전달됩니다.
							</p>
						</div>
						<TextField className="w-full" name="additional_scope_text">
							<Label>추가 포함 내용</Label>
							<TextArea
								className="min-h-32"
								placeholder="예: 회귀와 분류 비교를 강조하고, 실제 데이터셋 적용 사례를 포함해주세요."
								value={additionalScopeText}
								onChange={(event) => onAdditionalScopeTextChange(event.target.value)}
							/>
							<Description>
								선택한 자료·개념과 함께 하나의 생성 범위로 합쳐집니다. 반드시 포함할 사례, 강조점, 제외
								조건을 작성하세요.
							</Description>
						</TextField>
					</div>

					<div className="rounded-large border-border-subtle bg-surface-muted space-y-3 border p-4">
						<div>
							<p className="text-neutral-text text-sm font-semibold">현재 범위 요약</p>
							<p className="text-neutral-gray-500 mt-1 text-xs leading-5">
								선택한 항목이 제출 시 하나의 `scope_text`로 합쳐집니다.
							</p>
						</div>
						<dl className="grid grid-cols-3 gap-2 text-center text-xs">
							<div className="rounded-medium border-border-subtle bg-surface border p-2">
								<dt className="text-neutral-gray-500">자료</dt>
								<dd className="text-neutral-text mt-1 text-sm font-semibold">
									{selectedMaterialCount}개
								</dd>
							</div>
							<div className="rounded-medium border-border-subtle bg-surface border p-2">
								<dt className="text-neutral-gray-500">개념</dt>
								<dd className="text-neutral-text mt-1 text-sm font-semibold">
									{selectedConceptCount}개
								</dd>
							</div>
							<div className="rounded-medium border-border-subtle bg-surface border p-2">
								<dt className="text-neutral-gray-500">직접 입력</dt>
								<dd className="text-neutral-text mt-1 text-sm font-semibold">
									{hasAdditionalScopeText ? '있음' : '없음'}
								</dd>
							</div>
						</dl>
						<p
							className={`rounded-medium border p-3 text-xs leading-5 ${
								hasDesignedScope
									? 'border-success/20 bg-success/5 text-success-text'
									: 'border-warning/20 bg-warning/5 text-warning-text'
								}`}
						>
							{hasDesignedScope
								? '이 범위로 문항 생성을 준비합니다.'
								: '자료 개념을 선택하거나 추가 내용을 입력하세요.'}
						</p>
					</div>
				</aside>
			</div>
		</section>
	);
}
