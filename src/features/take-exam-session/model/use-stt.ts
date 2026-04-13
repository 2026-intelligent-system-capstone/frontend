'use client';

import { useCallback, useRef, useState } from 'react';

export function useSTT(onResult: (text: string) => void) {
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
