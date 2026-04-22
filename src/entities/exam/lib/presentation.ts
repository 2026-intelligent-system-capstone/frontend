import { SEOUL_TIME_ZONE, dayjs } from '@/shared/lib/dayjs';
import type { ChipProps } from '@heroui/react';

import type {
	BloomLevel,
	Exam,
	ExamDifficulty,
	ExamGenerationStatus,
	ExamQuestionStatus,
	ExamQuestionType,
} from '../model/types';

export const formatExamDateTime = (value: string) => {
	return dayjs.utc(value).tz(SEOUL_TIME_ZONE).format('YYYY.MM.DD HH:mm');
};

export const getExamTypeLabel = (type: Exam['exam_type']) => {
	switch (type) {
		case 'weekly':
			return '주간평가';
		case 'midterm':
			return '중간평가';
		case 'final':
			return '기말평가';
		case 'mock':
			return '모의평가';
		case 'project':
			return '프로젝트 평가';
	}
};

export const getExamTypeColor = (type: Exam['exam_type']): ChipProps['color'] => {
	switch (type) {
		case 'weekly':
			return 'accent';
		case 'midterm':
			return 'warning';
		case 'final':
			return 'danger';
		case 'mock':
			return 'success';
		case 'project':
			return 'default';
	}
};

export const getExamStatusLabel = (status: Exam['status']) => {
	switch (status) {
		case 'ready':
			return '준비';
		case 'in_progress':
			return '진행 중';
		case 'closed':
			return '종료';
	}
};

export const getExamStatusColor = (status: Exam['status']): ChipProps['color'] => {
	switch (status) {
		case 'ready':
			return 'accent';
		case 'in_progress':
			return 'success';
		case 'closed':
			return 'default';
	}
};

export const getExamMaxAttemptsLabel = (maxAttempts: Exam['max_attempts']) => {
	return `총 ${maxAttempts}회`;
};

export const getExamGenerationStatusLabel = (status: ExamGenerationStatus) => {
	switch (status) {
		case 'idle':
			return '대기';
		case 'queued':
			return '생성 대기 중';
		case 'running':
			return '생성 중';
		case 'completed':
			return '생성 완료';
		case 'failed':
			return '생성 실패';
	}
};

export const getExamGenerationStatusColor = (status: ExamGenerationStatus): ChipProps['color'] => {
	switch (status) {
		case 'idle':
			return 'default';
		case 'queued':
			return 'warning';
		case 'running':
			return 'accent';
		case 'completed':
			return 'success';
		case 'failed':
			return 'danger';
	}
};

export const getExamGenerationStatusDescription = (status: ExamGenerationStatus) => {
	switch (status) {
		case 'idle':
			return '아직 AI 문항 생성을 시작하지 않았습니다.';
		case 'queued':
			return 'AI 문항 생성 작업이 접수되어 대기 중입니다.';
		case 'running':
			return 'AI가 문항을 생성하고 있습니다. 잠시 후 자동으로 갱신됩니다.';
		case 'completed':
			return 'AI 문항 생성이 완료되었습니다.';
		case 'failed':
			return 'AI 문항 생성이 실패했습니다. 오류를 확인한 뒤 다시 시도하세요.';
	}
};

export const getBloomLevelLabel = (level: BloomLevel) => {
	switch (level) {
		case 'remember':
			return '기억';
		case 'understand':
			return '이해';
		case 'apply':
			return '적용';
		case 'analyze':
			return '분석';
		case 'evaluate':
			return '평가';
		case 'create':
			return '종합';
	}
};

export const getBloomLevelColor = (level: BloomLevel): ChipProps['color'] => {
	switch (level) {
		case 'remember':
			return 'default';
		case 'understand':
			return 'accent';
		case 'apply':
			return 'success';
		case 'analyze':
			return 'warning';
		case 'evaluate':
			return 'danger';
		case 'create':
			return 'accent';
	}
};

export const getDifficultyLabel = (difficulty: ExamDifficulty) => {
	switch (difficulty) {
		case 'easy':
			return '쉬움';
		case 'medium':
			return '보통';
		case 'hard':
			return '어려움';
	}
};

export const getDifficultyColor = (difficulty: ExamDifficulty): ChipProps['color'] => {
	switch (difficulty) {
		case 'easy':
			return 'success';
		case 'medium':
			return 'warning';
		case 'hard':
			return 'danger';
	}
};

export const getQuestionTypeLabel = (questionType: ExamQuestionType) => {
	switch (questionType) {
		case 'none':
			return '미지정';
		case 'multiple_choice':
			return '객관식';
		case 'subjective':
			return '주관식';
		case 'oral':
			return '구술형';
	}
};

export const getQuestionTypeColor = (questionType: ExamQuestionType): ChipProps['color'] => {
	switch (questionType) {
		case 'none':
			return 'default';
		case 'multiple_choice':
			return 'accent';
		case 'subjective':
			return 'warning';
		case 'oral':
			return 'success';
	}
};

export const getQuestionStatusLabel = (status: ExamQuestionStatus) => {
	switch (status) {
		case 'generated':
			return '생성됨';
		case 'reviewed':
			return '검토됨';
		case 'deleted':
			return '삭제됨';
	}
};

export const getQuestionStatusColor = (status: ExamQuestionStatus): ChipProps['color'] => {
	switch (status) {
		case 'generated':
			return 'accent';
		case 'reviewed':
			return 'success';
		case 'deleted':
			return 'default';
	}
};
