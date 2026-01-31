import { useMatchHistory } from '../hooks/useMatchHistory'
import { useMatchDetails } from '../hooks/useMatchDetails'
import MatchCard from './MatchCard'

interface MatchHistoryProps {
  puuid: string
}

function MatchHistory({ puuid }: MatchHistoryProps) {
  const { data: historyData, isLoading: historyLoading, error: historyError } = useMatchHistory(puuid, 0, 10)

  if (historyLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Match History</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading matches...</p>
        </div>
      </div>
    )
  }

  if (historyError) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Match History</h2>
        <div className="text-center py-8">
          <p className="text-red-400">Failed to load match history</p>
          <p className="text-gray-500 text-sm mt-2">{(historyError as Error).message}</p>
        </div>
      </div>
    )
  }

  const matches = historyData?.data?.matches || []

  if (matches.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Match History</h2>
        <p className="text-gray-400 text-center py-8">No matches found</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Match History</h2>
      <div className="space-y-3">
        {matches.slice(0, 10).map((matchId) => (
          <MatchCardWrapper key={matchId} matchId={matchId} puuid={puuid} />
        ))}
      </div>
    </div>
  )
}

// Wrapper component to fetch and display individual match
function MatchCardWrapper({ matchId, puuid }: { matchId: string; puuid: string }) {
  const { data, isLoading, error } = useMatchDetails(matchId)

  if (isLoading) {
    return (
      <div className="bg-gray-700 rounded p-4 animate-pulse">
        <div className="h-20 bg-gray-600 rounded"></div>
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="bg-gray-700 rounded p-4 text-center text-gray-500 text-sm">
        Failed to load match
      </div>
    )
  }

  return <MatchCard match={data.data.match} puuid={puuid} />
}

export default MatchHistory
