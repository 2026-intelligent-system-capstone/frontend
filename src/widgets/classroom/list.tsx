'use client';

import type { Classroom } from '@/entities/classroom';
import { LinkButton, StateBlock, SurfaceCard } from '@/shared/ui';

interface ClassroomListProps {
	classrooms: Classroom[];
	isError: boolean;
}

export function ClassroomList({ classrooms, isError }: ClassroomListProps) {
	if (isError) {
		return (
			<StateBlock
				description="잠시 후 다시 시도하거나 네트워크 상태를 확인해주세요."
				title="강의실 목록을 불러오지 못했습니다."
				tone="error"
			/>
		);
	}

	if (classrooms.length === 0) {
		return (
			<StateBlock
				action={<LinkButton href="/professor/classrooms/new">강의실 생성하기</LinkButton>}
				description="첫 강의실을 생성하고 자료와 시험을 연결해보세요."
				title="아직 생성된 강의실이 없습니다."
			/>
		);
	}

	return (
		<div className="grid gap-5 xl:grid-cols-2">
			{classrooms.map((classroom) => (
				<SurfaceCard key={classroom.id} className="flex flex-col gap-6 p-6 sm:p-7">
					<div className="flex items-start justify-between gap-4">
						<div className="min-w-0 space-y-2">
							<h2 className="text-neutral-text truncate text-xl font-semibold tracking-[-0.01em]">
								{classroom.name}
							</h2>
							<p className="text-neutral-gray-500 text-sm">
								{classroom.grade}학년 · {classroom.semester} · {classroom.section}반
							</p>
						</div>
						<div
							className="bg-surface-muted text-neutral-gray-700 shrink-0 rounded-full px-3 py-1 text-xs
								font-medium"
						>
							학생 {classroom.student_ids.length}명
						</div>
					</div>

					<p className="text-neutral-gray-500 text-sm leading-6">
						{classroom.description ?? '강의실 설명이 아직 없습니다.'}
					</p>

					<div className="flex flex-wrap items-center gap-2 text-xs font-medium">
						<span
							className="border-border-subtle bg-surface-muted text-neutral-gray-700 rounded-full border
								px-3 py-1"
						>
							교수자 {classroom.professor_ids.length}명
						</span>
						<span
							className="border-brand-light bg-brand-light text-brand-deep rounded-full border px-3 py-1"
						>
							자료 열람 {classroom.allow_student_material_access ? '허용' : '제한'}
						</span>
					</div>

					<div>
						<LinkButton href={`/professor/classrooms/${classroom.id}`} variant="secondary">
							상세 보기
						</LinkButton>
					</div>
				</SurfaceCard>
			))}
		</div>
	);
}
