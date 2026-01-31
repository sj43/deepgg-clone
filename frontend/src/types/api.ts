// API Response Types

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: {
    message: string
    code?: string
  }
  cached?: boolean
  cacheAge?: number
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

// Region types
export type Region = 
  | 'na' | 'euw' | 'eune' | 'kr' | 'br' 
  | 'jp' | 'lan' | 'las' | 'oce' | 'tr' | 'ru'

export const REGIONS: Region[] = [
  'na', 'euw', 'eune', 'kr', 'br',
  'jp', 'lan', 'las', 'oce', 'tr', 'ru'
]

export const REGION_NAMES: Record<Region, string> = {
  na: 'North America',
  euw: 'Europe West',
  eune: 'Europe Nordic & East',
  kr: 'Korea',
  br: 'Brazil',
  jp: 'Japan',
  lan: 'Latin America North',
  las: 'Latin America South',
  oce: 'Oceania',
  tr: 'Turkey',
  ru: 'Russia'
}
