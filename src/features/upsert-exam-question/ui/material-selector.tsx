import {
	type ClassroomMaterial,
	getMaterialDisplayName,
	getMaterialSourceKindColor,
	getMaterialSourceKindLabel,
} from '@/entities/classroom-material';
import { Checkbox, Chip } from '@heroui/react';

interface UpsertExamQuestionMaterialSelectorProps {
	materials: ClassroomMaterial[];
	sourceMaterialIds: string[];
	onChange: (nextIds: string[]) => void;
}

const toggleMaterialId = (sourceMaterialIds: string[], materialId: string) => {
	return sourceMaterialIds.includes(materialId)
		? sourceMaterialIds.filter((id) => id !== materialId)
		: [...sourceMaterialIds, materialId];
};

export function UpsertExamQuestionMaterialSelector({
	materials,
	sourceMaterialIds,
	onChange,
}: UpsertExamQuestionMaterialSelectorProps) {
	return (
		<div className="rounded-large border-border-subtle bg-surface-muted space-y-3 border p-4">
			<div>
				<p className="text-neutral-text text-sm font-medium">연결 자료</p>
				<p className="text-neutral-gray-500 mt-1 text-xs">문항 생성에 참고한 자료를 선택하세요.</p>
			</div>
			<div className="grid gap-3">
				{materials.map((material) => (
					<Checkbox
						key={material.id}
						className="rounded-medium border-border-subtle bg-surface w-full items-start justify-between
							gap-3 border px-3 py-2"
						isSelected={sourceMaterialIds.includes(material.id)}
						onChange={() => onChange(toggleMaterialId(sourceMaterialIds, material.id))}
					>
						<Checkbox.Control className="mt-0.5 shrink-0">
							<Checkbox.Indicator />
						</Checkbox.Control>
						<Checkbox.Content className="min-w-0 flex-1">
							<div className="flex min-w-0 flex-wrap items-center gap-2">
								<p className="text-neutral-text truncate text-sm font-medium">{material.title}</p>
								<Chip color={getMaterialSourceKindColor(material.source_kind)} size="sm" variant="soft">
									<Chip.Label>{getMaterialSourceKindLabel(material.source_kind)}</Chip.Label>
								</Chip>
							</div>
							<p className="text-neutral-gray-500 truncate text-xs">{getMaterialDisplayName(material)}</p>
						</Checkbox.Content>
					</Checkbox>
				))}
			</div>
		</div>
	);
}
