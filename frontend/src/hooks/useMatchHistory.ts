import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getMatchHistory } from '../services/matchService'
import { MatchHistory } from '../types/match'
import { ApiResponse } from '../types/api'

/**
 * Hook to fetch match history for a summoner
 */
export function useMatchHistory(
  puuid: string,
  start = 0,
  count = 20,
  enabled = true
): UseQueryResult<ApiResponse<MatchHistory>, Error> {
  return useQuery({
    queryKey: ['matchHistory', puuid, start, count],
    queryFn: () => getMatchHistory(puuid, start, count),
    enabled: enabled && !!puuid,
    staleTime: 10 * 60 * 1000, // 10 minutes (matches backend cache)
    retry: 1
  })
}
