'use client';

import { DateField, DateRangePicker, Label, RangeCalendar, TimeField } from '@heroui/react';
import type { TimeValue } from '@heroui/react';

import type { DateRangeValue } from '../lib/form';

interface CreateExamScheduleFieldProps {
	scheduleRange: DateRangeValue | null;
	onScheduleRangeChange: (value: DateRangeValue | null) => void;
}

export function CreateExamScheduleField({ scheduleRange, onScheduleRangeChange }: CreateExamScheduleFieldProps) {
	return (
		<DateRangePicker
			className="w-full"
			granularity="minute"
			hideTimeZone
			hourCycle={24}
			value={scheduleRange}
			onChange={onScheduleRangeChange}
		>
			{({ state }) => (
				<>
					<Label>시험 일정</Label>
					<DateField.Group fullWidth>
						<DateField.Input slot="start">
							{(segment) => <DateField.Segment segment={segment} />}
						</DateField.Input>
						<DateRangePicker.RangeSeparator />
						<DateField.Input slot="end">
							{(segment) => <DateField.Segment segment={segment} />}
						</DateField.Input>
						<DateField.Suffix>
							<DateRangePicker.Trigger>
								<DateRangePicker.TriggerIndicator />
							</DateRangePicker.Trigger>
						</DateField.Suffix>
					</DateField.Group>
					<DateRangePicker.Popover className="flex w-full min-w-96 flex-col gap-3 p-3">
						<RangeCalendar aria-label="시험 일정 선택" className="w-full">
							<RangeCalendar.Header>
								<RangeCalendar.YearPickerTrigger>
									<RangeCalendar.YearPickerTriggerHeading />
									<RangeCalendar.YearPickerTriggerIndicator />
								</RangeCalendar.YearPickerTrigger>
								<RangeCalendar.NavButton slot="previous" />
								<RangeCalendar.NavButton slot="next" />
							</RangeCalendar.Header>
							<RangeCalendar.Grid>
								<RangeCalendar.GridHeader>
									{(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
								</RangeCalendar.GridHeader>
								<RangeCalendar.GridBody>
									{(date) => <RangeCalendar.Cell date={date} />}
								</RangeCalendar.GridBody>
							</RangeCalendar.Grid>
							<RangeCalendar.YearPickerGrid>
								<RangeCalendar.YearPickerGridBody>
									{({ year }) => <RangeCalendar.YearPickerCell year={year} />}
								</RangeCalendar.YearPickerGridBody>
							</RangeCalendar.YearPickerGrid>
						</RangeCalendar>
						<div className="grid gap-3 md:grid-cols-2">
							<div className="space-y-2">
								<Label>시작 시간</Label>
								<TimeField
									aria-label="시험 시작 시간"
									granularity="minute"
									hideTimeZone
									hourCycle={24}
									value={state.timeRange?.start ?? null}
									onChange={(value: TimeValue | null) => {
										if (!value) {
											return;
										}

										const end = state.timeRange?.end ?? value;
										state.setTimeRange({ end, start: value });
									}}
								>
									<TimeField.Group variant="secondary">
										<TimeField.Input>
											{(segment) => <TimeField.Segment segment={segment} />}
										</TimeField.Input>
									</TimeField.Group>
								</TimeField>
							</div>
							<div className="space-y-2">
								<Label>종료 시간</Label>
								<TimeField
									aria-label="시험 종료 시간"
									granularity="minute"
									hideTimeZone
									hourCycle={24}
									value={state.timeRange?.end ?? null}
									onChange={(value: TimeValue | null) => {
										if (!value) {
											return;
										}

										const start = state.timeRange?.start ?? value;
										state.setTimeRange({ end: value, start });
									}}
								>
									<TimeField.Group variant="secondary">
										<TimeField.Input>
											{(segment) => <TimeField.Segment segment={segment} />}
										</TimeField.Input>
									</TimeField.Group>
								</TimeField>
							</div>
						</div>
					</DateRangePicker.Popover>
				</>
			)}
		</DateRangePicker>
	);
}
