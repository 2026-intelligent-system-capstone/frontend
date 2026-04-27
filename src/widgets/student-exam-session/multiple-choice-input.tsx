import { Button } from '@heroui/react';

interface MultipleChoiceInputProps {
	options: string[];
	selected: number[];
	isAnswered: boolean;
	onChange: (indices: number[]) => void;
	onSubmit: (indices: number[]) => void;
}

export function MultipleChoiceInput({ options, selected, isAnswered, onChange, onSubmit }: MultipleChoiceInputProps) {
	const toggle = (index: number) => {
		if (isAnswered) return;
		if (selected.includes(index)) {
			onChange(selected.filter((i) => i !== index));
		} else {
			onChange([...selected, index]);
		}
	};

	return (
		<div className="flex w-full max-w-2xl flex-col gap-3">
			{options.map((option, index) => {
				const isSelected = selected.includes(index);
				return (
					<button
						key={index}
						disabled={isAnswered}
						onClick={() => toggle(index)}
						className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
							isSelected
								? 'border-violet-500 bg-violet-600/30 text-white'
								: 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30 hover:bg-white/10'
						} ${isAnswered ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
					>
						<span
							className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${
								isSelected ? 'border-violet-400 bg-violet-500 text-white' : 'border-white/30 text-slate-400'
							}`}
						>
							{isSelected ? '✓' : String.fromCharCode(65 + index)}
						</span>
						<span className="flex-1">{option}</span>
					</button>
				);
			})}
			<div className="mt-1 flex items-center justify-between">
				<p className="text-xs text-slate-500">복수 선택 가능</p>
				{!isAnswered && (
					<Button isDisabled={selected.length === 0} variant="primary" onPress={() => onSubmit(selected)}>
						제출
					</Button>
				)}
				{isAnswered && <p className="text-xs font-medium text-emerald-400">✓ 제출 완료</p>}
			</div>
		</div>
	);
}
