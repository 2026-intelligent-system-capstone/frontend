'use client';

import { useEffect, useRef, useState } from 'react';

import type { BloomLevel, ExamTurnEventType } from '@/entities/exam';
import { useSTT, useTTS } from '@/features/take-exam-session';

import { AICharacter } from './ai-character';
import { SessionControls } from './session-controls';
import { SessionHeader } from './session-header';

interface MockTurn {
	id: string;
	role: 'student' | 'assistant' | 'system';
	event_type: ExamTurnEventType;
	content: string;
	sequence: number;
}

const MOCK_TURNS: MockTurn[] = [
	{
		id: 't1',
		role: 'assistant',
		event_type: 'question',
		content: '데이터베이스의 조회 쿼리를 빠르게 할 수 있는 방법을 설명해주세요.',
		sequence: 1,
	},
];

const MOCK_QUESTION_META = {
	bloom_level: 'understand' as BloomLevel,
	question_number: 1,
	total_questions: 3,
};

const DURATION_MINUTES = 40;

interface StudentExamSessionPageProps {
	examId: string;
}

export function StudentExamSessionPage({ examId }: StudentExamSessionPageProps) {
	const initialAssistantTurn = MOCK_TURNS.find((turn) => turn.role === 'assistant') ?? null;
	const [turns, setTurns] = useState<MockTurn[]>(MOCK_TURNS);
	const [input, setInput] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [remainingSeconds, setRemainingSeconds] = useState(DURATION_MINUTES * 60);
	const [isSpeaking, setIsSpeaking] = useState(Boolean(initialAssistantTurn));
	const [showTextInput, setShowTextInput] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const { speak, stop: stopTTS } = useTTS();
	const { isListening, toggle: toggleMic } = useSTT((text) => setInput(text));

	useEffect(() => {
		const videoElement = videoRef.current;
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then((stream) => {
				if (videoElement) {
					videoElement.srcObject = stream;
				}
			})
			.catch(() => {});
		return () => {
			if (videoElement?.srcObject) {
				const stream = videoElement.srcObject as MediaStream;
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	useEffect(() => {
		if (!initialAssistantTurn) {
			return;
		}

		speak(initialAssistantTurn.content);
		const timer = setTimeout(() => setIsSpeaking(false), 4000);
		return () => {
			clearTimeout(timer);
			stopTTS();
		};
	}, [initialAssistantTurn, speak, stopTTS]);

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

	const handleSubmit = async () => {
		if (!input.trim() || isSubmitting) return;
		stopTTS();

		const studentTurn: MockTurn = {
			id: `t${turns.length + 1}`,
			role: 'student',
			event_type: 'answer',
			content: input.trim(),
			sequence: turns.length,
		};

		setTurns((prev) => [...prev, studentTurn]);
		setInput('');
		setIsSubmitting(true);
		setShowTextInput(false);

		setTimeout(() => {
			const followUpText =
				'모든 컬럼에 인덱스를 걸었는데 오히려 성능이 저하됐습니다. 인덱스가 내부적으로 어떤 작업을 하길래 이런 결과가 나오는 걸까요?';
			const followUp: MockTurn = {
				id: `t${turns.length + 2}`,
				role: 'assistant',
				event_type: 'follow_up',
				content: followUpText,
				sequence: turns.length + 1,
			};
			setTurns((prev) => [...prev, followUp]);
			setIsSubmitting(false);
			setIsSpeaking(true);
			speak(followUpText);
			setTimeout(() => setIsSpeaking(false), 4000);
		}, 1200);
	};

	const latestAssistantTurn = [...turns].reverse().find((t) => t.role === 'assistant');

	return (
		<div className="flex h-screen flex-col bg-[#0f0f1a]">
			<SessionHeader
				bloomLevel={MOCK_QUESTION_META.bloom_level}
				examId={examId}
				examTitle="데이터 과학 개론 중간고사"
				isFinished={isFinished}
				questionNumber={MOCK_QUESTION_META.question_number}
				remainingSeconds={remainingSeconds}
				totalQuestions={MOCK_QUESTION_META.total_questions}
			/>

			<div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-6 py-8">
				<div
					className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-900/20 via-transparent
						to-transparent"
				/>

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

				{isSubmitting && (
					<p className="animate-pulse text-sm text-slate-400">AI가 답변을 분석하고 있습니다...</p>
				)}

				{turns.filter((t) => t.role === 'student').length > 0 && (
					<div className="w-full max-w-2xl space-y-2">
						{turns
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
					input={input}
					isFinished={isFinished}
					isListening={isListening}
					isSubmitting={isSubmitting}
					showTextInput={showTextInput}
					onInputChange={setInput}
					onMicToggle={toggleMic}
					onSubmit={handleSubmit}
					onToggleTextInput={() => setShowTextInput((v) => !v)}
				/>

				<div
					className="absolute right-4 bottom-4 overflow-hidden rounded-2xl border-2 border-white/20
						shadow-2xl"
				>
					<video ref={videoRef} autoPlay muted playsInline className="h-32 w-44 bg-slate-900 object-cover" />
					<div className="absolute bottom-1 left-2 text-xs text-white/50">나</div>
				</div>
			</div>
		</div>
	);
}
