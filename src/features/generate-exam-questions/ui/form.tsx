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

import { createDefaultBloomWeights, createEmptyGenerationForm, parseBloomWeights } from '../lib/bloom';
import { useGenerateExamQuestions } from '../model/use-generate-questions';
import { GenerateExamQuestionsMaterials } from './materials';
import { GenerateExamQuestionsSettings } from './settings';

const FIXED_MAX_FOLLOW_UPS = 2;

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
	difficulty,
	materials,
	formId,
	hideActions = false,
	hideHeader = false,
	onCancel,
	onSuccess,
}: GenerateExamQuestionsFormProps) {
	const emptyGenerationForm = useMemo(() => createEmptyGenerationForm(), []);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [scopeText, setScopeText] = useState(emptyGenerationForm.scopeText);
	const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>(emptyGenerationForm.selectedMaterialIds);
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
		setScopeText(emptyGenerationForm.scopeText);
		setSelectedMaterialIds(emptyGenerationForm.selectedMaterialIds);
		setBloomWeights(createDefaultBloomWeights(examType));
		setQuestionTypeStrategy(emptyGenerationForm.questionTypeStrategy);
	};

	const handleScopeCandidateClick = (candidateText: string) => {
		setScopeText((prev) => (prev.trim() ? `${prev.trim()}\n- ${candidateText}` : candidateText));
	};

	const handleCancel = () => {
		resetForm();
		onCancel?.();
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);

		const { parsedWeights, totalWeight } = parseBloomWeights(bloomWeights);

		if (!scopeText.trim()) {
			setErrorMessage('시험 범위를 입력해주세요.');
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
				scope_text: scopeText.trim(),
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
						적재 완료된 강의 자료와 추출 범위를 기반으로 문항을 생성합니다.
					</p>
				</div>
			)}

			<GenerateExamQuestionsSettings
				bloomWeights={bloomWeights}
				difficulty={difficulty}
				onBloomWeightChange={(level, value) => setBloomWeights((prev) => ({ ...prev, [level]: value }))}
				onQuestionTypeStrategyChange={setQuestionTypeStrategy}
				onScopeTextChange={setScopeText}
				questionCount={questionCount}
				questionTypeStrategy={questionTypeStrategy}
				scopeText={scopeText}
			/>

			<GenerateExamQuestionsMaterials
				hasCompletedMaterials={completedMaterials.length > 0}
				materials={materials}
				onAppendScopeCandidate={handleScopeCandidateClick}
				onSelectedMaterialIdsChange={setSelectedMaterialIds}
				selectedMaterialIds={selectedMaterialIds}
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
