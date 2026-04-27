'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@heroui/react';

import type { BloomLevel, ExamQuestionType, ExamTurnEventType } from '@/entities/exam';
import { useSTT, useTTS } from '@/features/take-exam-session';

import { AICharacter } from './ai-character';
import { LatexText } from './latex-text';
import { MicButton } from './mic-button';
import { MultipleChoiceInput } from './multiple-choice-input';
import { QuestionNav } from './question-nav';
import { SessionControls } from './session-controls';
import { SessionHeader } from './session-header';

interface MockQuestion {
	id: string;
	question_number: number;
	question_type: ExamQuestionType;
	bloom_level: BloomLevel;
	question_text: string;
	answer_options: string[];
}

const MOCK_QUESTIONS: MockQuestion[] = [
	{
		id: 'q1',
		question_number: 1,
		question_type: 'multiple_choice',
		bloom_level: 'remember',
		question_text: '다음 중 데이터베이스 인덱스의 특징으로 옳은 것을 모두 고르시오.',
		answer_options: [
			'조회(SELECT) 성능을 향상시킨다',
			'삽입·수정·삭제 성능도 항상 향상된다',
			'추가적인 저장 공간을 사용한다',
			'B-Tree 구조로 구현될 수 있다',
		],
	},
	{
		id: 'q2',
		question_number: 2,
		question_type: 'subjective',
		bloom_level: 'understand',
		question_text: '시간 복잡도 $O(n \\log n)$을 갖는 정렬 알고리즘 두 가지를 쓰고, 각각의 동작 원리를 설명하시오.',
		answer_options: [],
	},
	{
		id: 'q3',
		question_number: 3,
		question_type: 'oral',
		bloom_level: 'understand',
		question_text: '데이터베이스의 조회 쿼리를 빠르게 할 수 있는 방법을 설명해주세요.',
		answer_options: [],
	},
];

const DURATION_MINUTES = 40;

interface OralTurn {
	id: string;
	role: 'student' | 'assistant';
	event_type: ExamTurnEventType;
	content: string;
}

interface StudentExamSessionPageProps {
	examId: string;
}

