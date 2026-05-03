'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

function canUseSpeechSynthesis(): boolean {
	return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function useTTS() {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
	const isSupported = useMemo(() => canUseSpeechSynthesis(), []);

	const speak = useCallback((text: string) => {
		if (!canUseSpeechSynthesis()) return;

		const utterance = new SpeechSynthesisUtterance(text);
		currentUtteranceRef.current = utterance;
		window.speechSynthesis.cancel();
		utterance.lang = 'ko-KR';
		utterance.rate = 0.95;
		utterance.pitch = 1;
		utterance.onstart = () => {
			if (currentUtteranceRef.current === utterance) {
				setIsSpeaking(true);
			}
		};
		utterance.onend = () => {
			if (currentUtteranceRef.current === utterance) {
				currentUtteranceRef.current = null;
				setIsSpeaking(false);
			}
		};
		utterance.onerror = () => {
			if (currentUtteranceRef.current === utterance) {
				currentUtteranceRef.current = null;
				setIsSpeaking(false);
			}
		};
		window.speechSynthesis.speak(utterance);
	}, []);

	const stop = useCallback(() => {
		if (!canUseSpeechSynthesis()) return;
		currentUtteranceRef.current = null;
		window.speechSynthesis.cancel();
		setIsSpeaking(false);
	}, []);

	return { speak, stop, isSupported, isSpeaking };
}
