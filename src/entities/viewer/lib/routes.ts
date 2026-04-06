import type { UserRole } from '@/entities/user';

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
