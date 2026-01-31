import { TierListData, TIER_RANKS, TierRank } from '../types/champion'
import TierBadge from './TierBadge'
import ChampionIcon from './ChampionIcon'

interface TierListTableProps {
  tierList: TierListData
}

function TierListTable({ tierList }: TierListTableProps) {
  // Group champions by tier
  const championsByTier = TIER_RANKS.reduce((acc, tier) => {
    acc[tier] = tierList.champions.filter((champ) => champ.tier === tier)
    return acc
  }, {} as Record<TierRank, typeof tierList.champions>)

  return (
    <div className="space-y-6">
      {TIER_RANKS.map((tier) => {
        const champions = championsByTier[tier]
        if (champions.length === 0) {
          return null
        }

        return (
          <div key={tier}>
            <div className="flex items-center gap-3 mb-3">
              <TierBadge tier={tier} size="lg" />
              <span className="text-gray-400 text-sm">{champions.length} champions</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {champions.map((champion) => (
                <ChampionCard key={champion.championId} champion={champion} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Individual champion card component
function ChampionCard({ champion }: { champion: TierListData['champions'][0] }) {
  return (
    <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors">
      <div className="flex flex-col items-center">
        <ChampionIcon championName={champion.championName} size="md" />
        
        <div className="text-center mt-2 w-full">
          <p className="font-semibold text-sm truncate">{champion.championName}</p>
          
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Win Rate:</span>
              <span className="text-green-400 font-semibold">
                {(champion.winRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pick Rate:</span>
              <span className="text-blue-400 font-semibold">
                {(champion.pickRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">KDA:</span>
              <span className="text-purple-400 font-semibold">
                {champion.averageKDA.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TierListTable
