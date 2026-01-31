import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getSummonerProfile } from '../services/summonerService'
import { SummonerProfile } from '../types/summoner'
import { Region, ApiResponse } from '../types/api'

/**
 * Hook to fetch summoner profile data
 */
export function useSummoner(
  region: Region,
  gameName: string,
  tagLine: string,
  enabled = true
): UseQueryResult<ApiResponse<SummonerProfile>, Error> {
  return useQuery({
    queryKey: ['summoner', region, gameName, tagLine],
    queryFn: () => getSummonerProfile(region, gameName, tagLine),
    enabled: enabled && !!gameName && !!tagLine,
    staleTime: 5 * 60 * 1000, // 5 minutes (matches backend cache)
    retry: 1
  })
}
