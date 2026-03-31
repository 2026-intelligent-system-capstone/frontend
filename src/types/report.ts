export interface BloomStageReport {
	stage: string;
	score: number;
	description: string;
}

export interface ExamFeedbackReport {
	topic: string;
	strengths: string[];
	weaknesses: string[];
	feedback: string;
}
