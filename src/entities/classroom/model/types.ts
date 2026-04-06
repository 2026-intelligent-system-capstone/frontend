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
