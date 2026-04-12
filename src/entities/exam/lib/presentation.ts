import { SEOUL_TIME_ZONE, dayjs } from '@/shared/lib/dayjs';
import type { ChipProps } from '@heroui/react';

import type { BloomLevel, Exam, ExamDifficulty, ExamQuestionStatus } from '../model/types';

export const formatExamDateTime = (value: string) => {
	return dayjs.utc(value).tz(SEOUL_TIME_ZONE).format('YYYY.MM.DD HH:mm');
};

export const getExamTypeLabel = (type: Exam['exam_type']) => {
	switch (type) {
		case 'quiz':
			return '주간평가';
		case 'midterm':
			return '중간평가';
		case 'final':
			return '기말평가';
		case 'midterm_final':
			return '프로젝트평가';
		case 'mock':
			return '모의평가';
	}
};

export const getExamTypeColor = (type: Exam['exam_type']): ChipProps['color'] => {
	switch (type) {
		case 'quiz':
			return 'accent';
		case 'midterm':
			return 'warning';
		case 'final':
			return 'danger';
		case 'midterm_final':
			return 'warning';
		case 'mock':
			return 'success';
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
