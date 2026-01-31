// Champion Data Types

export interface ChampionData {
  version: string
  id: string
  key: string
  name: string
  title: string
  blurb: string
  info: {
    attack: number
    defense: number
    magic: number
    difficulty: number
  }
  image: {
    full: string
    sprite: string
    group: string
    x: number
    y: number
    w: number
    h: number
  }
  tags: string[]
  partype: string
  stats: ChampionStats
}

export interface ChampionStats {
  hp: number
  hpperlevel: number
  mp: number
  mpperlevel: number
  movespeed: number
  armor: number
  armorperlevel: number
  spellblock: number
  spellblockperlevel: number
  attackrange: number
  hpregen: number
  hpregenperlevel: number
  mpregen: number
  mpregenperlevel: number
  crit: number
  critperlevel: number
  attackdamage: number
  attackdamageperlevel: number
  attackspeedperlevel: number
  attackspeed: number
}

export interface ChampionsData {
  type: string
  format: string
  version: string
  data: Record<string, ChampionData>
}

// Tier List Types
export type Role = 'top' | 'jungle' | 'mid' | 'adc' | 'support'

export const ROLES: Role[] = ['top', 'jungle', 'mid', 'adc', 'support']

export const ROLE_NAMES: Record<Role, string> = {
  top: 'Top',
  jungle: 'Jungle',
  mid: 'Mid',
  adc: 'ADC',
  support: 'Support'
}

export type TierRank = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'

export const TIER_RANKS: TierRank[] = ['S+', 'S', 'A', 'B', 'C', 'D']

export interface ChampionTierData {
  championId: number
  championName: string
  role: Role
  tier: TierRank
  winRate: number
  pickRate: number
  banRate: number
  averageKDA: number
  gamesPlayed: number
}

export interface TierListData {
  role: Role
  lastUpdated: string
  champions: ChampionTierData[]
}

export interface TierListResponse {
  success: boolean
  data: TierListData
}

// Get champion icon URL from Data Dragon
export function getChampionIconUrl(championName: string, version = '14.1.1'): string {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`
}

// Get champion splash URL
export function getChampionSplashUrl(championName: string, skinNum = 0): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_${skinNum}.jpg`
}
