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
export type ClassroomMaterialSourceKind = 'file' | 'link';

export interface ClassroomMaterialBase {
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
}

export interface ClassroomMaterialFileSource extends ClassroomMaterialBase {
	source_kind: 'file';
	source_url: null;
	file: ClassroomMaterialFile;
}

export interface ClassroomMaterialLinkSource extends ClassroomMaterialBase {
	source_kind: 'link';
	source_url: string;
	file: null;
}

export type ClassroomMaterial = ClassroomMaterialFileSource | ClassroomMaterialLinkSource;

export interface CreateClassroomMaterialFileRequest {
	title: string;
	week: number;
	source_kind: 'file';
	uploaded_file: File;
}

export interface CreateClassroomMaterialLinkRequest {
	title: string;
	week: number;
	source_kind: 'link';
	source_url: string;
}

export type CreateClassroomMaterialRequest = CreateClassroomMaterialFileRequest | CreateClassroomMaterialLinkRequest;

export interface UpdateClassroomMaterialBaseRequest {
	title?: string;
	week?: number;
	description?: string | null;
}

export type UpdateClassroomMaterialRequest =
	| (UpdateClassroomMaterialBaseRequest & {
			source_kind?: 'file';
			uploaded_file?: File;
			source_url?: never;
	  })
	| (UpdateClassroomMaterialBaseRequest & {
			source_kind?: 'link';
			source_url?: string;
			uploaded_file?: never;
	  });
