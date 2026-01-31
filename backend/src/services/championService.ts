import { RiotApiClient } from '../clients/riotApiClient.js'
import { redisCache } from '../clients/redisClient.js'
import type { ChampionData, Champion } from '../types/riotApi.js'

interface ChampionStats {
  championId: string
  championName: string
  role: string
  winRate: number
  pickRate: number
  banRate: number
  gamesPlayed: number
  tier: string
}

export class ChampionService {
  private riotClient: RiotApiClient

  constructor(riotClient: RiotApiClient) {
    this.riotClient = riotClient
  }

  /**
   * Get all champion static data
   * Cache: 24 hours
   */
  async getAllChampions(): Promise<ChampionData> {
    const cacheKey = 'champions:all'
    
    // Try to get from cache
    const cached = await redisCache.get<ChampionData>(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return cached
    }

    console.log(`Cache MISS: ${cacheKey}`)

    // Fetch from Data Dragon
    const championData = await this.riotClient.getChampionData('latest')

    // Cache for 24 hours (86400 seconds)
    await redisCache.set(cacheKey, championData, 86400)

    return championData
  }

  /**
   * Get champion by ID
   * Cache: 24 hours
   */
  async getChampionById(championId: string): Promise<Champion | null> {
    const allChampions = await this.getAllChampions()
    
    // Find champion by ID (championId is stored as the key in championData.data)
    const champion = Object.values(allChampions.data).find(
      champ => champ.key === championId
    )

    return champion || null
  }

  /**
   * Get tier list for a specific role
   * Cache: 1 hour
   * 
   * Note: This is a placeholder implementation. In production, you would:
   * 1. Aggregate match data from Supabase
   * 2. Calculate win rates, pick rates, ban rates per champion per role
   * 3. Rank champions into tiers (S, A, B, C, D) based on performance metrics
   */
  async getTierListByRole(role: string): Promise<ChampionStats[]> {
    const validRoles = ['top', 'jungle', 'mid', 'adc', 'support']
    if (!validRoles.includes(role.toLowerCase())) {
      throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`)
    }

    const cacheKey = `tierlist:${role.toLowerCase()}`
    
    // Try to get from cache
    const cached = await redisCache.get<ChampionStats[]>(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return cached
    }

    console.log(`Cache MISS: ${cacheKey}`)

    // Fetch champion data
    const championData = await this.getAllChampions()

    // TODO: In production, query Supabase for aggregated champion stats
    // For now, return mock data with some popular champions
    const mockStats: ChampionStats[] = this.generateMockTierList(
      championData,
      role.toLowerCase()
    )

    // Cache for 1 hour (3600 seconds)
    await redisCache.set(cacheKey, mockStats, 3600)

    return mockStats
  }

  /**
   * Generate mock tier list data
   * This should be replaced with real data from Supabase in production
   */
  private generateMockTierList(championData: ChampionData, role: string): ChampionStats[] {
    const champions = Object.values(championData.data)
    
    // Filter champions that typically play in this role (simplified logic)
    const roleChampions = champions.slice(0, 15) // Take first 15 for demo

    return roleChampions.map((champion, index) => {
      // Generate mock stats that decrease slightly for each champion
      const baseWinRate = 52 - (index * 0.5)
      const basePickRate = 15 - (index * 0.8)
      const baseBanRate = 20 - (index * 1.2)

      return {
        championId: champion.key,
        championName: champion.name,
        role: role,
        winRate: Math.max(45, baseWinRate + (Math.random() * 4 - 2)),
        pickRate: Math.max(1, basePickRate + (Math.random() * 2 - 1)),
        banRate: Math.max(0, baseBanRate + (Math.random() * 3 - 1.5)),
        gamesPlayed: Math.floor(Math.random() * 10000) + 5000,
        tier: this.calculateTier(index),
      }
    }).sort((a, b) => b.winRate - a.winRate)
  }

  /**
   * Calculate tier based on ranking position
   */
  private calculateTier(index: number): string {
    if (index < 3) return 'S'
    if (index < 6) return 'A'
    if (index < 9) return 'B'
    if (index < 12) return 'C'
    return 'D'
  }

  /**
   * Get latest game version
   * Cache: 24 hours
   */
  async getLatestVersion(): Promise<string> {
    const cacheKey = 'version:latest'
    
    const cached = await redisCache.get<string>(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return cached
    }

    console.log(`Cache MISS: ${cacheKey}`)

    const version = await this.riotClient.getLatestVersion()
    
    // Cache for 24 hours
    await redisCache.set(cacheKey, version, 86400)

    return version
  }
}
