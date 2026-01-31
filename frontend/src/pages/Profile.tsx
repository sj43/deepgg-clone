import { useParams, Link } from 'react-router-dom'
import { useSummoner } from '../hooks/useSummoner'
import { Region } from '../types/api'
import Navbar from '../components/Navbar'
import ProfileHeader from '../components/ProfileHeader'
import RankedStats from '../components/RankedStats'
import MatchHistory from '../components/MatchHistory'

function Profile() {
  const { region, gameName, tagLine } = useParams<{
    region: Region
    gameName: string
    tagLine: string
  }>()

  const { data, isLoading, error } = useSummoner(
    region as Region,
    gameName || '',
    tagLine || ''
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading summoner profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-gray-400 mb-6">
            {(error as Error).message || 'Failed to load summoner profile'}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">No data available</p>
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  const profile = data.data

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader
          summoner={profile.summoner}
          account={profile.account}
          region={region as Region}
        />
        
        <div className="mt-8">
          <RankedStats rankedStats={profile.rankedStats} />
        </div>

        <div className="mt-8">
          <MatchHistory puuid={profile.summoner.puuid} />
        </div>
      </div>
    </div>
  )
}

export default Profile
