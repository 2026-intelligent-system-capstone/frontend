import { CreateClassroomForm } from '@/features/create-classroom';

export default function NewProfessorClassroomPage() {
	return (
		<div className="bg-slate-50 px-6 py-10">
			<div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold text-slate-900">새 강의실 생성</h1>
					<p className="text-sm text-slate-500">
						강의실 기본 정보를 입력하고 자료/시험 관리의 시작점을 만드세요.
					</p>
				</div>
				<div className="mt-6">
					<CreateClassroomForm />
				</div>
			</div>
		</div>
	);
}
