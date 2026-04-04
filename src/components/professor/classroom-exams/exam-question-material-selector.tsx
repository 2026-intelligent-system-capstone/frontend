import { Checkbox, Label } from '@heroui/react';

import type { ClassroomMaterial } from '@/types/classroom';

import { toggleStringValue } from '@/lib/classrooms/exam-presentation';

interface ExamQuestionMaterialSelectorProps {
	materials: ClassroomMaterial[];
	sourceMaterialIds: string[];
	onChange: (nextIds: string[]) => void;
}

export function ExamQuestionMaterialSelector({
	materials,
	sourceMaterialIds,
	onChange,
}: ExamQuestionMaterialSelectorProps) {
	return (
		<div className="rounded-large space-y-3 border border-slate-200 bg-slate-50 p-4">
			<div>
				<p className="text-sm font-medium text-slate-800">연결 자료</p>
				<p className="mt-1 text-xs text-slate-500">문항 생성에 참고한 자료를 선택하세요.</p>
			</div>
			<div className="grid gap-3">
				{materials.map((material) => (
					<Checkbox
						key={material.id}
						className="rounded-medium w-full items-start justify-between gap-3 border border-slate-200
							bg-white px-3 py-2"
						isSelected={sourceMaterialIds.includes(material.id)}
						onChange={() => onChange(toggleStringValue(sourceMaterialIds, material.id))}
					>
						<Checkbox.Control className="mt-0.5 shrink-0">
							<Checkbox.Indicator />
						</Checkbox.Control>
						<Checkbox.Content className="min-w-0 flex-1">
							<Label className="truncate text-sm font-medium text-slate-800">{material.title}</Label>
							<p className="truncate text-xs text-slate-500">{material.file.file_name}</p>
						</Checkbox.Content>
					</Checkbox>
				))}
			</div>
		</div>
	);
}
