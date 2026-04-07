'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button, Chip } from '@heroui/react';
import { getBloomLevelColor, getBloomLevelLabel } from '@/entities/exam';
import type { BloomLevel, ExamTurnEventType } from '@/entities/exam';

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

function formatTime(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// TTS 훅
function useTTS() {
	const speak = useCallback((text: string) => {
		if (typeof window === 'undefined') return;
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = 'ko-KR';
		utterance.rate = 0.95;
		utterance.pitch = 1;
		window.speechSynthesis.speak(utterance);
	}, []);

	const stop = useCallback(() => {
		if (typeof window === 'undefined') return;
		window.speechSynthesis.cancel();
	}, []);

	return { speak, stop };
}

// STT 훅
function useSTT(onResult: (text: string) => void) {
	const recognitionRef = useRef<any>(null);
	const [isListening, setIsListening] = useState(false);

	const start = useCallback(() => {
		const SpeechRecognition =
			(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
		if (!SpeechRecognition) return;

		const recognition = new SpeechRecognition();
		recognition.lang = 'ko-KR';
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onresult = (event: any) => {
			const transcript = Array.from(event.results)
				.map((r: any) => r[0].transcript)
				.join('');
			onResult(transcript);
		};

		recognition.onend = () => setIsListening(false);
		recognition.start();
		recognitionRef.current = recognition;
		setIsListening(true);
	}, [onResult]);

	const stop = useCallback(() => {
		recognitionRef.current?.stop();
		setIsListening(false);
	}, []);

	const toggle = useCallback(() => {
		isListening ? stop() : start();
	}, [isListening, start, stop]);

	return { isListening, toggle };
}

// 움직이는 AI 캐릭터
function AICharacter({ isSpeaking }: { isSpeaking: boolean }) {
	return (
		<div className="relative flex flex-col items-center justify-center">
			{/* 외부 파동 */}
			{isSpeaking && (
				<>
					<div className="absolute h-72 w-72 animate-ping rounded-full bg-violet-500/10" style={{ animationDuration: '1.5s' }} />
					<div className="absolute h-60 w-60 animate-ping rounded-full bg-violet-500/20" style={{ animationDuration: '1s' }} />
				</>
			)}

			{/* 캐릭터 본체 */}
			<div
				className="relative"
				style={{
					animation: isSpeaking ? 'aiFloat 0.6s ease-in-out infinite alternate' : 'aiFloatIdle 3s ease-in-out infinite alternate',
				}}
			>
				<style>{`
					@keyframes aiFloat {
						0% { transform: translateY(0px) scale(1); }
						100% { transform: translateY(-12px) scale(1.04); }
					}
					@keyframes aiFloatIdle {
						0% { transform: translateY(0px); }
						100% { transform: translateY(-8px); }
					}
					@keyframes mouthOpen {
						0%, 100% { scaleY: 1; }
						50% { transform: scaleY(1.6); }
					}
				`}</style>

				{/* 머리 */}
				<div className={`relative flex h-44 w-44 flex-col items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
					isSpeaking
						? 'bg-gradient-to-br from-violet-400 via-violet-500 to-violet-700'
						: 'bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700'
				}`}>
					{/* 광택 */}
					<div className="absolute left-6 top-6 h-8 w-8 rounded-full bg-white/20 blur-sm" />

					{/* 눈 */}
					<div className="mb-3 flex gap-5">
						<div
							className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-inner"
							style={{ animation: isSpeaking ? 'none' : 'blink 4s ease-in-out infinite' }}
						>
							<style>{`
								@keyframes blink {
									0%, 90%, 100% { transform: scaleY(1); }
									95% { transform: scaleY(0.1); }
								}
							`}</style>
							<div className={`h-4 w-4 rounded-full bg-slate-900 transition-all duration-200 ${isSpeaking ? 'scale-110' : ''}`} />
							<div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-white" />
						</div>
						<div
							className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-inner"
							style={{ animation: isSpeaking ? 'none' : 'blink 4s ease-in-out infinite' }}
						>
							<div className={`h-4 w-4 rounded-full bg-slate-900 transition-all duration-200 ${isSpeaking ? 'scale-110' : ''}`} />
							<div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-white" />
						</div>
					</div>

					{/* 입 */}
					<div className="flex h-7 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-900/80">
						{isSpeaking ? (
							<div
								className="h-4 w-10 rounded-full bg-white/90"
								style={{ animation: 'mouthTalk 0.3s ease-in-out infinite alternate' }}
							>
								<style>{`
									@keyframes mouthTalk {
										0% { transform: scaleY(0.3); }
										100% { transform: scaleY(1); }
									}
								`}</style>
							</div>
						) : (
							<div className="h-2 w-10 rounded-full bg-white/60" />
						)}
					</div>

					{/* 안테나 */}
					<div className="absolute -top-8 left-1/2 -translate-x-1/2">
						<div className="h-8 w-1 rounded-full bg-violet-300 mx-auto" />
						<div className={`h-4 w-4 rounded-full mx-auto -mt-1 transition-all duration-300 ${isSpeaking ? 'bg-yellow-300 shadow-lg shadow-yellow-300/60' : 'bg-violet-300'}`} />
					</div>
				</div>
			</div>

			<p className="mt-6 text-sm font-medium text-slate-400">
				{isSpeaking ? '질문 중...' : '대기 중'}
			</p>
		</div>
	);
}

// 마이크 버튼
function MicButton({ isListening, onToggle, disabled }: { isListening: boolean; onToggle: () => void; disabled?: boolean }) {
	return (
		<button
			onClick={onToggle}
			disabled={disabled}
			className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200 disabled:opacity-40 ${
				isListening
					? 'bg-red-500 shadow-lg shadow-red-500/50 scale-110'
					: 'bg-slate-600 hover:bg-slate-500'
			}`}
		>
			{isListening && (
				<div className="absolute h-full w-full animate-ping rounded-full bg-red-400/40" />
			)}
			<svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
				<path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 7 8.94V22h-3v2h8v-2h-3v-2.06A9 9 0 0 0 21 11h-2z" />
			</svg>
		</button>
	);
}

export default function ExamSessionPage({ params }: { params: { examId: string } }) {
	const [turns, setTurns] = useState<MockTurn[]>(MOCK_TURNS);
	const [input, setInput] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [remainingSeconds, setRemainingSeconds] = useState(DURATION_MINUTES * 60);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [showTextInput, setShowTextInput] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const { speak, stop: stopTTS } = useTTS();
	const { isListening, toggle: toggleMic } = useSTT((text) => setInput(text));

	// 웹캠
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then((stream) => {
				if (videoRef.current) videoRef.current.srcObject = stream;
			})
			.catch(() => {});
		return () => {
			if (videoRef.current?.srcObject) {
				const stream = videoRef.current.srcObject as MediaStream;
				stream.getTracks().forEach((t) => t.stop());
			}
		};
	}, []);

	// 첫 질문 TTS
	useEffect(() => {
		const firstQuestion = MOCK_TURNS.find((t) => t.role === 'assistant');
		if (!firstQuestion) return;
		setIsSpeaking(true);
		speak(firstQuestion.content);
		const timer = setTimeout(() => setIsSpeaking(false), 4000);
		return () => {
			clearTimeout(timer);
			stopTTS();
		};
	}, []);

	// 타이머
	useEffect(() => {
		if (isFinished) return;
		const timer = setInterval(() => {
			setRemainingSeconds((prev) => {
				if (prev <= 1) { clearInterval(timer); setIsFinished(true); return 0; }
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
			const followUpText = '모든 컬럼에 인덱스를 걸었는데 오히려 성능이 저하됐습니다. 인덱스가 내부적으로 어떤 작업을 하길래 이런 결과가 나오는 걸까요?';
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

	const isWarning = remainingSeconds < 5 * 60;
	const latestAssistantTurn = [...turns].reverse().find((t) => t.role === 'assistant');

	return (
		<div className="flex h-screen flex-col bg-[#0f0f1a]">
			{/* 상단 바 */}
			<div className="flex items-center justify-between border-b border-white/10 bg-[#16213e]/80 px-6 py-3 backdrop-blur-sm">
				<div className="flex items-center gap-3">
					<span className="text-sm font-semibold text-white">데이터 과학 개론 중간고사</span>
					<Chip color={getBloomLevelColor(MOCK_QUESTION_META.bloom_level)} size="sm" variant="soft">
						<Chip.Label>{getBloomLevelLabel(MOCK_QUESTION_META.bloom_level)}</Chip.Label>
					</Chip>
				</div>
				<div className="flex items-center gap-4">
					<span className="text-xs text-slate-400">
						{MOCK_QUESTION_META.question_number} / {MOCK_QUESTION_META.total_questions} 문항
					</span>
					<div className={`rounded-lg px-3 py-1.5 font-mono text-sm font-semibold ${isWarning ? 'bg-red-900/60 text-red-300 animate-pulse' : 'bg-white/10 text-white'}`}>
						{formatTime(remainingSeconds)}
					</div>
					{!isFinished && (
						<Link href={`/student/exams/${params.examId}/result`}>
							<Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
								평가 종료
							</Button>
						</Link>
					)}
				</div>
			</div>

			{/* 메인 영역 */}
			<div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-6 py-8">
				{/* 배경 그라데이션 */}
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-900/20 via-transparent to-transparent" />

				{/* AI 캐릭터 */}
				<AICharacter isSpeaking={isSpeaking} />

				{/* 현재 질문 */}
				{latestAssistantTurn && (
					<div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center backdrop-blur-sm">
						<span className="mb-2 block text-xs font-medium text-violet-400">
							{latestAssistantTurn.event_type === 'question' ? '질문' : '꼬리질문'}
						</span>
						<p className="text-base font-medium leading-relaxed text-white">
							{latestAssistantTurn.content}
						</p>
					</div>
				)}

				{isSubmitting && (
					<p className="text-sm text-slate-400 animate-pulse">AI가 답변을 분석하고 있습니다...</p>
				)}

				{/* 이전 답변 */}
				{turns.filter((t) => t.role === 'student').length > 0 && (
					<div className="w-full max-w-2xl space-y-2">
						{turns.filter((t) => t.role === 'student').map((turn) => (
							<div key={turn.id} className="flex justify-end">
								<div className="max-w-[75%] rounded-2xl bg-violet-600/50 px-4 py-2 text-sm text-white backdrop-blur-sm">
									{turn.content}
								</div>
							</div>
						))}
					</div>
				)}

				{/* 컨트롤 */}
				{!isFinished ? (
					<div className="flex flex-col items-center gap-3">
						<div className="flex items-center gap-6">
							<MicButton isListening={isListening} onToggle={toggleMic} disabled={isSubmitting} />
							<button
								onClick={() => setShowTextInput((v) => !v)}
								className="rounded-full border border-white/20 px-4 py-2 text-xs text-slate-300 hover:bg-white/10 transition-colors"
							>
								{showTextInput ? '텍스트 닫기' : '텍스트로 입력'}
							</button>
						</div>
						<p className="text-xs text-slate-500">
							{isListening ? '음성 인식 중... 말씀해주세요.' : '마이크를 눌러 답변하거나 텍스트로 입력하세요.'}
						</p>

						{showTextInput && (
							<div className="flex w-full max-w-2xl gap-3">
								<textarea
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
											e.preventDefault();
											handleSubmit();
										}
									}}
									placeholder="답변을 입력하세요. (Ctrl+Enter로 제출)"
									rows={3}
									className="flex-1 resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
									disabled={isSubmitting}
								/>
								<Button
									variant="primary"
									onPress={handleSubmit}
									isPending={isSubmitting}
									isDisabled={!input.trim()}
								>
									제출
								</Button>
							</div>
						)}
					</div>
				) : (
					<div className="flex flex-col items-center gap-3">
						<p className="text-sm font-medium text-slate-300">시험이 종료되었습니다.</p>
						<Link href={`/student/exams/${params.examId}/result`}>
							<Button variant="primary">결과 확인하기</Button>
						</Link>
					</div>
				)}

				{/* 우측 하단 웹캠 */}
				<div className="absolute bottom-4 right-4 overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl">
					<video ref={videoRef} autoPlay muted playsInline className="h-32 w-44 bg-slate-900 object-cover" />
					<div className="absolute bottom-1 left-2 text-xs text-white/50">나</div>
				</div>
			</div>
		</div>
	);
}
