import { type DateValue, parseZonedDateTime } from '@internationalized/date';

import type { CreateExamRequest, ExamType } from '@/types/exam';

import { SEOUL_TIME_ZONE, dayjs } from '@/lib/dayjs';

export const examTypeOptions: Array<{ label: string; value: ExamType }> = [
	{ label: '퀴즈', value: 'quiz' },
	{ label: '중간', value: 'midterm' },
	{ label: '기말', value: 'final' },
	{ label: '모의', value: 'mock' },
];

export type DateRangeValue = {
	start: DateValue;
	end: DateValue;
};

const buildDefaultZonedDateTime = (daysToAdd: number, hour: number, minute: number) => {
	return `${dayjs()
		.tz(SEOUL_TIME_ZONE)
		.add(daysToAdd, 'day')
		.hour(hour)
		.minute(minute)
		.second(0)
		.millisecond(0)
		.format('YYYY-MM-DDTHH:mm:ss')}[${SEOUL_TIME_ZONE}]`;
};

export const buildDefaultScheduleRange = (): DateRangeValue => ({
	start: parseZonedDateTime(buildDefaultZonedDateTime(1, 9, 0)),
	end: parseZonedDateTime(buildDefaultZonedDateTime(1, 10, 0)),
});

export const toUtcIsoString = (value: DateValue) => {
	return dayjs(value.toDate(SEOUL_TIME_ZONE)).utc().toISOString();
};

export const defaultExamCriteria: CreateExamRequest['criteria'] = [
	{
		title: '정확성',
		description: '질문 의도에 맞게 핵심 내용을 정확히 설명하는지 평가합니다.',
		weight: 40,
		sort_order: 1,
		excellent_definition: '핵심 개념과 근거를 정확하게 설명합니다.',
		average_definition: '핵심 개념은 설명하지만 근거나 연결이 일부 부족합니다.',
		poor_definition: '핵심 개념 설명이 부정확하거나 누락됩니다.',
	},
	{
		title: '이해도',
		description: '개념 간 관계와 맥락을 충분히 이해하고 있는지 평가합니다.',
		weight: 35,
		sort_order: 2,
		excellent_definition: '개념 간 관계와 맥락을 명확히 연결합니다.',
		average_definition: '핵심 맥락은 이해하지만 연결 설명이 다소 약합니다.',
		poor_definition: '개념 간 관계를 설명하지 못합니다.',
	},
	{
		title: '표현력',
		description: '답변 구조와 전달력이 명확한지 평가합니다.',
		weight: 25,
		sort_order: 3,
		excellent_definition: '답변 구조가 명확하고 전달이 자연스럽습니다.',
		average_definition: '전달은 가능하지만 구조가 다소 불안정합니다.',
		poor_definition: '답변 구조가 불명확해 이해가 어렵습니다.',
	},
];
