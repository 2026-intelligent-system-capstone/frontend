import type { Classroom } from '@/entities/classroom';
import { SurfaceCard } from '@/shared/ui';

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
		<SurfaceCard className="space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="space-y-2">
					<p className="text-brand-deep font-mono text-xs font-semibold tracking-[0.08em] uppercase">
						Course Brief
					</p>
					<h2 className="text-neutral-text text-2xl font-semibold tracking-[-0.01em]">운영 개요</h2>
				</div>
				<div className="flex flex-wrap gap-2 text-xs font-medium">
					<span
						className="border-border-subtle bg-surface-muted text-neutral-gray-700 rounded-full border px-3
							py-1"
					>
						교수자 {classroom.professor_ids.length}명
					</span>
					<span
						className="border-border-subtle bg-surface-muted text-neutral-gray-700 rounded-full border px-3
							py-1"
					>
						학생 {classroom.student_ids.length}명
					</span>
					<span className="border-brand-light bg-brand-light text-brand-deep rounded-full border px-3 py-1">
						자료 열람 {classroom.allow_student_material_access ? '허용' : '제한'}
					</span>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<section className="border-border-subtle bg-surface-muted rounded-2xl border p-5">
					<p className="text-neutral-text text-sm font-semibold">강의실 소개</p>
					<p className="text-neutral-gray-500 mt-3 text-sm leading-6">
						{classroom.description ?? '강의실 설명이 아직 없습니다.'}
					</p>
				</section>
				<section className="border-border-subtle bg-surface-muted rounded-2xl border p-5">
					<p className="text-neutral-text text-sm font-semibold">자료/시험 현황</p>
					<dl className="text-neutral-gray-500 mt-3 space-y-2 text-sm">
						<div className="flex justify-between gap-3">
							<dt>자료</dt>
							<dd className="text-neutral-text font-medium">{materialsCount}건</dd>
						</div>
						<div className="flex justify-between gap-3">
							<dt>시험</dt>
							<dd className="text-neutral-text font-medium">{examsCount}건</dd>
						</div>
						<div className="flex justify-between gap-3">
							<dt>운영 주차</dt>
							<dd className="text-neutral-text font-medium">{courseWeeks}주</dd>
						</div>
					</dl>
				</section>
				<section className="border-border-subtle bg-surface-muted rounded-2xl border p-5">
					<p className="text-neutral-text text-sm font-semibold">구성원</p>
					<dl className="text-neutral-gray-500 mt-3 space-y-2 text-sm">
						<div className="flex justify-between gap-3">
							<dt>교수자</dt>
							<dd className="text-neutral-text font-medium">{classroom.professor_ids.length}명</dd>
						</div>
						<div className="flex justify-between gap-3">
							<dt>학생</dt>
							<dd className="text-neutral-text font-medium">{classroom.student_ids.length}명</dd>
						</div>
					</dl>
				</section>
			</div>
		</SurfaceCard>
	);
}
