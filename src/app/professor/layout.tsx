import type { User } from '@/entities/user';
import { AppShell } from '@/widgets/layout';

const mockUser: User = {
	id: 'dev-professor',
	organization_id: 'dev-org',
	login_id: 'prof001',
	role: 'professor',
	email: 'professor@dev.com',
	name: '이강혁',
	status: 'active',
	is_deleted: false,
};

export default async function ProfessorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	// TODO: 백엔드 연결 후 인증 복원
	return (
		<AppShell currentUser={mockUser} role="professor">
			{children}
		</AppShell>
	);
}
