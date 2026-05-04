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

import { createDefaultBloomCounts, createEmptyGenerationForm, parseBloomCounts } from '../lib/bloom';
import { useGenerateExamQuestions } from '../model/use-generate-questions';
import { GenerateExamQuestionsMaterials } from './materials';
import { GenerateExamQuestionsSettings } from './settings';

interface GenerateExamQuestionsFormProps {
	classroomId: string;
	examId: string;
	examType: ExamType;
	materials: ClassroomMaterial[];
	formId?: string;
	hideActions?: boolean;
	hideHeader?: boolean;
	onCancel?: () => void;
	onSuccess?: () => void;
}

export function GenerateExamQuestionsForm(props: GenerateExamQuestionsFormProps) {
	return <GenerateExamQuestionsFormBody key={`${props.classroomId}:${props.examId}:${props.examType}`} {...props} />;
}

function GenerateExamQuestionsFormBody({
	classroomId,
	examId,
	examType,
	materials,
	formId,
	hideActions = false,
	hideHeader = false,
	onCancel,
	onSuccess,
}: GenerateExamQuestionsFormProps) {
	const emptyGenerationForm = useMemo(() => createEmptyGenerationForm(), []);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [difficulty, setDifficulty] = useState<ExamDifficulty>(emptyGenerationForm.difficulty);
	const [scopeText, setScopeText] = useState(emptyGenerationForm.scopeText);
	const [maxFollowUps, setMaxFollowUps] = useState(emptyGenerationForm.maxFollowUps);
	const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>(emptyGenerationForm.selectedMaterialIds);
	const [bloomCounts, setBloomCounts] = useState<Record<BloomLevel, string>>(() =>
		createDefaultBloomCounts(examType),
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
		setDifficulty(emptyGenerationForm.difficulty);
		setScopeText(emptyGenerationForm.scopeText);
		setMaxFollowUps(emptyGenerationForm.maxFollowUps);
		setSelectedMaterialIds(emptyGenerationForm.selectedMaterialIds);
		setBloomCounts(createDefaultBloomCounts(examType));
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

		const { parsedCounts, totalCount } = parseBloomCounts(bloomCounts);
		const parsedMaxFollowUps = Number(maxFollowUps);

		if (!scopeText.trim()) {
			setErrorMessage('시험 범위를 입력해주세요.');
			return;
		}

		if (!Number.isInteger(parsedMaxFollowUps) || parsedMaxFollowUps < 0 || parsedMaxFollowUps > 20) {
			setErrorMessage('최대 꼬리질문 수는 0 이상 20 이하의 정수여야 합니다.');
			return;
		}

		if (parsedCounts.length === 0) {
			setErrorMessage('Bloom 단계별 문항 수를 하나 이상 입력해주세요.');
			return;
		}

		if (totalCount <= 0) {
			setErrorMessage('총 문항 수는 1개 이상이어야 합니다.');
			return;
		}

		try {
			if (generateMutation.isPending) {
				return;
			}

			await generateMutation.mutateAsync({
				bloom_counts: parsedCounts,
				difficulty,
				max_follow_ups: parsedMaxFollowUps,
				question_type_strategy: questionTypeStrategy,
				scope_text: scopeText.trim(),
				source_material_ids: selectedMaterialIds,
				total_question_count: totalCount,
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
					<h3 className="text-base font-semibold text-neutral-text">AI 문항 생성</h3>
					<p className="mt-1 text-sm text-neutral-gray-500">
						적재 완료된 강의 자료와 추출 범위를 기반으로 문항을 생성합니다.
					</p>
				</div>
			)}

			<GenerateExamQuestionsSettings
				bloomCounts={bloomCounts}
				difficulty={difficulty}
				maxFollowUps={maxFollowUps}
				onBloomCountChange={(level, value) => setBloomCounts((prev) => ({ ...prev, [level]: value }))}
				onDifficultyChange={setDifficulty}
				onMaxFollowUpsChange={setMaxFollowUps}
				onQuestionTypeStrategyChange={setQuestionTypeStrategy}
				onScopeTextChange={setScopeText}
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
