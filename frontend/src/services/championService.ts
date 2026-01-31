import { apiRequest } from './api'
import { ApiResponse } from '../types/api'
import { ChampionsData, TierListData, Role } from '../types/champion'

/**
 * Get all champion data from Data Dragon
 */
export async function getChampions(): Promise<ApiResponse<ChampionsData>> {
  return apiRequest<ChampionsData>('get', '/api/champions')
}

/**
 * Get champion tier list for a specific role
 */
export async function getTierList(role: Role): Promise<ApiResponse<TierListData>> {
  return apiRequest<TierListData>('get', `/api/champions/tierlist/${role}`)
}

/**
 * Get tier lists for all roles
 */
export async function getAllTierLists(): Promise<Record<Role, ApiResponse<TierListData>>> {
  const roles: Role[] = ['top', 'jungle', 'mid', 'adc', 'support']
  const promises = roles.map((role) => getTierList(role))
  const results = await Promise.all(promises)
  
  const tierLists: Record<string, ApiResponse<TierListData>> = {}
  roles.forEach((role, index) => {
    tierLists[role] = results[index]
  })
  
  return tierLists as Record<Role, ApiResponse<TierListData>>
}
