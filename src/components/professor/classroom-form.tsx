'use client';

import { Button, Checkbox, ErrorMessage, Input, Label, TextArea, TextField } from '@heroui/react';

import { dayjs, SEOUL_TIME_ZONE } from '@/lib/dayjs';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useCreateClassroom } from '@/lib/hooks/use-classrooms';
import { useAuth } from '@/lib/hooks/use-auth';
import { ApiClientError } from '@/types/api';

const gradeOptions = [1, 2, 3, 4, 5, 6] as const;

export function ClassroomForm() {
	const router = useRouter();
	const { user } = useAuth();
	const { mutateAsync: createClassroom, isPending } = useCreateClassroom();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [allowStudentMaterialAccess, setAllowStudentMaterialAccess] = useState(false);

	const defaultSemester = useMemo(() => {
		const now = dayjs().tz(SEOUL_TIME_ZONE);
		return now.month() < 6 ? '1학기' : '2학기';
	}, []);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);

		if (!user) {
			setErrorMessage('사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요.');
			return;
		}

		const formData = new FormData(event.currentTarget);
		const name = String(formData.get('name') ?? '').trim();
		const grade = Number(formData.get('grade'));
		const semester = String(formData.get('semester') ?? '').trim();
		const section = String(formData.get('section') ?? '').trim();
		const descriptionValue = String(formData.get('description') ?? '').trim();

		try {
			const classroom = await createClassroom({
				name,
				professor_ids: [user.id],
				grade,
				semester,
				section,
				description: descriptionValue || null,
				allow_student_material_access: allowStudentMaterialAccess,
			});

			router.replace(`/professor/classrooms/${classroom.id}`);
			router.refresh();
		} catch (error) {
			if (error instanceof ApiClientError) {
				setErrorMessage(error.message);
				return;
			}

			setErrorMessage('강의실 생성 중 오류가 발생했습니다.');
		}
	};

	return (
		<form className="space-y-6" onSubmit={handleSubmit}>
			<div className="grid gap-4 md:grid-cols-2">
				<TextField isRequired className="w-full" name="name">
					<Label>강의실 이름</Label>
					<Input placeholder="예: 자료구조 A" />
				</TextField>

				<label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
					<span>학년</span>
					<select
						className="h-10 rounded-medium border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary"
						defaultValue={1}
						name="grade"
					>
						{gradeOptions.map((grade) => (
							<option key={grade} value={grade}>
								{grade}학년
							</option>
						))}
					</select>
				</label>

				<TextField isRequired className="w-full" defaultValue={defaultSemester} name="semester">
					<Label>학기</Label>
					<Input placeholder="예: 1학기" />
				</TextField>

				<TextField isRequired className="w-full" name="section">
					<Label>분반</Label>
					<Input placeholder="예: A반" />
				</TextField>
			</div>

			<TextField className="w-full" name="description">
				<Label>강의실 설명</Label>
				<TextArea className="min-h-32" placeholder="수업 소개, 운영 방식, 참고 사항 등을 입력하세요." />
			</TextField>

			<Checkbox isSelected={allowStudentMaterialAccess} name="allow_student_material_access" onChange={setAllowStudentMaterialAccess}>
				<Checkbox.Control>
					<Checkbox.Indicator />
				</Checkbox.Control>
				<Checkbox.Content>
					<Label>학생이 업로드된 자료를 열람할 수 있도록 허용</Label>
				</Checkbox.Content>
			</Checkbox>

			{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

			<div className="flex flex-wrap items-center gap-3">
				<Button isPending={isPending} type="submit" variant="primary">
					강의실 생성
				</Button>
				<Button type="button" variant="ghost" onPress={() => router.push('/professor/classrooms')}>
					목록으로 돌아가기
				</Button>
			</div>
		</form>
	);
}
