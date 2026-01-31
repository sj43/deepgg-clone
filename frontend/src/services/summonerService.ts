import { apiRequest } from './api'
import { ApiResponse, Region } from '../types/api'
import { SummonerProfile } from '../types/summoner'

/**
 * Get summoner profile by game name and tag line
 */
export async function getSummonerProfile(
  region: Region,
  gameName: string,
  tagLine: string
): Promise<ApiResponse<SummonerProfile>> {
  return apiRequest<SummonerProfile>(
    'get',
    `/api/summoner/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
  )
}

/**
 * Parse summoner search input (e.g., "HideOnBush#KR1")
 */
export function parseSummonerInput(input: string): { gameName: string; tagLine: string } | null {
  const trimmed = input.trim()
  
  // Check if input contains #
  if (!trimmed.includes('#')) {
    return null
  }

  const parts = trimmed.split('#')
  if (parts.length !== 2) {
    return null
  }

  const [gameName, tagLine] = parts
  
  if (!gameName || !tagLine) {
    return null
  }

  return {
    gameName: gameName.trim(),
    tagLine: tagLine.trim()
  }
}

/**
 * Validate summoner search input
 */
export function validateSummonerInput(input: string): { valid: boolean; error?: string } {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: 'Please enter a summoner name' }
  }

  const parsed = parseSummonerInput(input)
  if (!parsed) {
    return { valid: false, error: 'Invalid format. Use: GameName#TAG (e.g., HideOnBush#KR1)' }
  }

  if (parsed.gameName.length < 3 || parsed.gameName.length > 16) {
    return { valid: false, error: 'Game name must be 3-16 characters' }
  }

  if (parsed.tagLine.length < 3 || parsed.tagLine.length > 5) {
    return { valid: false, error: 'Tag line must be 3-5 characters' }
  }

  return { valid: true }
}
