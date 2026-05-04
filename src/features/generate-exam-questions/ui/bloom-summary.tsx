interface GenerateExamQuestionsBloomSummaryProps {
	totalCount: number;
}

export function GenerateExamQuestionsBloomSummary({ totalCount }: GenerateExamQuestionsBloomSummaryProps) {
	return (
		<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
			<div>
				<p className="text-sm font-medium text-neutral-text">문항 분포 설정</p>
				<p className="mt-1 text-xs text-neutral-gray-500">
					Bloom 분포 합계가 전체 생성 문항 수가 되며, 문제 유형은 전략에 따라 자동 배분합니다.
				</p>
			</div>
			<div className="space-y-1 text-right">
				<p aria-live="polite" className="text-sm font-medium text-neutral-text">
					총 생성 문항 수 {totalCount}개
				</p>
				<p className="text-xs text-neutral-gray-500">Bloom 단계에서 0개인 항목은 생성 요청에서 제외됩니다.</p>
			</div>
		</div>
	);
}
