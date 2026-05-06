'use client';

import { useMemo, useState } from 'react';

import type { ClassroomMaterial } from '@/entities/classroom-material';
import type {
	BloomLevel,
	ExamDifficulty,
	ExamQuestionTypeStrategy,
	ExamType,
	GenerateExamQuestionsRequest,
} from '@/entities/exam';
import { ApiClientError } from '@/shared/api/types';
import { Button, ErrorMessage } from '@heroui/react';

import {
	createDefaultBloomWeights,
	createEmptyGenerationForm,
	parseBloomWeights,
	toggleStringValue,
} from '../lib/bloom';
import { useGenerateExamQuestions } from '../model/use-generate-questions';
import { GenerateExamQuestionsScopeSection } from './materials';
import { GenerateExamQuestionsSettings } from './settings';

const FIXED_MAX_FOLLOW_UPS = 2;
const MAX_GENERATION_SCOPE_TEXT_LENGTH = 1000;

interface GenerationScopeTextInput {
	additionalScopeText: string;
	materials: ClassroomMaterial[];
	selectedConceptKeys: string[];
}

const createScopeCandidateKey = (materialId: string, candidateIndex: number): string => {
	return `${materialId}:${candidateIndex}`;
};

const createMaterialScopeCandidateKeys = (material: ClassroomMaterial): string[] => {
	return material.scope_candidates.map((_, index) => createScopeCandidateKey(material.id, index));
};

const buildGenerationScopeText = ({
	additionalScopeText,
	materials,
	selectedConceptKeys,
}: GenerationScopeTextInput): string => {
	const selectedConceptLines = materials.flatMap((material) => {
		return material.scope_candidates.flatMap((candidate, index) => {
			const conceptKey = createScopeCandidateKey(material.id, index);

			if (!selectedConceptKeys.includes(conceptKey)) {
				return [];
			}

			return [`- [${material.title}] ${candidate.label}: ${candidate.scope_text}`];
		});
	});
	const normalizedAdditionalScopeText = additionalScopeText.trim();
	const sections: string[] = [];

	if (selectedConceptLines.length > 0) {
		sections.push(['시험 포함 개념:', ...selectedConceptLines].join('\n'));
	}

	if (normalizedAdditionalScopeText) {
		sections.push(`교수자 추가 포함 내용:\n${normalizedAdditionalScopeText}`);
	}

	return sections.join('\n\n').trim();
};

interface GenerateExamQuestionsFormProps {
	classroomId: string;
	examId: string;
	examType: ExamType;
	questionCount: number;
	difficulty: ExamDifficulty;
	materials: ClassroomMaterial[];
	formId?: string;
	hideActions?: boolean;
	hideHeader?: boolean;
	onCancel?: () => void;
	onSuccess?: () => void;
}

export function GenerateExamQuestionsForm(props: GenerateExamQuestionsFormProps) {
	return (
		<GenerateExamQuestionsFormBody
			key={`${props.classroomId}:${props.examId}:${props.examType}:${props.questionCount}:${props.difficulty}`}
			{...props}
		/>
	);
}

