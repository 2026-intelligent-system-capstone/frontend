import type { BloomLevel, ExamQuestionType } from '@/entities/exam';

interface NavQuestion {
	id: string;
	question_number: number;
	question_type: ExamQuestionType;
	bloom_level: BloomLevel;
}

interface QuestionNavProps {
	questions: NavQuestion[];
	currentId: string;
	answeredIds: Set<string>;
	onSelect: (id: string) => void;
}

const TYPE_SHORT: Record<ExamQuestionType, string> = {
	none: '-',
	multiple_choice: '객관',
	subjective: '주관',
	oral: '구술',
};

export function QuestionNav({ questions, currentId, answeredIds, onSelect }: QuestionNavProps) {
	return (
		<aside className="flex w-[72px] shrink-0 flex-col gap-2 border-r border-white/10 bg-[#16213e]/80 px-2 py-4 backdrop-blur-sm">
			<p className="mb-1 text-center text-[9px] font-semibold uppercase tracking-widest text-slate-500">문제</p>
			{questions.map((q) => {
				const isCurrent = q.id === currentId;
				const isAnswered = answeredIds.has(q.id);
				return (
					<button
						key={q.id}
						onClick={() => onSelect(q.id)}
						className={`flex flex-col items-center gap-0.5 rounded-xl py-2.5 transition-all ${
							isCurrent
								? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
								: isAnswered
									? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60'
									: 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
						}`}
					>
						<span className="text-sm font-bold leading-none">{q.question_number}</span>
						<span className="text-[9px] leading-tight opacity-80">{TYPE_SHORT[q.question_type]}</span>
						{isAnswered && !isCurrent && <span className="mt-0.5 text-[10px] text-emerald-400">✓</span>}
					</button>
				);
			})}
		</aside>
	);
}
