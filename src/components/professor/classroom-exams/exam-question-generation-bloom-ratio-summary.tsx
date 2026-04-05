interface ExamQuestionGenerationBloomRatioSummaryProps {
	totalCount: number;
}

export function ExamQuestionGenerationBloomRatioSummary({ totalCount }: ExamQuestionGenerationBloomRatioSummaryProps) {
	return (
		<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
			<div>
				<p className="text-sm font-medium text-slate-800">Bloom 분포 설정</p>
				<p className="mt-1 text-xs text-slate-500">
					좌측 피라미드로 단계 구성을 확인하고, 우측에서 단계별 문항 수를 직접 조정하세요.
				</p>
			</div>
			<div className="space-y-1 text-right">
				<p aria-live="polite" className="text-sm font-medium text-slate-800">
					현재 합계 {totalCount}개
				</p>
				<p className="text-xs text-slate-500">단계별 문항 수 합계가 생성 요청의 총 문항 수로 사용됩니다.</p>
			</div>
		</div>
	);
}
