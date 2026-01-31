import { Tier, TIER_COLORS } from '../types/summoner'

interface RankBadgeProps {
  tier: string
  rank: string
  size?: 'sm' | 'md' | 'lg'
}

function RankBadge({ tier, rank, size = 'md' }: RankBadgeProps) {
  const tierUpper = tier.toUpperCase() as Tier
  const color = TIER_COLORS[tierUpper] || '#6B5244'
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-base'
  }

  const sizeClass = sizeClasses[size]

  return (
    <div
      className={`${sizeClass} rounded-lg flex flex-col items-center justify-center font-bold border-2`}
      style={{
        backgroundColor: color + '20',
        borderColor: color,
        color: color
      }}
    >
      <div className="leading-tight">{tier}</div>
      <div className="leading-tight text-xs opacity-80">{rank}</div>
    </div>
  )
}

export default RankBadge
