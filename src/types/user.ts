import type { UserRole } from '@/types/auth';

export type UserStatus = 'active' | 'pending' | 'blocked';

export interface User {
	id: string;
	organization_id: string;
	login_id: string;
	role: UserRole;
	email: string | null;
	name: string;
	status: UserStatus;
	is_deleted: boolean;
}
