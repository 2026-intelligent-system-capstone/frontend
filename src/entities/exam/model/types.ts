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
export type StudentExamResultStatus = ExamResultStatus | null;

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

export interface StudentExamSessionQuestion {
	id: string;
	exam_id: string;
	question_number: number;
	max_score: number;
	question_type: Exclude<ExamQuestionType, 'none'>;
	bloom_level: BloomLevel;
	difficulty: ExamDifficulty;
	question_text: string;
	answer_options: string[];
	status: ExamQuestionStatus;
}

export interface StudentExamSessionSheet {
	id: string;
	classroom_id: string;
	title: string;
	description: string | null;
	exam_type: ExamType;
	status: ExamStatus;
	duration_minutes: number;
	week: number;
	starts_at: string;
	ends_at: string;
	max_attempts: number;
	question_count: number;
	difficulty: ExamDifficulty;
	questions: StudentExamSessionQuestion[];
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
	question_count: number;
	difficulty: ExamDifficulty;
	criteria: ExamCriterion[];
	questions: ExamQuestion[];
}

export interface StudentExamPayload extends Exam {
	is_completed: boolean;
	can_enter: boolean;
	has_result: boolean;
	classroom_name?: string;
	result_status?: StudentExamResultStatus;
	remaining_attempts?: number | null;
}

export type StudentExam = StudentExamPayload;

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
	question_count: number;
	difficulty: ExamDifficulty;
	criteria: CreateExamCriterionRequest[];
}

export interface ExamQuestionBloomWeightRequest {
	bloom_level: BloomLevel;
	weight: number;
}

export interface ExamQuestionTypeCountRequest {
	question_type: Exclude<ExamQuestionType, 'none'>;
	count: number;
}

export interface GenerateExamQuestionsRequest {
	scope_text: string;
	max_follow_ups: number;
	source_material_ids: string[];
	bloom_weights: ExamQuestionBloomWeightRequest[];
	question_type_counts?: ExamQuestionTypeCountRequest[];
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

export interface ExamCriterionResult {
	criterion_id: string;
	score: number | null;
	feedback: string | null;
	title?: string;
	max_score?: number | null;
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
	topic_assessments?: TopicAssessment[];
	strengths: string[];
	weaknesses: string[];
	criteria_results: ExamCriterionResult[];
	improvement_suggestions: string[];
}

export interface StudentExamResult extends ExamResult {
	exam_title?: string | null;
	classroom_name?: string | null;
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

export interface GenerateExamFollowUpRequest {
	question_id: string;
	answer_content: string;
	metadata?: Record<string, string>;
	occurred_at: string;
}

export type GenerateExamFollowUpResponse = ExamTurn;

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
