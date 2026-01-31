// Summoner Data Types

export interface RiotAccount {
  puuid: string
  gameName: string
  tagLine: string
}

export interface Summoner {
  id: string
  accountId: string
  puuid: string
  name: string
  profileIconId: number
  revisionDate: number
  summonerLevel: number
}

export interface RankedStats {
  queueType: string
  tier: string
  rank: string
  leaguePoints: number
  wins: number
  losses: number
  veteran?: boolean
  inactive?: boolean
  freshBlood?: boolean
  hotStreak?: boolean
}

export interface SummonerProfile {
  account: RiotAccount
  summoner: Summoner
  rankedStats: RankedStats[]
}

// Queue type constants
export const QUEUE_TYPES = {
  RANKED_SOLO_5x5: 'Ranked Solo/Duo',
  RANKED_FLEX_SR: 'Ranked Flex',
  RANKED_FLEX_TT: 'Ranked Flex TT'
} as const

// Tier constants
export type Tier = 
  | 'IRON' | 'BRONZE' | 'SILVER' | 'GOLD' 
  | 'PLATINUM' | 'EMERALD' | 'DIAMOND'
  | 'MASTER' | 'GRANDMASTER' | 'CHALLENGER'

export const TIER_COLORS: Record<Tier, string> = {
  IRON: '#6B5244',
  BRONZE: '#CD7F32',
  SILVER: '#A8B2BE',
  GOLD: '#FFD700',
  PLATINUM: '#00CED1',
  EMERALD: '#00C957',
  DIAMOND: '#B9F2FF',
  MASTER: '#B19CD9',
  GRANDMASTER: '#FF4655',
  CHALLENGER: '#F4C430'
}
