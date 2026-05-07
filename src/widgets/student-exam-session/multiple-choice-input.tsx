import { cn } from '@/shared/ui';
import { Button } from '@heroui/react';

interface MultipleChoiceInputProps {
	options: string[];
	selected: number[];
	isAnswered: boolean;
	isDisabled?: boolean;
	disabledReason?: string;
	isSubmitting?: boolean;
	onChange: (indices: number[]) => void;
	onSubmit: (indices: number[]) => void;
}

export function MultipleChoiceInput({
	options,
	selected,
	isAnswered,
	isDisabled = false,
	disabledReason,
	isSubmitting = false,
	onChange,
	onSubmit,
}: MultipleChoiceInputProps) {
	const isInteractionDisabled = isAnswered || isSubmitting || isDisabled;
	const choose = (index: number) => {
		if (isInteractionDisabled) return;
		onChange([index]);
	};

	return (
		<div
			className="border-border-subtle bg-surface shadow-card flex w-full max-w-2xl flex-col gap-4 rounded-3xl
				border p-5 sm:p-6"
		>
			<fieldset className="contents" aria-describedby="multiple-choice-help">
				<legend className="sr-only">객관식 답안 선택</legend>
				{options.map((option, index) => {
					const isSelected = selected.includes(index);
					return (
						<label
							key={index}
							className={cn(
								`has-[:focus-visible]:ring-brand-border flex items-center gap-3 rounded-2xl border px-4
								py-3 text-left text-sm transition-[border-color,background-color,color,box-shadow]
								has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2
								has-[:focus-visible]:ring-offset-white`,
								isSelected
									? 'border-brand-border bg-brand-soft text-brand-deep shadow-button'
									: `border-border-subtle bg-surface-muted text-neutral-text hover:border-brand-border
										hover:bg-surface`,
								isInteractionDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
							)}
						>
							<input
								aria-label={`${String(index + 1)}번 선택지: ${option}`}
								checked={isSelected}
								className="peer sr-only"
								disabled={isInteractionDisabled}
								name="multiple-choice-answer"
								type="radio"
								onChange={() => choose(index)}
							/>
							<span
								aria-hidden="true"
								className={cn(
									`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs
									font-bold`,
									isSelected
										? 'border-brand-border bg-brand-soft text-brand-deep'
										: 'border-border-subtle bg-surface text-neutral-gray-500',
								)}
							>
								{isSelected ? '✓' : String(index + 1)}
							</span>
							<span className="flex-1 leading-relaxed">{option}</span>
						</label>
					);
				})}
			</fieldset>
			<div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<p id="multiple-choice-help" className="text-neutral-gray-500 text-xs">
					{disabledReason ?? '하나의 답안을 선택하세요.'}
				</p>
				{!isAnswered && (
					<Button
						className="shadow-button w-full sm:w-auto"
						isDisabled={selected.length === 0 || isDisabled || isSubmitting}
						isPending={isSubmitting}
						variant="primary"
						onPress={() => onSubmit(selected)}
					>
						{isSubmitting ? '제출 중...' : '제출'}
					</Button>
				)}
				{isAnswered && <p className="text-brand-deep text-xs font-medium">제출 완료</p>}
			</div>
		</div>
	);
}
