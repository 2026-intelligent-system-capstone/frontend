export interface ClassroomMaterialFile {
	id: string;
	file_name: string;
	file_path: string;
	file_extension: string;
	file_size: number;
	mime_type: string;
}

export interface ClassroomMaterialScopeCandidate {
	label: string;
	scope_text: string;
	keywords: string[];
	week_range: string | null;
	confidence: number | null;
}

export type ClassroomMaterialIngestStatus = 'pending' | 'completed' | 'failed';

export interface ClassroomMaterial {
	id: string;
	classroom_id: string;
	title: string;
	week: number;
	description: string | null;
	uploaded_by: string;
	uploaded_at: string | null;
	ingest_status: ClassroomMaterialIngestStatus;
	ingest_error: string | null;
	scope_candidates: ClassroomMaterialScopeCandidate[];
	file: ClassroomMaterialFile;
}

export interface CreateClassroomMaterialRequest {
	title: string;
	week: number;
	description?: string | null;
	uploaded_file: File;
}

export interface UpdateClassroomMaterialRequest {
	title?: string;
	week?: number;
	description?: string | null;
	uploaded_file?: File;
}
