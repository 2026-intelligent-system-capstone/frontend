'use client';

import { Card, Skeleton } from '@heroui/react';

export default function ProfessorClassroomsLoading() {
	return (
		<div className="bg-slate-50 px-6 py-10">
			<div className="mx-auto flex max-w-6xl flex-col gap-6">
				<div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
					<div className="space-y-3">
						<Skeleton className="h-4 w-36 rounded-lg" />
						<Skeleton className="h-8 w-48 rounded-lg" />
						<Skeleton className="h-4 w-72 rounded-lg" />
					</div>
					<Skeleton className="h-10 w-32 rounded-lg" />
				</div>

				<div className="grid gap-4 xl:grid-cols-2">
					{Array.from({ length: 4 }).map((_, index) => (
						<Card key={index} className="border border-slate-200 bg-white">
							<Card.Header className="gap-2">
								<div className="flex w-full items-start justify-between gap-4">
									<div className="space-y-2">
										<Skeleton className="h-6 w-40 rounded-lg" />
										<Skeleton className="h-4 w-32 rounded-lg" />
									</div>
									<Skeleton className="h-7 w-20 rounded-full" />
								</div>
							</Card.Header>
							<Card.Content className="space-y-4">
								<Skeleton className="h-4 w-full rounded-lg" />
								<Skeleton className="h-4 w-4/5 rounded-lg" />
								<div className="flex gap-2">
									<Skeleton className="h-6 w-20 rounded-full" />
									<Skeleton className="h-6 w-24 rounded-full" />
								</div>
							</Card.Content>
							<Card.Footer>
								<Skeleton className="h-10 w-24 rounded-lg" />
							</Card.Footer>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
