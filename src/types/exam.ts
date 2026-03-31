export type ExamType = 'quiz' | 'midterm' | 'final' | 'mock';
export type ExamStatus = 'ready' | 'in_progress' | 'closed';
export type ExamSessionStatus = 'ready' | 'in_progress' | 'completed' | 'expired' | 'cancelled';
export type ExamTurnRole = 'student' | 'assistant' | 'system';
export type ExamTurnEventType =
	| 'question'
	| 'answer'
	| 'follow_up'
	| 'message'
	| 'transcript'
	| 'session_started'
	| 'session_completed';
export type ExamResultStatus = 'pending' | 'completed';

export interface ExamCriterion {
	id: string;
	title: string;
	description: string | null;
	weight: number;
	sort_order: number;
	excellent_definition: string | null;
	average_definition: string | null;
	poor_definition: string | null;
}

export interface Exam {
	id: string;
	classroom_id: string;
	title: string;
	description: string | null;
	exam_type: ExamType;
	status: ExamStatus;
	duration_minutes: number;
	starts_at: string;
	ends_at: string;
	allow_retake: boolean;
	criteria: ExamCriterion[];
}

export interface CreateExamCriterionRequest {
	title: string;
	description?: string | null;
	weight: number;
	sort_order: number;
	excellent_definition?: string | null;
	average_definition?: string | null;
	poor_definition?: string | null;
}

export interface CreateExamRequest {
	title: string;
	description?: string | null;
	exam_type: ExamType;
	duration_minutes: number;
	starts_at: string;
	ends_at: string;
	allow_retake?: boolean;
	criteria: CreateExamCriterionRequest[];
}

export interface ExamSession {
	session_id: string;
	exam_id: string;
	student_id: string;
	status: ExamSessionStatus;
	started_at: string;
	ended_at: string | null;
	expires_at: string | null;
	client_secret: string | null;
}

export interface ExamResult {
	id: string;
	exam_id: string;
	session_id: string;
	student_id: string;
	status: ExamResultStatus;
	submitted_at: string | null;
	overall_score: number | null;
	summary: string | null;
}

export interface ExamTurn {
	id: string;
	session_id: string;
	sequence: number;
	role: ExamTurnRole;
	event_type: ExamTurnEventType;
	content: string;
	created_at: string;
	metadata: Record<string, string>;
}

export interface RecordExamTurnRequest {
	role: ExamTurnRole;
	event_type: ExamTurnEventType;
	content: string;
	metadata?: Record<string, string>;
	occurred_at: string;
}

export interface CompleteExamSessionRequest {
	occurred_at: string;
}

export interface FinalizeExamResultRequest {
	overall_score: number;
	summary: string;
	occurred_at: string;
}
