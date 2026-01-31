import { useState } from 'react'
import { useTierList } from '../hooks/useTierList'
import { Role, ROLES, ROLE_NAMES } from '../types/champion'
import Navbar from '../components/Navbar'
import TierListTable from '../components/TierListTable'

function TierList() {
  const [selectedRole, setSelectedRole] = useState<Role>('mid')
  
  const { data, isLoading, error } = useTierList(selectedRole)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Tier List Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-6">Champion Tier List</h1>

          {/* Role Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  selectedRole === role
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {ROLE_NAMES[role]}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading tier list...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠</div>
              <h2 className="text-2xl font-bold mb-2">Error Loading Tier List</h2>
              <p className="text-gray-400">{(error as Error).message}</p>
            </div>
          )}

          {/* Tier List Table */}
          {data?.data && <TierListTable tierList={data.data} />}
        </div>
      </div>
    </div>
  )
}

export default TierList
