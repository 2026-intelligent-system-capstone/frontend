'use client';

import { useCallback } from 'react';

export function useTTS() {
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
