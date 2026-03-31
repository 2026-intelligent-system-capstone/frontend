import type { UserRole } from '@/types/auth';

export const getDefaultRouteByRole = (role: UserRole): string => {
	switch (role) {
		case 'student':
			return '/student/exams';
		case 'admin':
		case 'professor':
		default:
			return '/professor/classrooms';
	}
};