function GenerateExamQuestionsFormBody({
	classroomId,
	examId,
	examType,
	questionCount,
	materials,
	formId,
	hideActions = false,
	hideHeader = false,
	onCancel,
	onSuccess,
}: GenerateExamQuestionsFormProps) {
	const emptyGenerationForm = useMemo(() => createEmptyGenerationForm(), []);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [additionalScopeText, setAdditionalScopeText] = useState(emptyGenerationForm.additionalScopeText);
	const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>(emptyGenerationForm.selectedMaterialIds);
	const [selectedConceptKeys, setSelectedConceptKeys] = useState<string[]>([]);
	const [bloomWeights, setBloomWeights] = useState<Record<BloomLevel, string>>(() =>
		createDefaultBloomWeights(examType),
	);
	const [questionTypeStrategy, setQuestionTypeStrategy] = useState<ExamQuestionTypeStrategy>(
		emptyGenerationForm.questionTypeStrategy,
	);
	const generateMutation = useGenerateExamQuestions(classroomId, examId);

	const completedMaterials = useMemo(() => {
		return materials.filter((material) => material.ingest_status === 'completed');
	}, [materials]);

	const resetForm = () => {
		setErrorMessage(null);
		setAdditionalScopeText(emptyGenerationForm.additionalScopeText);
		setSelectedMaterialIds(emptyGenerationForm.selectedMaterialIds);
		setSelectedConceptKeys([]);
		setBloomWeights(createDefaultBloomWeights(examType));
		setQuestionTypeStrategy(emptyGenerationForm.questionTypeStrategy);
	};

	const handleMaterialToggle = (material: ClassroomMaterial) => {
		const materialConceptKeys = createMaterialScopeCandidateKeys(material);
		const isSelected = selectedMaterialIds.includes(material.id);

		setSelectedMaterialIds((prev) => toggleStringValue(prev, material.id));
		setSelectedConceptKeys((prev) => {
			if (isSelected) {
				return prev.filter((conceptKey) => !materialConceptKeys.includes(conceptKey));
			}

			return Array.from(new Set([...prev, ...materialConceptKeys]));
		});
	};

	const handleConceptToggle = (conceptKey: string) => {
		setSelectedConceptKeys((prev) => toggleStringValue(prev, conceptKey));
	};

	const handleCancel = () => {
		resetForm();
		onCancel?.();
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);

		const { parsedWeights, totalWeight } = parseBloomWeights(bloomWeights);
		const generatedScopeText = buildGenerationScopeText({
			additionalScopeText,
			materials,
			selectedConceptKeys,
		});

		if (!generatedScopeText) {
			setErrorMessage('포함할 개념을 선택하거나 추가 포함 내용을 입력해주세요.');
			return;
		}

		if (generatedScopeText.length > MAX_GENERATION_SCOPE_TEXT_LENGTH) {
			setErrorMessage('선택된 개념과 추가 내용이 너무 깁니다. 일부 개념을 제외하거나 추가 내용을 줄여주세요.');
			return;
		}

		if (totalWeight <= 0) {
			setErrorMessage('Bloom 단계별 가중치를 하나 이상 입력해주세요.');
			return;
		}

		try {
			if (generateMutation.isPending) {
				return;
			}

			await generateMutation.mutateAsync({
				bloom_weights: parsedWeights,
				max_follow_ups: FIXED_MAX_FOLLOW_UPS,
				question_type_strategy: questionTypeStrategy,
				scope_text: generatedScopeText,
				source_material_ids: selectedMaterialIds,
			} satisfies GenerateExamQuestionsRequest);
			resetForm();
			onSuccess?.();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('AI 문항 생성 중 오류가 발생했습니다.');
		}
	};

	return (
		<form className="space-y-5" id={formId} onSubmit={handleSubmit}>
			{hideHeader ? null : (
				<div>
					<h3 className="text-neutral-text text-base font-semibold">AI 문항 생성</h3>
					<p className="text-neutral-gray-500 mt-1 text-sm">
						자료와 포함 개념을 선택하고 추가 지시를 입력해 AI 문항 생성 범위를 설계합니다.
					</p>
				</div>
			)}

			<GenerateExamQuestionsScopeSection
				additionalScopeText={additionalScopeText}
				hasCompletedMaterials={completedMaterials.length > 0}
				materials={materials}
				onAdditionalScopeTextChange={setAdditionalScopeText}
				onConceptToggle={handleConceptToggle}
				onMaterialToggle={handleMaterialToggle}
				selectedConceptKeys={selectedConceptKeys}
				selectedMaterialIds={selectedMaterialIds}
			/>

			<GenerateExamQuestionsSettings
				bloomWeights={bloomWeights}
				onBloomWeightChange={(level, value) => setBloomWeights((prev) => ({ ...prev, [level]: value }))}
				onQuestionTypeStrategyChange={setQuestionTypeStrategy}
				questionCount={questionCount}
				questionTypeStrategy={questionTypeStrategy}
			/>

			{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

			{hideActions ? null : (
				<div className="flex justify-end gap-3">
					<Button type="button" variant="secondary" onPress={handleCancel}>
						닫기
					</Button>
					<Button isPending={generateMutation.isPending} type="submit" variant="primary">
						생성
					</Button>
				</div>
			)}
		</form>
	);
}