export function StudentExamSessionPage({ examId }: StudentExamSessionPageProps) {
	const [currentQuestionId, setCurrentQuestionId] = useState(MOCK_QUESTIONS[0].id);
	const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
	const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<Record<string, number[]>>({});
	const [multipleChoiceSelected, setMultipleChoiceSelected] = useState<number[]>([]);
	const [subjectiveAnswers, setSubjectiveAnswers] = useState<Record<string, string>>({});
	const [subjectiveInput, setSubjectiveInput] = useState('');
	const [isFinished, setIsFinished] = useState(false);
	const [remainingSeconds, setRemainingSeconds] = useState(DURATION_MINUTES * 60);

	// Oral question state
	const [oralTurns, setOralTurns] = useState<OralTurn[]>([
		{ id: 't1', role: 'assistant', event_type: 'question', content: MOCK_QUESTIONS[2].question_text },
	]);
	const [oralInput, setOralInput] = useState('');
	const [isOralSubmitting, setIsOralSubmitting] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [showTextInput, setShowTextInput] = useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const { speak, stop: stopTTS } = useTTS();
	const { isListening: isSubjectiveListening, toggle: toggleSubjectiveMic } = useSTT((text) =>
		setSubjectiveInput(text),
	);
	const { isListening, toggle: toggleMic } = useSTT((text) => setOralInput(text));

	const currentQuestion = MOCK_QUESTIONS.find((q) => q.id === currentQuestionId)!;

	// Camera setup
	useEffect(() => {
		const videoElement = videoRef.current;
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then((stream) => {
				if (videoElement) videoElement.srcObject = stream;
			})
			.catch(() => {});
		return () => {
			if (videoElement?.srcObject) {
				(videoElement.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
			}
		};
	}, []);

	// Timer
	useEffect(() => {
		if (isFinished) return;
		const timer = setInterval(() => {
			setRemainingSeconds((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					setIsFinished(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, [isFinished]);

	// Restore selections when switching questions
	useEffect(() => {
		setMultipleChoiceSelected(multipleChoiceAnswers[currentQuestionId] ?? []);
		setSubjectiveInput(subjectiveAnswers[currentQuestionId] ?? '');
	}, [currentQuestionId, multipleChoiceAnswers, subjectiveAnswers]);

	const goToNextQuestion = (currentId: string) => {
		const currentIndex = MOCK_QUESTIONS.findIndex((q) => q.id === currentId);
		if (currentIndex < MOCK_QUESTIONS.length - 1) {
			setCurrentQuestionId(MOCK_QUESTIONS[currentIndex + 1].id);
		}
	};

	const handleMultipleChoiceSubmit = (selected: number[]) => {
		setMultipleChoiceAnswers((prev) => ({ ...prev, [currentQuestionId]: selected }));
		setAnsweredIds((prev) => new Set([...prev, currentQuestionId]));
		goToNextQuestion(currentQuestionId);
	};

	const handleSubjectiveSubmit = () => {
		if (!subjectiveInput.trim()) return;
		setSubjectiveAnswers((prev) => ({ ...prev, [currentQuestionId]: subjectiveInput }));
		setAnsweredIds((prev) => new Set([...prev, currentQuestionId]));
		goToNextQuestion(currentQuestionId);
	};

	const handleOralSubmit = async () => {
		if (!oralInput.trim() || isOralSubmitting) return;
		stopTTS();

		const studentTurn: OralTurn = {
			id: `t${oralTurns.length + 1}`,
			role: 'student',
			event_type: 'answer',
			content: oralInput.trim(),
		};
		setOralTurns((prev) => [...prev, studentTurn]);
		setOralInput('');
		setIsOralSubmitting(true);
		setShowTextInput(false);
		setAnsweredIds((prev) => new Set([...prev, 'q3']));

		setTimeout(() => {
			const followUpText =
				'모든 컬럼에 인덱스를 걸었는데 오히려 성능이 저하됐습니다. 인덱스가 내부적으로 어떤 작업을 하길래 이런 결과가 나오는 걸까요?';
			setOralTurns((prev) => [
				...prev,
				{ id: `t${prev.length + 1}`, role: 'assistant', event_type: 'follow_up', content: followUpText },
			]);
			setIsOralSubmitting(false);
			setIsSpeaking(true);
			speak(followUpText);
			setTimeout(() => setIsSpeaking(false), 4000);
		}, 1200);
	};

	const latestAssistantTurn = [...oralTurns].reverse().find((t) => t.role === 'assistant');

	return (
		<div className="flex h-screen flex-col bg-[#0f0f1a]">
			<SessionHeader
				bloomLevel={currentQuestion.bloom_level}
				examId={examId}
				examTitle="데이터 과학 개론 중간고사"
				isFinished={isFinished}
				questionNumber={currentQuestion.question_number}
				remainingSeconds={remainingSeconds}
				totalQuestions={MOCK_QUESTIONS.length}
			/>

			<div className="flex flex-1 overflow-hidden">
				<QuestionNav
					questions={MOCK_QUESTIONS}
					currentId={currentQuestionId}
					answeredIds={answeredIds}
					onSelect={setCurrentQuestionId}
				/>

				<div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto px-6 py-8">
					<div
						className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-900/20 via-transparent
							to-transparent"
					/>

					{/* 객관식 */}
					{currentQuestion.question_type === 'multiple_choice' && (
						<div className="z-10 flex w-full max-w-2xl flex-col gap-5">
							<div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
								<span className="mb-2 block text-xs font-medium text-violet-400">객관식 (복수 선택)</span>
								<p className="text-base font-medium leading-relaxed text-white">
									{currentQuestion.question_text}
								</p>
							</div>
							<MultipleChoiceInput
								isAnswered={answeredIds.has(currentQuestionId)}
								options={currentQuestion.answer_options}
								selected={multipleChoiceSelected}
								onChange={setMultipleChoiceSelected}
								onSubmit={handleMultipleChoiceSubmit}
							/>
						</div>
					)}

					{/* 주관식 */}
					{currentQuestion.question_type === 'subjective' && (
						<div className="z-10 flex w-full max-w-2xl flex-col gap-5">
							<div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
								<span className="mb-2 block text-xs font-medium text-amber-400">주관식</span>
								<p className="text-base font-medium leading-relaxed text-white">
									<LatexText text={currentQuestion.question_text} />
								</p>
							</div>
							<div className="flex flex-col gap-3">
								<textarea
									className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm
										text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none
										disabled:cursor-not-allowed disabled:opacity-70"
									disabled={answeredIds.has(currentQuestionId)}
									placeholder="답변을 입력하거나 마이크로 말하세요."
									rows={6}
									value={subjectiveInput}
									onChange={(e) => setSubjectiveInput(e.target.value)}
								/>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<MicButton
											disabled={answeredIds.has(currentQuestionId)}
											isListening={isSubjectiveListening}
											onToggle={toggleSubjectiveMic}
										/>
										<p className="text-xs text-slate-500">
											{isSubjectiveListening ? '음성 인식 중... 말씀해주세요.' : '마이크로 답변하거나 직접 입력하세요.'}
										</p>
									</div>
									{!answeredIds.has(currentQuestionId) ? (
										<Button
											isDisabled={!subjectiveInput.trim()}
											variant="primary"
											onPress={handleSubjectiveSubmit}
										>
											제출
										</Button>
									) : (
										<p className="text-xs font-medium text-emerald-400">✓ 제출 완료</p>
									)}
								</div>
							</div>
						</div>
					)}

					{/* 구술 */}
					{currentQuestion.question_type === 'oral' && (
						<>
							<AICharacter isSpeaking={isSpeaking} />
							{latestAssistantTurn && (
								<div
									className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center
										backdrop-blur-sm"
								>
									<span className="mb-2 block text-xs font-medium text-violet-400">
										{latestAssistantTurn.event_type === 'question' ? '질문' : '꼬리질문'}
									</span>
									<p className="text-base leading-relaxed font-medium text-white">
										{latestAssistantTurn.content}
									</p>
								</div>
							)}
							{isOralSubmitting && (
								<p className="animate-pulse text-sm text-slate-400">AI가 답변을 분석하고 있습니다...</p>
							)}
							{oralTurns.filter((t) => t.role === 'student').length > 0 && (
								<div className="w-full max-w-2xl space-y-2">
									{oralTurns
										.filter((t) => t.role === 'student')
										.map((turn) => (
											<div key={turn.id} className="flex justify-end">
												<div
													className="max-w-[75%] rounded-2xl bg-violet-600/50 px-4 py-2 text-sm text-white
														backdrop-blur-sm"
												>
													{turn.content}
												</div>
											</div>
										))}
								</div>
							)}
							<SessionControls
								examId={examId}
								input={oralInput}
								isFinished={isFinished}
								isListening={isListening}
								isSubmitting={isOralSubmitting}
								showTextInput={showTextInput}
								onInputChange={setOralInput}
								onMicToggle={toggleMic}
								onSubmit={handleOralSubmit}
								onToggleTextInput={() => setShowTextInput((v) => !v)}
							/>
						</>
					)}

					{/* 카메라 미리보기 */}
					<div
						className="absolute right-4 bottom-4 overflow-hidden rounded-2xl border-2 border-white/20
							shadow-2xl"
					>
						<video ref={videoRef} autoPlay muted playsInline className="h-32 w-44 bg-slate-900 object-cover" />
						<div className="absolute bottom-1 left-2 text-xs text-white/50">나</div>
					</div>
				</div>
			</div>
		</div>
	);
}
