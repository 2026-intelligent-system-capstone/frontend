import type { Classroom } from '@/entities/classroom';
import { Card } from '@heroui/react';

interface ClassroomOverviewCardProps {
	classroom: Classroom;
	materialsCount: number;
	examsCount: number;
	courseWeeks: number;
}

export function ClassroomOverviewCard({
	classroom,
	materialsCount,
	examsCount,
	courseWeeks,
}: ClassroomOverviewCardProps) {
	return (
		<Card>
			<Card.Header className="gap-3">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<Card.Title className="mt-2 text-2xl font-semibold text-slate-900">{classroom.name}</Card.Title>
						<Card.Description className="mt-2 text-sm text-slate-500">
							{classroom.grade}학년 · {classroom.semester} · {classroom.section}반
						</Card.Description>
					</div>
					<div className="flex flex-wrap gap-2 text-xs font-medium">
						<span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
							교수자 {classroom.professor_ids.length}명
						</span>
						<span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
							학생 {classroom.student_ids.length}명
						</span>
						<span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
							자료 열람 {classroom.allow_student_material_access ? '허용' : '제한'}
						</span>
					</div>
				</div>
			</Card.Header>
			<Card.Content className="grid gap-4 md:grid-cols-3">
				<Card className="border border-slate-200 bg-slate-50">
					<Card.Header>
						<Card.Title className="text-base">강의실 소개</Card.Title>
					</Card.Header>
					<Card.Content className="text-sm text-slate-600">
						{classroom.description ?? '강의실 설명이 아직 없습니다.'}
					</Card.Content>
				</Card>
				<Card className="border border-slate-200 bg-slate-50">
					<Card.Header>
						<Card.Title className="text-base">자료/시험 현황</Card.Title>
					</Card.Header>
					<Card.Content className="space-y-2 text-sm text-slate-600">
						<p>자료 {materialsCount}건</p>
						<p>시험 {examsCount}건</p>
						<p>운영 주차 {courseWeeks}주</p>
					</Card.Content>
				</Card>
				<Card className="border border-slate-200 bg-slate-50">
					<Card.Header>
						<Card.Title className="text-base">구성원</Card.Title>
					</Card.Header>
					<Card.Content className="space-y-2 text-sm text-slate-600">
						<p>교수자 {classroom.professor_ids.length}명</p>
						<p>학생 {classroom.student_ids.length}명</p>
					</Card.Content>
				</Card>
			</Card.Content>
		</Card>
	);
}
