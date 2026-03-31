export interface Classroom {
	id: string;
	name: string;
	professor_ids: string[];
	grade: number;
	semester: string;
	section: string;
	description: string | null;
	student_ids: string[];
	allow_student_material_access: boolean;
}

export interface CreateClassroomRequest {
	name: string;
	professor_ids: string[];
	grade: number;
	semester: string;
	section: string;
	description?: string | null;
	student_ids?: string[];
	allow_student_material_access?: boolean;
}

export type UpdateClassroomRequest = Partial<CreateClassroomRequest>;

export interface InviteClassroomStudentsRequest {
	student_ids: string[];
}

export interface ClassroomMaterialFile {
	id: string;
	file_name: string;
	file_path: string;
	file_extension: string;
	file_size: number;
	mime_type: string;
}

export interface ClassroomMaterial {
	id: string;
	classroom_id: string;
	title: string;
	week: number;
	description: string | null;
	uploaded_by: string;
	uploaded_at: string | null;
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
