'use client';

import type { Classroom } from '@/entities/classroom';
import { LinkButton, PageHeader, PageShell } from '@/shared/ui';

import { ClassroomList } from './list';

interface ClassroomListPageProps {
	classrooms: Classroom[];
	isError: boolean;
}

export function ClassroomListPage({ classrooms, isError }: ClassroomListPageProps) {
	return (
		<PageShell>
			<PageHeader
				actions={<LinkButton href="/professor/classrooms/new">새 강의실 생성</LinkButton>}
				description="강의실을 생성하고 학생, 자료, 시험 운영 흐름을 한 곳에서 관리하세요."
				eyebrow="Professor Workspace"
				title="강의실 관리"
			/>

			<ClassroomList classrooms={classrooms} isError={isError} />
		</PageShell>
	);
}
