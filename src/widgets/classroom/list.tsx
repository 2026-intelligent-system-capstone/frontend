'use client';

import Link from 'next/link';

import type { Classroom } from '@/entities/classroom';
import { Button, Card } from '@heroui/react';

interface ClassroomListProps {
	classrooms: Classroom[];
	isError: boolean;
}

export function ClassroomList({ classrooms, isError }: ClassroomListProps) {
	if (isError) {
		return (
			<Card>
				<Card.Content className="py-10 text-sm text-red-600">강의실 목록을 불러오지 못했습니다.</Card.Content>
			</Card>
		);
	}

	if (classrooms.length === 0) {
		return (
			<Card>
				<Card.Content className="flex flex-col items-start gap-4 py-10">
					<div>
						<p className="text-base font-semibold text-slate-900">아직 생성된 강의실이 없습니다.</p>
						<p className="mt-1 text-sm text-slate-500">첫 강의실을 생성하고 자료와 시험을 연결해보세요.</p>
					</div>
					<Link href="/professor/classrooms/new">
						<Button variant="primary">강의실 생성하기</Button>
					</Link>
				</Card.Content>
			</Card>
		);
	}

	return (
		<div className="grid gap-4 xl:grid-cols-2">
			{classrooms.map((classroom) => (
				<Card key={classroom.id} className="border border-slate-200 bg-white">
					<Card.Header className="gap-2">
						<div className="flex w-full items-start justify-between gap-4">
							<div>
								<Card.Title className="text-lg font-semibold text-slate-900">
									{classroom.name}
								</Card.Title>
								<Card.Description className="mt-1 text-sm text-slate-500">
									{classroom.grade}학년 · {classroom.semester} · {classroom.section}반
								</Card.Description>
							</div>
							<div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
								학생 {classroom.student_ids.length}명
							</div>
						</div>
					</Card.Header>
					<Card.Content className="space-y-4 text-sm text-slate-600">
						<p>{classroom.description ?? '강의실 설명이 아직 없습니다.'}</p>
						<div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
							<span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
								교수자 {classroom.professor_ids.length}명
							</span>
							<span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
								자료 열람 {classroom.allow_student_material_access ? '허용' : '제한'}
							</span>
						</div>
					</Card.Content>
					<Card.Footer>
						<Link href={`/professor/classrooms/${classroom.id}`}>
							<Button variant="secondary">상세 보기</Button>
						</Link>
					</Card.Footer>
				</Card>
			))}
		</div>
	);
}
