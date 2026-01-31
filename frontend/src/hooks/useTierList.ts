import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getTierList } from '../services/championService'
import { TierListData, Role } from '../types/champion'
import { ApiResponse } from '../types/api'

/**
 * Hook to fetch tier list for a specific role
 */
export function useTierList(
  role: Role,
  enabled = true
): UseQueryResult<ApiResponse<TierListData>, Error> {
  return useQuery({
    queryKey: ['tierList', role],
    queryFn: () => getTierList(role),
    enabled: enabled && !!role,
    staleTime: 60 * 60 * 1000, // 1 hour (matches backend cache)
    retry: 1
  })
}
