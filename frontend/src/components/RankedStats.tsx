import { RankedStats as RankedStatsType, QUEUE_TYPES } from '../types/summoner'
import RankBadge from './RankBadge'
import WinRateBar from './WinRateBar'

interface RankedStatsProps {
  rankedStats: RankedStatsType[]
}

function RankedStats({ rankedStats }: RankedStatsProps) {
  if (!rankedStats || rankedStats.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Ranked Stats</h2>
        <p className="text-gray-400">No ranked stats available</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Ranked Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rankedStats.map((stats) => {
          const queueName = QUEUE_TYPES[stats.queueType as keyof typeof QUEUE_TYPES] || stats.queueType
          const totalGames = stats.wins + stats.losses
          const winRate = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0

          return (
            <div
              key={stats.queueType}
              className="bg-gray-700 rounded-lg p-4 flex items-center gap-4"
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <RankBadge tier={stats.tier} rank={stats.rank} />
              </div>

              {/* Stats */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{queueName}</h3>
                <p className="text-gray-300 mb-2">
                  {stats.tier} {stats.rank} • {stats.leaguePoints} LP
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {stats.wins}W {stats.losses}L
                    </span>
                    <span className="text-gray-300">
                      {winRate.toFixed(1)}% WR
                    </span>
                  </div>
                  <WinRateBar wins={stats.wins} losses={stats.losses} />
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {stats.hotStreak && (
                    <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">
                      🔥 Hot Streak
                    </span>
                  )}
                  {stats.veteran && (
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                      Veteran
                    </span>
                  )}
                  {stats.freshBlood && (
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                      Fresh Blood
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RankedStats
