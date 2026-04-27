'use client';

import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface LatexTextProps {
	text: string;
	className?: string;
}

export function LatexText({ text, className }: LatexTextProps) {
	const segments: Array<{ type: 'text' | 'math'; content: string }> = [];
	const regex = /\$([^$]+)\$/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
		}
		segments.push({ type: 'math', content: match[1] });
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < text.length) {
		segments.push({ type: 'text', content: text.slice(lastIndex) });
	}

	return (
		<span className={className}>
			{segments.map((seg, i) =>
				seg.type === 'math' ? <InlineMath key={i} math={seg.content} /> : <span key={i}>{seg.content}</span>,
			)}
		</span>
	);
}
