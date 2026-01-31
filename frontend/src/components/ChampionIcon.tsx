import { getChampionIconUrl } from '../types/champion'

interface ChampionIconProps {
  championName: string
  size?: 'sm' | 'md' | 'lg'
}

function ChampionIcon({ championName, size = 'md' }: ChampionIconProps) {
  const iconUrl = getChampionIconUrl(championName)
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  const sizeClass = sizeClasses[size]

  return (
    <img
      src={iconUrl}
      alt={championName}
      className={`${sizeClass} rounded border-2 border-gray-600`}
      onError={(e) => {
        // Fallback to a default icon if champion icon fails to load
        e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/29.png'
      }}
    />
  )
}

export default ChampionIcon
