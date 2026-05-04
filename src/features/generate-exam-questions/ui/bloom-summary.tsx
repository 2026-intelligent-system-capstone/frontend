interface GenerateExamQuestionsBloomSummaryProps {
	totalCount: number;
}

export function GenerateExamQuestionsBloomSummary({ totalCount }: GenerateExamQuestionsBloomSummaryProps) {
	return (
		<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
			<div>
				<p className="text-neutral-text text-sm font-medium">문항 분포 설정</p>
				<p className="text-neutral-gray-500 mt-1 text-xs">
					Bloom 분포 합계가 전체 생성 문항 수가 되며, 문제 유형은 전략에 따라 자동 배분합니다.
				</p>
			</div>
			<div className="space-y-1 text-right">
				<p aria-live="polite" className="text-neutral-text text-sm font-medium">
					총 생성 문항 수 {totalCount}개
				</p>
				<p className="text-neutral-gray-500 text-xs">Bloom 단계에서 0개인 항목은 생성 요청에서 제외됩니다.</p>
			</div>
		</div>
	);
}
