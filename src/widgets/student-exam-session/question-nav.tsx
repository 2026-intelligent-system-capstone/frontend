import type { BloomLevel, ExamQuestionType } from '@/entities/exam';
import { cn } from '@/shared/ui';

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

function getQuestionButtonLabel(question: NavQuestion, isCurrent: boolean, isAnswered: boolean): string {
	const statusLabel = isAnswered ? '답변 완료' : '미답변';
	const currentLabel = isCurrent ? ', 현재 문항' : '';
	return `${question.question_number}번 ${TYPE_SHORT[question.question_type]} 문항, ${statusLabel}${currentLabel}`;
}

export function QuestionNav({ questions, currentId, answeredIds, onSelect }: QuestionNavProps) {
	const answeredCount = questions.filter((question) => answeredIds.has(question.id)).length;

	return (
		<aside
			aria-label="문항 이동"
			className="border-border-subtle bg-surface/90 flex shrink-0 gap-2 overflow-x-auto border-b px-4 py-3
				backdrop-blur-md md:w-24 md:flex-col md:overflow-x-visible md:border-r md:border-b-0 md:px-3 md:py-4"
		>
			<p
				className="md:text-neutral-gray-500 sr-only md:not-sr-only md:mb-1 md:text-center md:text-[10px]
					md:font-semibold md:tracking-widest md:uppercase"
			>
				문제
			</p>
			{questions.map((question) => {
				const isCurrent = question.id === currentId;
				const isAnswered = answeredIds.has(question.id);
				return (
					<button
						key={question.id}
						aria-current={isCurrent ? 'step' : undefined}
						aria-label={getQuestionButtonLabel(question, isCurrent, isAnswered)}
						className={cn(
							`focus-visible:ring-brand-border flex min-w-16 flex-col items-center gap-1 rounded-2xl border
							px-3 py-2.5 text-xs transition-[border-color,background-color,color,box-shadow] focus-visible:ring-2 focus-visible:outline-none
							md:min-w-0 md:px-2`,
							isCurrent
								? 'border-brand-border bg-brand-soft text-brand-deep shadow-button'
								: isAnswered
									? 'border-brand-border bg-surface text-brand-deep hover:bg-brand-soft'
									: `border-border-subtle bg-surface-muted text-neutral-gray-500
										hover:bg-surface hover:text-neutral-text`,
						)}
						type="button"
						onClick={() => onSelect(question.id)}
					>
						<span className="text-sm leading-none font-bold">{question.question_number}</span>
						<span className="text-[10px] leading-tight opacity-80">
							{TYPE_SHORT[question.question_type]}
						</span>
						{isAnswered && !isCurrent && <span className="text-brand-deep text-[10px]">완료</span>}
					</button>
				);
			})}
			<div className="border-border-subtle hidden text-center md:mt-auto md:block md:border-t md:pt-2">
				<p
					className={cn(
						'text-xs font-bold',
						answeredCount === questions.length ? 'text-brand-deep' : 'text-neutral-gray-500',
					)}
				>
					{answeredCount}/{questions.length}
				</p>
				<p className="text-neutral-gray-500 text-[10px]">완료</p>
			</div>
		</aside>
	);
}
