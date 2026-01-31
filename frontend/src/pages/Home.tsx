import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateSummonerInput, parseSummonerInput } from '../services/summonerService'
import { Region, REGIONS, REGION_NAMES } from '../types/api'

function Home() {
  const [searchInput, setSearchInput] = useState('')
  const [region, setRegion] = useState<Region>('na')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    // Clear previous error
    setError('')

    // Validate input
    const validation = validateSummonerInput(searchInput)
    if (!validation.valid) {
      setError(validation.error || 'Invalid input')
      return
    }

    // Parse input
    const parsed = parseSummonerInput(searchInput)
    if (!parsed) {
      setError('Invalid format. Use: GameName#TAG')
      return
    }

    // Navigate to profile page
    navigate(`/profile/${region}/${parsed.gameName}/${parsed.tagLine}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">DeepGG Clone</h1>
        <p className="text-gray-400">League of Legends Stats Tracker</p>
      </header>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          {/* Region Selector */}
          <div className="mb-4">
            <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-2">
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value as Region)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {REGION_NAMES[r]}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search summoner (e.g., HideOnBush#KR1)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
