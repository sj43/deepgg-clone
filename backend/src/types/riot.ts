export interface RiotRegion {
  platform: string
  region: string
}

export const RIOT_REGIONS: Record<string, RiotRegion> = {
  'na': { platform: 'na1', region: 'americas' },
  'euw': { platform: 'euw1', region: 'europe' },
  'eune': { platform: 'eun1', region: 'europe' },
  'kr': { platform: 'kr', region: 'asia' },
  'br': { platform: 'br1', region: 'americas' },
  'jp': { platform: 'jp1', region: 'asia' },
  'lan': { platform: 'la1', region: 'americas' },
  'las': { platform: 'la2', region: 'americas' },
  'oce': { platform: 'oc1', region: 'sea' },
  'tr': { platform: 'tr1', region: 'europe' },
  'ru': { platform: 'ru', region: 'europe' },
}
