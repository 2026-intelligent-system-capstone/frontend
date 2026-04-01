'use client';

import { Card, Skeleton } from '@heroui/react';

export default function ProfessorClassroomDetailLoading() {
	return (
		<div className="bg-slate-50 px-6 py-10">
			<div className="mx-auto flex max-w-6xl flex-col gap-6">
				<Card>
					<Card.Content className="space-y-6 py-8">
						<div className="space-y-3">
							<Skeleton className="h-4 w-32 rounded-lg" />
							<Skeleton className="h-8 w-56 rounded-lg" />
							<Skeleton className="h-4 w-40 rounded-lg" />
						</div>
						<div className="grid gap-4 md:grid-cols-3">
							{Array.from({ length: 3 }).map((_, index) => (
								<Card key={index} className="border border-slate-200 bg-slate-50">
									<Card.Content className="space-y-3 py-6">
										<Skeleton className="h-5 w-24 rounded-lg" />
										<Skeleton className="h-4 w-full rounded-lg" />
										<Skeleton className="h-4 w-4/5 rounded-lg" />
									</Card.Content>
								</Card>
							))}
						</div>
					</Card.Content>
				</Card>

				<Card>
					<Card.Content className="space-y-6 py-6">
						<div className="flex gap-3">
							<Skeleton className="h-9 w-16 rounded-lg" />
							<Skeleton className="h-9 w-16 rounded-lg" />
							<Skeleton className="h-9 w-16 rounded-lg" />
						</div>
						<div className="space-y-3">
							{Array.from({ length: 2 }).map((_, index) => (
								<Card key={index} className="border border-slate-200 bg-slate-50">
									<Card.Content className="space-y-4 py-4">
										<div className="flex flex-wrap items-start justify-between gap-3">
											<div className="space-y-2">
												<div className="flex gap-2">
													<Skeleton className="h-6 w-16 rounded-full" />
													<Skeleton className="h-6 w-14 rounded-full" />
												</div>
												<Skeleton className="h-6 w-40 rounded-lg" />
												<Skeleton className="h-4 w-64 rounded-lg" />
											</div>
											<Skeleton className="h-8 w-20 rounded-lg" />
										</div>
										<div className="grid gap-2 md:grid-cols-3">
											<Skeleton className="h-4 w-full rounded-lg" />
											<Skeleton className="h-4 w-full rounded-lg" />
											<Skeleton className="h-4 w-full rounded-lg" />
										</div>
									</Card.Content>
								</Card>
							))}
						</div>
					</Card.Content>
				</Card>
			</div>
		</div>
	);
}
