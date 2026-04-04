import { useQuery } from '@tanstack/react-query';

import { usersApi } from '@/lib/api/users';
import { CLASSROOM_USERS_QUERY_KEY } from '@/lib/hooks/classroom-query-keys';

export const useUsers = (initialData?: Awaited<ReturnType<typeof usersApi.listUsers>>) => {
	return useQuery({
		queryKey: CLASSROOM_USERS_QUERY_KEY,
		queryFn: usersApi.listUsers,
		initialData,
		staleTime: 60 * 1000,
	});
};
