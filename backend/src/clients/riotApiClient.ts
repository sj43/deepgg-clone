import axios, { AxiosError, AxiosInstance } from 'axios'
import { RIOT_REGIONS } from '../types/riot.js'
import type { Account, Summoner, LeagueEntry, MatchDto, ChampionData } from '../types/riotApi.js'

interface RateLimitBucket {
  requests: number[]
  lastReset: number
}

interface QueuedRequest<T> {
  execute: () => Promise<T>
  resolve: (value: T) => void
  reject: (error: any) => void
}

export class RiotApiClient {
  private apiKey: string
  private clients: Map<string, AxiosInstance> = new Map()
  private rateLimits: Map<string, RateLimitBucket> = new Map()
  private requestQueue: QueuedRequest<any>[] = []
  private isProcessingQueue = false

  // Rate limits for development key: 20 requests per second, 100 requests per 2 minutes
  private readonly RATE_LIMIT_PER_SECOND = 20
  private readonly RATE_LIMIT_PER_2_MINUTES = 100
  private readonly SECOND_WINDOW = 1000
  private readonly TWO_MINUTE_WINDOW = 120000

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.initializeClients()
  }

  private initializeClients(): void {
    // Create axios instances for each unique base URL
    const baseUrls = new Set<string>()
    
    // Regional routing URLs (for account API)
    baseUrls.add('https://americas.api.riotgames.com')
    baseUrls.add('https://asia.api.riotgames.com')
    baseUrls.add('https://europe.api.riotgames.com')
    baseUrls.add('https://sea.api.riotgames.com')
    
    // Platform URLs (for summoner, league, match APIs)
    Object.values(RIOT_REGIONS).forEach(region => {
      baseUrls.add(`https://${region.platform}.api.riotgames.com`)
    })
    
    // Data Dragon URL for static data
    baseUrls.add('https://ddragon.leagueoflegends.com')

    baseUrls.forEach(url => {
      this.clients.set(url, axios.create({
        baseURL: url,
        headers: {
          'X-Riot-Token': this.apiKey,
        },
        timeout: 10000,
      }))
    })
  }

  private getClient(baseUrl: string): AxiosInstance {
    const client = this.clients.get(baseUrl)
    if (!client) {
      throw new Error(`No client configured for ${baseUrl}`)
    }
    return client
  }

  private async waitForRateLimit(bucket: string): Promise<void> {
    const now = Date.now()
    const rateLimitBucket = this.rateLimits.get(bucket) || {
      requests: [],
      lastReset: now,
    }

    // Clean up old requests (older than 2 minutes)
    rateLimitBucket.requests = rateLimitBucket.requests.filter(
      timestamp => now - timestamp < this.TWO_MINUTE_WINDOW
    )

    // Check if we're within limits
    const requestsInLastSecond = rateLimitBucket.requests.filter(
      timestamp => now - timestamp < this.SECOND_WINDOW
    ).length
    
    const requestsInLast2Minutes = rateLimitBucket.requests.length

    if (requestsInLastSecond >= this.RATE_LIMIT_PER_SECOND) {
      // Wait until the oldest request in the last second expires
      const oldestInSecond = Math.max(
        ...rateLimitBucket.requests.filter(t => now - t < this.SECOND_WINDOW)
      )
      const waitTime = this.SECOND_WINDOW - (now - oldestInSecond) + 50 // Add 50ms buffer
      await new Promise(resolve => setTimeout(resolve, waitTime))
      return this.waitForRateLimit(bucket)
    }

    if (requestsInLast2Minutes >= this.RATE_LIMIT_PER_2_MINUTES) {
      // Wait until the oldest request in the last 2 minutes expires
      const oldestIn2Minutes = Math.min(...rateLimitBucket.requests)
      const waitTime = this.TWO_MINUTE_WINDOW - (now - oldestIn2Minutes) + 50
      await new Promise(resolve => setTimeout(resolve, waitTime))
      return this.waitForRateLimit(bucket)
    }

    // Add current request timestamp
    rateLimitBucket.requests.push(now)
    this.rateLimits.set(bucket, rateLimitBucket)
  }

  private async queueRequest<T>(
    bucket: string,
    requestFn: () => Promise<T>,
    retries = 3
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        execute: async () => {
          try {
            await this.waitForRateLimit(bucket)
            const result = await requestFn()
            return result
          } catch (error) {
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError
              
              // Handle rate limit errors with exponential backoff
              if (axiosError.response?.status === 429 && retries > 0) {
                const retryAfter = parseInt(
                  axiosError.response.headers['retry-after'] || '5'
                )
                console.log(`Rate limited, retrying after ${retryAfter}s`)
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
                return this.queueRequest(bucket, requestFn, retries - 1)
              }
              
              // Handle service unavailable with retry
              if (axiosError.response?.status === 503 && retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 2000))
                return this.queueRequest(bucket, requestFn, retries - 1)
              }
            }
            throw error
          }
        },
        resolve,
        reject,
      })

      if (!this.isProcessingQueue) {
        this.processQueue()
      }
    })
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return
    
    this.isProcessingQueue = true

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()
      if (request) {
        try {
          const result = await request.execute()
          request.resolve(result)
        } catch (error) {
          request.reject(error)
        }
      }
    }

    this.isProcessingQueue = false
  }

  /**
   * Get account information by Riot ID (game name and tag line)
   */
  async getAccountByRiotId(
    gameName: string,
    tagLine: string,
    region: string
  ): Promise<Account> {
    const regionRouting = RIOT_REGIONS[region]?.region || 'americas'
    const baseUrl = `https://${regionRouting}.api.riotgames.com`
    const client = this.getClient(baseUrl)

    return this.queueRequest(
      `account-${regionRouting}`,
      async () => {
        const response = await client.get<Account>(
          `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
        )
        return response.data
      }
    )
  }

  /**
   * Get summoner information by PUUID
   */
  async getSummonerByPuuid(puuid: string, region: string): Promise<Summoner> {
    const platform = RIOT_REGIONS[region]?.platform || 'na1'
    const baseUrl = `https://${platform}.api.riotgames.com`
    const client = this.getClient(baseUrl)

    return this.queueRequest(
      `summoner-${platform}`,
      async () => {
        const response = await client.get<Summoner>(
          `/lol/summoner/v4/summoners/by-puuid/${puuid}`
        )
        return response.data
      }
    )
  }

  /**
   * Get ranked league entries for a summoner
   */
  async getLeagueEntries(summonerId: string, region: string): Promise<LeagueEntry[]> {
    const platform = RIOT_REGIONS[region]?.platform || 'na1'
    const baseUrl = `https://${platform}.api.riotgames.com`
    const client = this.getClient(baseUrl)

    return this.queueRequest(
      `league-${platform}`,
      async () => {
        const response = await client.get<LeagueEntry[]>(
          `/lol/league/v4/entries/by-summoner/${summonerId}`
        )
        return response.data
      }
    )
  }

  /**
   * Get match IDs for a player
   */
  async getMatchIds(
    puuid: string,
    region: string,
    start = 0,
    count = 20
  ): Promise<string[]> {
    const regionRouting = RIOT_REGIONS[region]?.region || 'americas'
    const baseUrl = `https://${regionRouting}.api.riotgames.com`
    const client = this.getClient(baseUrl)

    return this.queueRequest(
      `match-${regionRouting}`,
      async () => {
        const response = await client.get<string[]>(
          `/lol/match/v5/matches/by-puuid/${puuid}/ids`,
          {
            params: { start, count },
          }
        )
        return response.data
      }
    )
  }

  /**
   * Get detailed match information
   */
  async getMatchDetails(matchId: string, region: string): Promise<MatchDto> {
    const regionRouting = RIOT_REGIONS[region]?.region || 'americas'
    const baseUrl = `https://${regionRouting}.api.riotgames.com`
    const client = this.getClient(baseUrl)

    return this.queueRequest(
      `match-${regionRouting}`,
      async () => {
        const response = await client.get<MatchDto>(
          `/lol/match/v5/matches/${matchId}`
        )
        return response.data
      }
    )
  }

  /**
   * Get champion static data from Data Dragon
   */
  async getChampionData(version = 'latest'): Promise<ChampionData> {
    const baseUrl = 'https://ddragon.leagueoflegends.com'
    const client = this.getClient(baseUrl)

    // Data Dragon doesn't need rate limiting, but we queue it anyway for consistency
    return this.queueRequest(
      'ddragon',
      async () => {
        // Get latest version if not specified
        if (version === 'latest') {
          const versionsResponse = await client.get<string[]>('/api/versions.json')
          version = versionsResponse.data[0]
        }

        const response = await client.get<ChampionData>(
          `/cdn/${version}/data/en_US/champion.json`
        )
        return response.data
      }
    )
  }

  /**
   * Get the latest game version
   */
  async getLatestVersion(): Promise<string> {
    const baseUrl = 'https://ddragon.leagueoflegends.com'
    const client = this.getClient(baseUrl)

    const response = await client.get<string[]>('/api/versions.json')
    return response.data[0]
  }
}
