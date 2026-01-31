import { RiotApiClient } from '../clients/riotApiClient.js'
import { redisCache } from '../clients/redisClient.js'
import type { MatchDto } from '../types/riotApi.js'

export class MatchService {
  private riotClient: RiotApiClient

  constructor(riotClient: RiotApiClient) {
    this.riotClient = riotClient
  }

  /**
   * Get match history IDs for a player
   * Cache: 10 minutes
   */
  async getMatchHistory(
    puuid: string,
    region: string,
    start = 0,
    count = 20
  ): Promise<string[]> {
    const cacheKey = `matches:${region}:${puuid}:${start}:${count}`
    
    // Try to get from cache
    const cached = await redisCache.get<string[]>(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return cached
    }

    console.log(`Cache MISS: ${cacheKey}`)

    // Fetch from Riot API
    const matchIds = await this.riotClient.getMatchIds(puuid, region, start, count)

    // Cache for 10 minutes (600 seconds)
    await redisCache.set(cacheKey, matchIds, 600)

    return matchIds
  }

  /**
   * Get detailed match information
   * Cache: Permanent (matches don't change once completed)
   */
  async getMatchDetails(matchId: string, region: string): Promise<MatchDto> {
    const cacheKey = `match:${matchId}`
    
    // Try to get from cache
    const cached = await redisCache.get<MatchDto>(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return cached
    }

    console.log(`Cache MISS: ${cacheKey}`)

    // Fetch from Riot API
    const match = await this.riotClient.getMatchDetails(matchId, region)

    // Cache for 7 days (604800 seconds) - matches are historical and don't change
    await redisCache.set(cacheKey, match, 604800)

    return match
  }

  /**
   * Get multiple match details at once
   */
  async getMultipleMatchDetails(
    matchIds: string[],
    region: string
  ): Promise<MatchDto[]> {
    const matches: MatchDto[] = []
    
    for (const matchId of matchIds) {
      try {
        const match = await this.getMatchDetails(matchId, region)
        matches.push(match)
      } catch (error) {
        console.error(`Failed to fetch match ${matchId}:`, error)
        // Continue with other matches even if one fails
      }
    }

    return matches
  }

  /**
   * Get match history with full details
   * This combines getMatchHistory and getMatchDetails for convenience
   */
  async getMatchHistoryWithDetails(
    puuid: string,
    region: string,
    start = 0,
    count = 20
  ): Promise<MatchDto[]> {
    const matchIds = await this.getMatchHistory(puuid, region, start, count)
    return this.getMultipleMatchDetails(matchIds, region)
  }
}
