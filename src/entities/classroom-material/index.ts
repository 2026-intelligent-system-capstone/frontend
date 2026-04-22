export {
	classroomMaterialsApi,
	useClassroomMaterial,
	useClassroomMaterials,
	useCreateClassroomMaterial,
	useDeleteClassroomMaterial,
	useReingestClassroomMaterial,
} from './api/query';
export {
	formatMaterialDateTime,
	formatMaterialFileSize,
	getMaterialDisplayName,
	getMaterialFileChipColor,
	getMaterialFileTypeLabel,
	getMaterialIngestStatusColor,
	getMaterialIngestStatusDescription,
	getMaterialIngestStatusLabel,
	getMaterialSourceKindColor,
	getMaterialSourceKindLabel,
	MATERIAL_FILE_GUIDE,
} from './lib/presentation';
export { getClassroomMaterialDetailQueryKey, getClassroomMaterialsQueryKey } from './model/query-keys';
export type {
	ClassroomMaterial,
	ClassroomMaterialFile,
	ClassroomMaterialIngestStatus,
	ClassroomMaterialScopeCandidate,
	ClassroomMaterialSourceKind,
	CreateClassroomMaterialRequest,
	UpdateClassroomMaterialRequest,
} from './model/types';
