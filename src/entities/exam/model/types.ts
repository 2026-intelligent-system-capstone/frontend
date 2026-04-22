export type ExamType = 'weekly' | 'midterm' | 'final' | 'mock' | 'project';
export type ExamStatus = 'ready' | 'in_progress' | 'closed';
export type ExamDifficulty = 'easy' | 'medium' | 'hard';
export type ExamGenerationStatus = 'idle' | 'queued' | 'running' | 'completed' | 'failed';
export type AsyncJobStatus = 'queued' | 'running' | 'completed' | 'failed';
export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
export type ExamQuestionType = 'none' | 'multiple_choice' | 'subjective' | 'oral';
export type ExamQuestionTypeStrategy = 'balanced' | 'multiple_choice_focus' | 'subjective_focus' | 'oral_focus';
export type ExamQuestionStatus = 'generated' | 'reviewed' | 'deleted';
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

export interface ExamQuestion {
	id: string;
	exam_id: string;
	question_number: number;
	max_score: number;
	question_type: ExamQuestionType;
	bloom_level: BloomLevel;
	difficulty: ExamDifficulty;
	question_text: string;
	intent_text: string;
	rubric_text: string;
	answer_options: string[];
	correct_answer_text: string | null;
	source_material_ids: string[];
	status: ExamQuestionStatus;
}

export interface Exam {
	id: string;
	classroom_id: string;
	title: string;
	description: string | null;
	exam_type: ExamType;
	status: ExamStatus;
	generation_status: ExamGenerationStatus;
	generation_error: string | null;
	generation_job_id: string | null;
	generation_requested_at: string | null;
	generation_completed_at: string | null;
	duration_minutes: number;
	week: number;
	starts_at: string;
	ends_at: string;
	max_attempts: number;
	criteria: ExamCriterion[];
	questions: ExamQuestion[];
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
	week: number;
	starts_at: string;
	ends_at: string;
	max_attempts: number;
	criteria: CreateExamCriterionRequest[];
}

export interface ExamQuestionBloomCountRequest {
	bloom_level: BloomLevel;
	count: number;
}

export interface ExamQuestionTypeCountRequest {
	question_type: Exclude<ExamQuestionType, 'none'>;
	count: number;
}

export interface GenerateExamQuestionsRequest {
	scope_text: string;
	max_follow_ups: number;
	difficulty: ExamDifficulty;
	source_material_ids: string[];
	bloom_counts: ExamQuestionBloomCountRequest[];
	question_type_counts?: ExamQuestionTypeCountRequest[];
	total_question_count?: number;
	question_type_strategy?: ExamQuestionTypeStrategy;
}

export interface GenerateExamQuestionsSubmitResponse {
	exam_id: string;
	generation_status: ExamGenerationStatus;
	job_id: string;
	job_status: AsyncJobStatus;
	generation_requested_at: string | null;
	generation_error: string | null;
}

export interface CreateExamQuestionRequest {
	question_number: number;
	max_score: number;
	question_type: Exclude<ExamQuestionType, 'none'>;
	bloom_level: BloomLevel;
	difficulty: ExamDifficulty;
	question_text: string;
	intent_text: string;
	rubric_text?: string | null;
	answer_options: string[];
	correct_answer_text: string | null;
	source_material_ids: string[];
}

export interface UpdateExamQuestionRequest {
	question_number?: number;
	max_score?: number;
	question_type?: Exclude<ExamQuestionType, 'none'>;
	bloom_level?: BloomLevel;
	difficulty?: ExamDifficulty;
	question_text?: string;
	intent_text?: string;
	rubric_text?: string | null;
	answer_options?: string[];
	correct_answer_text?: string | null;
	source_material_ids?: string[];
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

export interface TopicAssessment {
	topic: string;
	bloom_level_achieved: BloomLevel | null;
	reasoning: string;
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
	topic_assessments: TopicAssessment[];
	strengths: string[];
	weaknesses: string[];
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
	occurred_at: string;
}
