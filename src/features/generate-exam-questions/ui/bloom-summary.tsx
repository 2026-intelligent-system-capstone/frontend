interface GenerateExamQuestionsBloomSummaryProps {
	questionCount: number;
	totalWeight: number;
}

export function GenerateExamQuestionsBloomSummary({
	questionCount,
	totalWeight,
}: GenerateExamQuestionsBloomSummaryProps) {
	return (
		<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
			<div>
				<p className="text-neutral-text text-sm font-medium">Bloom 가중치 설정</p>
				<p className="text-neutral-gray-500 mt-1 text-xs">
					가중치 비율에 따라 목표 문항 {questionCount}개를 서버가 최종 배분합니다.
				</p>
			</div>
			<div className="space-y-1 text-right">
				<p aria-live="polite" className="text-neutral-text text-sm font-medium">
					가중치 합계 {totalWeight}
				</p>
				<p className="text-neutral-gray-500 text-xs">0인 Bloom 단계는 생성 요청에서 제외됩니다.</p>
			</div>
		</div>
	);
}
