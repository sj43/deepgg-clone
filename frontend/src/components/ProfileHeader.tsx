import { Summoner, RiotAccount } from '../types/summoner'
import { Region, REGION_NAMES } from '../types/api'

interface ProfileHeaderProps {
  summoner: Summoner
  account: RiotAccount
  region: Region
}

function ProfileHeader({ summoner, account, region }: ProfileHeaderProps) {
  const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${summoner.profileIconId}.png`

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-6">
        {/* Profile Icon */}
        <div className="flex-shrink-0">
          <img
            src={profileIconUrl}
            alt={`${account.gameName} profile icon`}
            className="w-24 h-24 rounded-lg border-4 border-gray-700"
            onError={(e) => {
              e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/29.png'
            }}
          />
        </div>

        {/* Summoner Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-1">
            {account.gameName}
            <span className="text-gray-400">#{account.tagLine}</span>
          </h1>
          <p className="text-gray-400 mb-2">
            Level {summoner.summonerLevel} • {REGION_NAMES[region]}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
