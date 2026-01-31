// Match Data Types

export interface MatchMetadata {
  dataVersion: string
  matchId: string
  participants: string[]
}

export interface MatchParticipant {
  puuid: string
  summonerName: string
  championName: string
  championId: number
  kills: number
  deaths: number
  assists: number
  totalDamageDealtToChampions: number
  goldEarned: number
  totalMinionsKilled: number
  neutralMinionsKilled: number
  visionScore: number
  teamPosition: string
  item0: number
  item1: number
  item2: number
  item3: number
  item4: number
  item5: number
  item6: number
  summoner1Id: number
  summoner2Id: number
  win: boolean
  // Additional stats
  champLevel: number
  wardsPlaced: number
  wardsKilled: number
  damageDealtToObjectives: number
  damageDealtToTurrets: number
  totalDamageTaken: number
  timeCCingOthers: number
  totalHeal: number
}

export interface MatchTeam {
  teamId: number
  win: boolean
  bans: Array<{
    championId: number
    pickTurn: number
  }>
  objectives: {
    baron: { first: boolean; kills: number }
    champion: { first: boolean; kills: number }
    dragon: { first: boolean; kills: number }
    inhibitor: { first: boolean; kills: number }
    riftHerald: { first: boolean; kills: number }
    tower: { first: boolean; kills: number }
  }
}

export interface MatchInfo {
  gameCreation: number
  gameDuration: number
  gameEndTimestamp: number
  gameId: number
  gameMode: string
  gameName: string
  gameStartTimestamp: number
  gameType: string
  gameVersion: string
  mapId: number
  participants: MatchParticipant[]
  platformId: string
  queueId: number
  teams: MatchTeam[]
  tournamentCode?: string
}

export interface Match {
  metadata: MatchMetadata
  info: MatchInfo
}

export interface MatchHistory {
  matches: string[]
  totalMatches: number
}

export interface MatchDetailsResponse {
  match: Match
  participantStats: MatchParticipant
}

// Queue ID constants
export const QUEUE_IDS: Record<number, string> = {
  420: 'Ranked Solo/Duo',
  440: 'Ranked Flex',
  400: 'Normal Draft',
  430: 'Normal Blind',
  450: 'ARAM',
  900: 'URF',
  1020: 'One For All',
  1300: 'Nexus Blitz'
}

// Calculate KDA ratio
export function calculateKDA(kills: number, deaths: number, assists: number): number {
  if (deaths === 0) {
    return kills + assists
  }
  return Number(((kills + assists) / deaths).toFixed(2))
}

// Format game duration
export function formatGameDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
