import { TierRank } from '../types/champion'

interface TierBadgeProps {
  tier: TierRank
  size?: 'sm' | 'md' | 'lg'
}

const TIER_COLORS: Record<TierRank, string> = {
  'S+': '#FF4655',
  'S': '#FFD700',
  'A': '#00C957',
  'B': '#00CED1',
  'C': '#A8B2BE',
  'D': '#6B5244'
}

function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const color = TIER_COLORS[tier]
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg'
  }

  const sizeClass = sizeClasses[size]

  return (
    <div
      className={`${sizeClass} rounded-lg flex items-center justify-center font-bold border-2`}
      style={{
        backgroundColor: color + '20',
        borderColor: color,
        color: color
      }}
    >
      {tier}
    </div>
  )
}

export default TierBadge
