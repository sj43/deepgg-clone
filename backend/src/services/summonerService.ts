import { RiotApiClient } from '../clients/riotApiClient.js'
import { redisCache } from '../clients/redisClient.js'
import type { Account, Summoner, LeagueEntry } from '../types/riotApi.js'

interface SummonerProfile {
  account: Account
  summoner: Summoner
  rankedStats: LeagueEntry[]
}

export class SummonerService {
  private riotClient: RiotApiClient

  constructor(riotClient: RiotApiClient) {
    this.riotClient = riotClient
  }

  /**
   * Get full summoner profile by game name and tag line
   * Cache: 5 minutes
   */
  async getSummonerProfile(
    gameName: string,
    tagLine: string,
    region: string
  ): Promise<SummonerProfile> {
    const cacheKey = `summoner:${region}:${gameName}:${tagLine}`
    
    // Try to get from cache
    const cached = await redisCache.get<SummonerProfile>(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return cached
    }

    console.log(`Cache MISS: ${cacheKey}`)

    // Fetch from Riot API
    const account = await this.riotClient.getAccountByRiotId(gameName, tagLine, region)
    const summoner = await this.riotClient.getSummonerByPuuid(account.puuid, region)
    const rankedStats = await this.riotClient.getLeagueEntries(summoner.id, region)

    const profile: SummonerProfile = {
      account,
      summoner,
      rankedStats,
    }

    // Cache for 5 minutes (300 seconds)
    await redisCache.set(cacheKey, profile, 300)

    return profile
  }

  /**
   * Get summoner by PUUID (for when we already have the PUUID)
   * Cache: 5 minutes
   */
  async getSummonerByPuuid(puuid: string, region: string): Promise<Summoner> {
    const cacheKey = `summoner:puuid:${region}:${puuid}`
    
    const cached = await redisCache.get<Summoner>(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return cached
    }

    console.log(`Cache MISS: ${cacheKey}`)

    const summoner = await this.riotClient.getSummonerByPuuid(puuid, region)
    
    // Cache for 5 minutes
    await redisCache.set(cacheKey, summoner, 300)

    return summoner
  }

  /**
   * Get ranked stats for a summoner
   * Cache: 5 minutes
   */
  async getRankedStats(summonerId: string, region: string): Promise<LeagueEntry[]> {
    const cacheKey = `ranked:${region}:${summonerId}`
    
    const cached = await redisCache.get<LeagueEntry[]>(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return cached
    }

    console.log(`Cache MISS: ${cacheKey}`)

    const rankedStats = await this.riotClient.getLeagueEntries(summonerId, region)
    
    // Cache for 5 minutes
    await redisCache.set(cacheKey, rankedStats, 300)

    return rankedStats
  }
}
