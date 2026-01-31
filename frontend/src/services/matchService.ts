import { apiRequest } from './api'
import { ApiResponse } from '../types/api'
import { MatchHistory, MatchDetailsResponse } from '../types/match'

/**
 * Get match history for a summoner by PUUID
 */
export async function getMatchHistory(
  puuid: string,
  start = 0,
  count = 20
): Promise<ApiResponse<MatchHistory>> {
  return apiRequest<MatchHistory>(
    'get',
    `/api/matches/${encodeURIComponent(puuid)}?start=${start}&count=${count}`
  )
}

/**
 * Get detailed match information by match ID
 */
export async function getMatchDetails(matchId: string): Promise<ApiResponse<MatchDetailsResponse>> {
  return apiRequest<MatchDetailsResponse>(
    'get',
    `/api/match/${encodeURIComponent(matchId)}`
  )
}

/**
 * Get detailed information for multiple matches
 */
export async function getMultipleMatchDetails(
  matchIds: string[]
): Promise<ApiResponse<MatchDetailsResponse>[]> {
  const promises = matchIds.map((matchId) => getMatchDetails(matchId))
  return Promise.all(promises)
}
