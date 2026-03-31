import type { User } from '@/types/user';

export type UserRole = 'student' | 'professor' | 'admin';

export interface LoginRequest {
	organization_code: string;
	login_id: string;
	password: string;
}

export type AuthenticatedUser = User;
