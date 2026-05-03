import { SEOUL_TIME_ZONE, dayjs } from '@/shared/lib/dayjs';
import type { ChipProps } from '@heroui/react';

import type { ClassroomMaterial, ClassroomMaterialSourceKind } from '../model/types';

export const MATERIAL_FILE_ACCEPT = '.pdf,.pptx,.docx,.hwpx,.avi,.mp4,.zip,.txt,.md,.csv,.json,.xml';

export const MATERIAL_FILE_GUIDE = 'pdf, pptx, docx, hwpx, avi, mp4, zip, txt, md, csv, json, xml';

export const formatMaterialDateTime = (value: string | null) => {
	if (!value) {
		return '업로드 시각 없음';
	}

	return dayjs.utc(value).tz(SEOUL_TIME_ZONE).format('YYYY.MM.DD HH:mm');
};

export const formatMaterialFileSize = (value: number) => {
	if (value < 1024) {
		return `${value} B`;
	}
	if (value < 1024 * 1024) {
		return `${(value / 1024).toFixed(1)} KB`;
	}

	return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

export const getMaterialSourceKindLabel = (sourceKind: ClassroomMaterialSourceKind) => {
	switch (sourceKind) {
		case 'file':
			return '파일';
		case 'link':
			return '링크';
	}
};

export const getMaterialSourceKindColor = (sourceKind: ClassroomMaterialSourceKind): ChipProps['color'] => {
	switch (sourceKind) {
		case 'file':
			return 'default';
		case 'link':
			return 'accent';
	}
};

export const getMaterialFileTypeLabel = (material: ClassroomMaterial) => {
	if (material.source_kind === 'link') {
		return material.source_url.toLowerCase().includes('youtu') ? 'YOUTUBE' : 'LINK';
	}

	return material.file.file_extension.toUpperCase();
};

export const getMaterialDisplayName = (material: ClassroomMaterial) => {
	if (material.source_kind === 'file') {
		return material.file.file_name;
	}

	return material.source_url;
};

export const getMaterialFileChipColor = (material: ClassroomMaterial): ChipProps['color'] => {
	if (material.source_kind === 'link') {
		return 'accent';
	}

	switch (material.file.file_extension.toLowerCase()) {
		case 'pdf':
			return 'danger';
		case 'pptx':
			return 'accent';
		case 'docx':
			return 'warning';
		case 'hwpx':
			return 'default';
		case 'avi':
		case 'mp4':
			return 'success';
		case 'txt':
		case 'md':
		case 'csv':
		case 'json':
		case 'xml':
			return 'accent';
		case 'zip':
			return 'default';
		default:
			return 'default';
	}
};

export const getMaterialIngestStatusLabel = (status: ClassroomMaterial['ingest_status']) => {
	switch (status) {
		case 'pending':
			return '분석 대기';
		case 'completed':
			return '분석 완료';
		case 'failed':
			return '분석 실패';
	}
};

export const getMaterialIngestStatusDescription = (status: ClassroomMaterial['ingest_status']) => {
	switch (status) {
		case 'pending':
			return '자료를 읽고 핵심 개념을 추출하는 중입니다.';
		case 'completed':
			return '핵심 개념 추출이 끝나 문항 생성에 사용할 수 있습니다.';
		case 'failed':
			return '자료 분석에 실패해 다시 적재가 필요합니다.';
	}
};

export const getMaterialIngestStatusColor = (status: ClassroomMaterial['ingest_status']): ChipProps['color'] => {
	switch (status) {
		case 'pending':
			return 'warning';
		case 'completed':
			return 'success';
		case 'failed':
			return 'danger';
	}
};
