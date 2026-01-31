import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getMatchDetails } from '../services/matchService'
import { MatchDetailsResponse } from '../types/match'
import { ApiResponse } from '../types/api'

/**
 * Hook to fetch detailed match information
 */
export function useMatchDetails(
  matchId: string,
  enabled = true
): UseQueryResult<ApiResponse<MatchDetailsResponse>, Error> {
  return useQuery({
    queryKey: ['matchDetails', matchId],
    queryFn: () => getMatchDetails(matchId),
    enabled: enabled && !!matchId,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days (matches are permanent)
    retry: 1
  })
}
