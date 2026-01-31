import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getChampions } from '../services/championService'
import { ChampionsData } from '../types/champion'
import { ApiResponse } from '../types/api'

/**
 * Hook to fetch all champion data
 */
export function useChampions(
  enabled = true
): UseQueryResult<ApiResponse<ChampionsData>, Error> {
  return useQuery({
    queryKey: ['champions'],
    queryFn: () => getChampions(),
    enabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
    retry: 1
  })
}
