'use client';

import Link from 'next/link';

import type { Classroom } from '@/entities/classroom';
import { Button } from '@heroui/react';

import { ClassroomList } from './list';

interface ClassroomListPageProps {
	classrooms: Classroom[];
	isError: boolean;
}

export function ClassroomListPage({ classrooms, isError }: ClassroomListPageProps) {
	return (
		<div className="bg-slate-50 px-6 py-10">
			<div className="mx-auto flex max-w-6xl flex-col gap-6">
				<div
					className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm
						md:flex-row md:items-end md:justify-between"
				>
					<div>
						<p className="text-sm font-medium text-blue-600">Professor Workspace</p>
						<h1 className="mt-2 text-2xl font-semibold text-slate-900">강의실 관리</h1>
						<p className="mt-2 text-sm text-slate-500">
							강의실을 생성하고 학생, 자료, 시험 운영 흐름을 관리하세요.
						</p>
					</div>
					<Link href="/professor/classrooms/new">
						<Button variant="primary">새 강의실 생성</Button>
					</Link>
				</div>

				<ClassroomList classrooms={classrooms} isError={isError} />
			</div>
		</div>
	);
}
