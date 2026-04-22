'use client';

import { useCallback, useRef, useState } from 'react';

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

interface SpeechRecognitionLike {
	lang: string;
	continuous: boolean;
	interimResults: boolean;
	onresult: ((event: SpeechRecognitionEventLike) => void) | null;
	onend: (() => void) | null;
	start: () => void;
	stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type BrowserWindow = Window & {
	SpeechRecognition?: SpeechRecognitionConstructor;
	webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export function useSTT(onResult: (text: string) => void) {
	const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
	const [isListening, setIsListening] = useState(false);

	const start = useCallback(() => {
		const browserWindow = window as BrowserWindow;
		const SpeechRecognition = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
		if (!SpeechRecognition) return;

		const recognition = new SpeechRecognition();
		recognition.lang = 'ko-KR';
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onresult = (event) => {
			const transcript = Array.from(
				{ length: event.results.length },
				(_, index) => event.results[index]?.[0]?.transcript ?? '',
			).join('');
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
		if (isListening) {
			stop();
			return;
		}

		start();
	}, [isListening, start, stop]);

	return { isListening, toggle };
}
