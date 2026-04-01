'use client';

import { Button, ErrorMessage, Input, Label, ListBox, Modal, Select, TextArea, TextField } from '@heroui/react';
import { useId, useMemo, useState } from 'react';

import { dayjs, SEOUL_TIME_ZONE } from '@/lib/dayjs';
import { useCreateExam } from '@/lib/hooks/use-classrooms';
import { ApiClientError } from '@/types/api';
import type { ExamType } from '@/types/exam';

interface ExamCreateModalProps {
	classroomId: string;
}

const examTypeOptions: Array<{ label: string; value: ExamType }> = [
	{ label: '퀴즈', value: 'quiz' },
	{ label: '중간', value: 'midterm' },
	{ label: '기말', value: 'final' },
	{ label: '모의', value: 'mock' },
];

const buildDefaultDateTime = (daysToAdd: number, hour: number, minute: number) => {
	return dayjs()
		.tz(SEOUL_TIME_ZONE)
		.add(daysToAdd, 'day')
		.hour(hour)
		.minute(minute)
		.second(0)
		.millisecond(0)
		.format('YYYY-MM-DDTHH:mm');
};

const toUtcIsoString = (value: string) => {
	return dayjs.tz(value, SEOUL_TIME_ZONE).utc().toISOString();
};

export function ExamCreateModal({ classroomId }: ExamCreateModalProps) {
	const titleId = useId();
	const descriptionId = useId();
	const durationId = useId();
	const startsAtId = useId();
	const endsAtId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [examType, setExamType] = useState<ExamType>('quiz');
	const { mutateAsync: createExam, isPending } = useCreateExam(classroomId);

	const defaultStartsAt = useMemo(() => buildDefaultDateTime(1, 9, 0), []);
	const defaultEndsAt = useMemo(() => buildDefaultDateTime(1, 10, 0), []);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, close: () => void) => {
		event.preventDefault();
		setErrorMessage(null);

		const form = event.currentTarget;
		const formData = new FormData(form);
		const title = String(formData.get('title') ?? '').trim();
		const descriptionValue = String(formData.get('description') ?? '').trim();
		const durationMinutes = Number(formData.get('duration_minutes'));
		const startsAtValue = String(formData.get('starts_at') ?? '').trim();
		const endsAtValue = String(formData.get('ends_at') ?? '').trim();

		try {
			await createExam({
				title,
				description: descriptionValue || null,
				exam_type: examType,
				duration_minutes: durationMinutes,
				starts_at: toUtcIsoString(startsAtValue),
				ends_at: toUtcIsoString(endsAtValue),
				allow_retake: false,
				criteria: [
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
				],
			});

			form.reset();
			setExamType('quiz');
			close();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('시험 생성 중 오류가 발생했습니다.');
		}
	};

	return (
		<Modal>
			<Button variant="primary" onPress={() => setIsOpen(true)}>
				시험 생성
			</Button>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-2xl">
						{({ close }) => (
							<>
								<Modal.CloseTrigger />
								<Modal.Header>
									<Modal.Heading>시험 생성</Modal.Heading>
									<p className="mt-1 text-sm text-slate-500">시험 메타데이터를 먼저 생성한 뒤 문항을 추가하거나 AI 생성 기능을 사용할 수 있습니다.</p>
								</Modal.Header>
								<Modal.Body className="p-6">
									<form className="space-y-4" onSubmit={(event) => handleSubmit(event, close)}>
										<TextField isRequired className="w-full" name="title">
											<Label htmlFor={titleId}>시험명</Label>
											<Input id={titleId} placeholder="예: 1차 중간 구술평가" />
										</TextField>

										<div className="grid gap-4 md:grid-cols-2">
											<Select className="w-full" name="exam_type" value={examType} onChange={(value) => setExamType(value as ExamType)}>
												<Label>시험 유형</Label>
												<Select.Trigger>
													<Select.Value />
													<Select.Indicator />
												</Select.Trigger>
												<Select.Popover>
													<ListBox>
														{examTypeOptions.map((option) => (
															<ListBox.Item key={option.value} id={option.value} textValue={option.label}>
																{option.label}
																<ListBox.ItemIndicator />
															</ListBox.Item>
														))}
													</ListBox>
												</Select.Popover>
											</Select>

											<TextField isRequired className="w-full" defaultValue="60" name="duration_minutes">
												<Label htmlFor={durationId}>시험 시간(분)</Label>
												<Input id={durationId} min={1} max={600} step={1} type="number" />
											</TextField>
										</div>

										<div className="grid gap-4 md:grid-cols-2">
											<TextField isRequired className="w-full" defaultValue={defaultStartsAt} name="starts_at">
												<Label htmlFor={startsAtId}>시작 일시</Label>
												<Input id={startsAtId} type="datetime-local" />
											</TextField>

											<TextField isRequired className="w-full" defaultValue={defaultEndsAt} name="ends_at">
												<Label htmlFor={endsAtId}>종료 일시</Label>
												<Input id={endsAtId} type="datetime-local" />
											</TextField>
										</div>

										<TextField className="w-full" name="description">
											<Label htmlFor={descriptionId}>설명</Label>
											<TextArea id={descriptionId} className="min-h-28" placeholder="시험 범위나 운영 방식을 입력하세요." />
										</TextField>

										{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

										<div className="flex justify-end gap-3">
											<Button type="button" variant="secondary" onPress={close}>
												취소
											</Button>
											<Button isPending={isPending} type="submit" variant="primary">
												생성
											</Button>
										</div>
									</form>
								</Modal.Body>
							</>
						)}
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}
