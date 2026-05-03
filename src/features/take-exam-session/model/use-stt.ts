'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SpeechRecognitionAlternativeLike {
	transcript: string;
}

interface SpeechRecognitionResultLike {
	length: number;
	[index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
	length: number;
	[index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike extends Event {
	results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike extends Event {
	error: string;
	message?: string;
}

interface SpeechRecognitionLike {
	lang: string;
	continuous: boolean;
	interimResults: boolean;
	onresult: ((event: SpeechRecognitionEventLike) => void) | null;
	onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
	onend: (() => void) | null;
	start: () => void;
	stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type BrowserWindow = Window & {
	SpeechRecognition?: SpeechRecognitionConstructor;
	webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
	if (typeof window === 'undefined') return null;

	const browserWindow = window as BrowserWindow;
	return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
}

function isBlockingSpeechRecognitionError(errorCode: string): boolean {
	return errorCode === 'not-allowed' || errorCode === 'service-not-allowed';
}

function getSpeechRecognitionErrorMessage(errorCode: string): string {
	if (isBlockingSpeechRecognitionError(errorCode)) {
		return '마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크 접근을 허용해주세요.';
	}

	if (errorCode === 'no-speech') {
		return '음성이 감지되지 않았습니다. 다시 시도해주세요.';
	}

	if (errorCode === 'network') {
		return '음성 인식 네트워크 오류가 발생했습니다. 연결 상태를 확인해주세요.';
	}

	return '음성 인식을 사용할 수 없습니다. 텍스트 입력으로 답변해주세요.';
}

function detachRecognitionHandlers(recognition: SpeechRecognitionLike): void {
	recognition.onresult = null;
	recognition.onerror = null;
	recognition.onend = null;
}

export function useSTT(onResult: (text: string) => void) {
	const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
	const isMountedRef = useRef(true);
	const [isListening, setIsListening] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isPermissionBlocked, setIsPermissionBlocked] = useState(false);
	const isSupported = useMemo(() => getSpeechRecognitionConstructor() !== null, []);

	useEffect(() => {
		return () => {
			isMountedRef.current = false;
			const recognition = recognitionRef.current;
			if (!recognition) return;

			detachRecognitionHandlers(recognition);
			recognition.stop();
			recognitionRef.current = null;
		};
	}, []);

	const start = useCallback(() => {
		const SpeechRecognition = getSpeechRecognitionConstructor();
		if (!SpeechRecognition) {
			setErrorMessage('이 브라우저는 음성 인식을 지원하지 않습니다. 텍스트 입력으로 답변해주세요.');
			setIsListening(false);
			return;
		}

		if (isPermissionBlocked) return;

		setErrorMessage(null);
		const previousRecognition = recognitionRef.current;
		if (previousRecognition) {
			detachRecognitionHandlers(previousRecognition);
			previousRecognition.stop();
		}

		const recognition = new SpeechRecognition();
		recognition.lang = 'ko-KR';
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onresult = (event) => {
			if (!isMountedRef.current) return;

			const transcript = Array.from(
				{ length: event.results.length },
				(_, index) => event.results[index]?.[0]?.transcript ?? '',
			).join('');
			setErrorMessage(null);
			onResult(transcript);
		};

		recognition.onerror = (event) => {
			if (!isMountedRef.current) return;

			setErrorMessage(event.message || getSpeechRecognitionErrorMessage(event.error));
			setIsPermissionBlocked(isBlockingSpeechRecognitionError(event.error));
			setIsListening(false);
		};
		recognition.onend = () => {
			if (!isMountedRef.current) return;
			setIsListening(false);
		};

		try {
			recognition.start();
			recognitionRef.current = recognition;
			setIsListening(true);
		} catch {
			detachRecognitionHandlers(recognition);
			setErrorMessage('음성 인식을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.');
			setIsListening(false);
		}
	}, [isPermissionBlocked, onResult]);

	const stop = useCallback(() => {
		recognitionRef.current?.stop();
		setIsListening(false);
	}, []);

	const toggle = useCallback(() => {
		if (isListening) {
			stop();
			return;
		}

		start();
	}, [isListening, start, stop]);

	return { isListening, isSupported, isPermissionBlocked, errorMessage, toggle, stop };
}
