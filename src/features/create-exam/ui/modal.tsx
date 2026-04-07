'use client';

import { useId, useMemo, useState } from 'react';

import type { ExamType } from '@/entities/exam';
import { ApiClientError } from '@/shared/api/types';
import { Button, ErrorMessage, Input, Label, ListBox, Modal, Select, TextArea, TextField } from '@heroui/react';

import {
	type DateRangeValue,
	buildDefaultScheduleRange,
	defaultExamCriteria,
	examTypeOptions,
	toUtcIsoString,
} from '../lib/form';
import { useCreateExam } from '../model/use-create-exam';
import { CreateExamScheduleField } from './schedule-field';

interface CreateExamModalProps {
	classroomId: string;
	week: number;
}

const isExamType = (value: string): value is ExamType => {
	return examTypeOptions.some((option) => option.value === value);
};

export function CreateExamModal({ classroomId, week }: CreateExamModalProps) {
	const titleId = useId();
	const descriptionId = useId();
	const durationId = useId();

	const [isOpen, setIsOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [examType, setExamType] = useState<ExamType>('weekly');

	const { mutateAsync: createExam, isPending } = useCreateExam(classroomId);

	const defaultScheduleRange = useMemo(() => buildDefaultScheduleRange(), []);
	const [scheduleRange, setScheduleRange] = useState<DateRangeValue | null>(defaultScheduleRange);

	const handleOpenChange = (nextOpen: boolean) => {
		setIsOpen(nextOpen);
		if (!nextOpen) {
			setErrorMessage(null);
			setExamType('weekly');
			setScheduleRange(defaultScheduleRange);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, close: () => void) => {
		event.preventDefault();
		setErrorMessage(null);

		const form = event.currentTarget;
		const formData = new FormData(form);
		const title = String(formData.get('title') ?? '').trim();
		const descriptionValue = String(formData.get('description') ?? '').trim();
		const durationMinutes = Number(formData.get('duration_minutes'));

		if (!scheduleRange) {
			setErrorMessage('시험 일정을 선택해주세요.');
			return;
		}

		try {
			await createExam({
				title,
				description: descriptionValue || null,
				exam_type: examType,
				duration_minutes: durationMinutes,
				week,
				starts_at: toUtcIsoString(scheduleRange.start),
				ends_at: toUtcIsoString(scheduleRange.end),
				allow_retake: false,
				criteria: defaultExamCriteria,
			});

			form.reset();
			setExamType('weekly');
			setScheduleRange(defaultScheduleRange);
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
			<Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-2xl">
						{({ close }) => (
							<>
								<Modal.CloseTrigger />
								<Modal.Header>
									<Modal.Heading>시험 생성</Modal.Heading>
									<p className="mt-1 text-sm text-slate-500">
										{week}주차 시험으로 생성됩니다. 시작/종료 일시는 별도로 유지됩니다.
									</p>
								</Modal.Header>
								<Modal.Body className="p-6">
									<form className="space-y-4" onSubmit={(event) => handleSubmit(event, close)}>
										<TextField isRequired className="w-full" name="title">
											<Label htmlFor={titleId}>시험명</Label>
											<Input id={titleId} placeholder="예: 1차 중간 구술평가" />
										</TextField>

										<div className="grid gap-4 md:grid-cols-2">
											<Select
												className="w-full"
												value={examType}
												onChange={(value) => {
													if (typeof value === 'string' && isExamType(value)) {
														setExamType(value);
													}
												}}
											>
												<Label>시험 유형</Label>
												<Select.Trigger>
													<Select.Value />
													<Select.Indicator />
												</Select.Trigger>
												<Select.Popover>
													<ListBox>
														{examTypeOptions.map((option) => (
															<ListBox.Item
																key={option.value}
																id={option.value}
																textValue={option.label}
															>
																{option.label}
																<ListBox.ItemIndicator />
															</ListBox.Item>
														))}
													</ListBox>
												</Select.Popover>
											</Select>

											<TextField
												isRequired
												className="w-full"
												defaultValue="60"
												name="duration_minutes"
											>
												<Label htmlFor={durationId}>시험 시간(분)</Label>
												<Input id={durationId} min={1} max={600} step={1} type="number" />
											</TextField>
										</div>

										<CreateExamScheduleField
											onScheduleRangeChange={setScheduleRange}
											scheduleRange={scheduleRange}
										/>

										<TextField className="w-full" name="description">
											<Label htmlFor={descriptionId}>설명</Label>
											<TextArea
												id={descriptionId}
												className="min-h-28"
												placeholder="시험 범위나 운영 방식을 입력하세요."
											/>
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
