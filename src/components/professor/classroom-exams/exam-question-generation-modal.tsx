'use client';

import { useMemo, useState } from 'react';

import { Button, ErrorMessage, Modal } from '@heroui/react';

import { ApiClientError } from '@/types/api';
import type { ClassroomMaterial } from '@/types/classroom';
import type { BloomLevel, ExamDifficulty, GenerateExamQuestionsRequest } from '@/types/exam';

import {
	createDefaultBloomRatios,
	createEmptyGenerationForm,
	parseBloomRatios,
} from '@/lib/classrooms/exam-presentation';
import { useGenerateExamQuestions } from '@/lib/hooks/use-classrooms';

import { SparklesIcon } from '@/components/professor/classroom-exams/exam-icons';
import { ExamQuestionGenerationMaterials } from '@/components/professor/classroom-exams/exam-question-generation-materials';
import { ExamQuestionGenerationSettings } from '@/components/professor/classroom-exams/exam-question-generation-settings';

interface ExamQuestionGenerationModalProps {
	classroomId: string;
	examId: string;
	materials: ClassroomMaterial[];
}

export function ExamQuestionGenerationModal({ classroomId, examId, materials }: ExamQuestionGenerationModalProps) {
	const emptyGenerationForm = useMemo(() => createEmptyGenerationForm(), []);
	const [isOpen, setIsOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [difficulty, setDifficulty] = useState<ExamDifficulty>(emptyGenerationForm.difficulty);
	const [scopeText, setScopeText] = useState(emptyGenerationForm.scopeText);
	const [totalQuestions, setTotalQuestions] = useState(emptyGenerationForm.totalQuestions);
	const [maxFollowUps, setMaxFollowUps] = useState(emptyGenerationForm.maxFollowUps);
	const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>(emptyGenerationForm.selectedMaterialIds);
	const [bloomRatios, setBloomRatios] = useState<Record<BloomLevel, string>>(createDefaultBloomRatios);
	const generateMutation = useGenerateExamQuestions(classroomId, examId);

	const completedMaterials = useMemo(() => {
		return materials.filter((material) => material.ingest_status === 'completed');
	}, [materials]);

	const handleScopeCandidateClick = (candidateText: string) => {
		setScopeText((prev) => (prev.trim() ? `${prev.trim()}\n- ${candidateText}` : candidateText));
	};

	const handleOpenChange = (nextOpen: boolean) => {
		setIsOpen(nextOpen);
		if (!nextOpen) {
			setErrorMessage(null);
			setDifficulty(emptyGenerationForm.difficulty);
			setScopeText(emptyGenerationForm.scopeText);
			setTotalQuestions(emptyGenerationForm.totalQuestions);
			setMaxFollowUps(emptyGenerationForm.maxFollowUps);
			setSelectedMaterialIds(emptyGenerationForm.selectedMaterialIds);
			setBloomRatios(createDefaultBloomRatios());
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, close: () => void) => {
		event.preventDefault();
		setErrorMessage(null);

		const { parsedRatios, totalRatio } = parseBloomRatios(bloomRatios);

		if (!scopeText.trim()) {
			setErrorMessage('시험 범위를 입력해주세요.');
			return;
		}

		if (parsedRatios.length === 0) {
			setErrorMessage('Bloom 비율을 하나 이상 입력해주세요.');
			return;
		}

		if (totalRatio !== 100) {
			setErrorMessage('Bloom 비율 합계는 100이어야 합니다.');
			return;
		}

		try {
			await generateMutation.mutateAsync({
				bloom_ratios: parsedRatios,
				difficulty,
				max_follow_ups: Number(maxFollowUps),
				scope_text: scopeText.trim(),
				source_material_ids: selectedMaterialIds,
				total_questions: Number(totalQuestions),
			} satisfies GenerateExamQuestionsRequest);
			close();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('AI 문항 생성 중 오류가 발생했습니다.');
		}
	};

	return (
		<Modal>
			<Button variant="secondary" onPress={() => setIsOpen(true)}>
				<SparklesIcon className="size-4" />
				AI 문항 생성
			</Button>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-4xl">
						{({ close }) => (
							<>
								<Modal.CloseTrigger />
								<Modal.Header>
									<Modal.Heading>AI 문항 생성</Modal.Heading>
									<p className="mt-1 text-sm text-slate-500">
										적재 완료된 강의 자료와 추출 범위를 기반으로 문항을 생성합니다.
									</p>
								</Modal.Header>
								<Modal.Body className="p-6">
									<form className="space-y-5" onSubmit={(event) => handleSubmit(event, close)}>
										<ExamQuestionGenerationSettings
											bloomRatios={bloomRatios}
											difficulty={difficulty}
											maxFollowUps={maxFollowUps}
											onBloomRatioChange={(level, value) =>
												setBloomRatios((prev) => ({ ...prev, [level]: value }))
											}
											onDifficultyChange={setDifficulty}
											onMaxFollowUpsChange={setMaxFollowUps}
											onScopeTextChange={setScopeText}
											onTotalQuestionsChange={setTotalQuestions}
											scopeText={scopeText}
											totalQuestions={totalQuestions}
										/>

										<ExamQuestionGenerationMaterials
											hasCompletedMaterials={completedMaterials.length > 0}
											materials={materials}
											onAppendScopeCandidate={handleScopeCandidateClick}
											onSelectedMaterialIdsChange={setSelectedMaterialIds}
											selectedMaterialIds={selectedMaterialIds}
										/>

										{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

										<div className="flex justify-end gap-3">
											<Button type="button" variant="secondary" onPress={close}>
												취소
											</Button>
											<Button
												isPending={generateMutation.isPending}
												type="submit"
												variant="primary"
											>
												생성
											</Button>
										</div>
									</form>
								</Modal.Body>
							</>
						)}
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}
