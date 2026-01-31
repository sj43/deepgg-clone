import { Match } from '../types/match'
import { calculateKDA, formatGameDuration, QUEUE_IDS } from '../types/match'
import KDABadge from './KDABadge'

interface MatchCardProps {
  match: Match
  puuid: string
}

function MatchCard({ match, puuid }: MatchCardProps) {
  const { info } = match
  
  // Find the participant's data
  const participant = info.participants.find((p) => p.puuid === puuid)
  if (!participant) {
    return null
  }

  const win = participant.win
  const kda = calculateKDA(participant.kills, participant.deaths, participant.assists)
  const gameMode = QUEUE_IDS[info.queueId] || info.gameMode
  const duration = formatGameDuration(info.gameDuration)
  const championIconUrl = `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${participant.championName}.png`
  const cs = participant.totalMinionsKilled + participant.neutralMinionsKilled

  // Calculate time ago
  const timeAgo = getTimeAgo(info.gameEndTimestamp)

  return (
    <div
      className={`rounded-lg p-4 border-l-4 ${
        win ? 'bg-blue-900/20 border-blue-500' : 'bg-red-900/20 border-red-500'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Champion Icon */}
        <div className="flex-shrink-0">
          <img
            src={championIconUrl}
            alt={participant.championName}
            className="w-16 h-16 rounded"
            onError={(e) => {
              e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/29.png'
            }}
          />
        </div>

        {/* Game Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className={`font-bold ${win ? 'text-blue-400' : 'text-red-400'}`}>
                {win ? 'Victory' : 'Defeat'}
              </span>
              <span className="text-gray-400 text-sm ml-2">{gameMode}</span>
            </div>
            <span className="text-gray-500 text-sm">{timeAgo}</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="font-semibold">{participant.championName}</span>
              <span className="text-gray-400 ml-2">Level {participant.champLevel}</span>
            </div>
            <KDABadge
              kills={participant.kills}
              deaths={participant.deaths}
              assists={participant.assists}
              kda={kda}
            />
            <div className="text-gray-400">
              {cs} CS • {duration}
            </div>
          </div>

          {/* Items */}
          <div className="flex gap-1 mt-2">
            {[
              participant.item0,
              participant.item1,
              participant.item2,
              participant.item3,
              participant.item4,
              participant.item5,
              participant.item6
            ].map((itemId, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center"
              >
                {itemId > 0 ? (
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/item/${itemId}.png`}
                    alt={`Item ${itemId}`}
                    className="w-full h-full rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }
  return 'Just now'
}

export default MatchCard
