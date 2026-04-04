import type { ChipProps } from '@heroui/react';

import { SEOUL_TIME_ZONE, dayjs } from '@/lib/dayjs';
import type { ClassroomMaterial } from '@/types/classroom';

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

export const getMaterialFileChipColor = (extension: string): ChipProps['color'] => {
	switch (extension.toLowerCase()) {
		case 'pdf':
			return 'danger';
		case 'ppt':
		case 'pptx':
			return 'accent';
		case 'doc':
		case 'docx':
			return 'warning';
		default:
			return 'default';
	}
};

export const getMaterialIngestStatusLabel = (status: ClassroomMaterial['ingest_status']) => {
	switch (status) {
		case 'pending':
			return '적재 대기';
		case 'completed':
			return '적재 완료';
		case 'failed':
			return '적재 실패';
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
