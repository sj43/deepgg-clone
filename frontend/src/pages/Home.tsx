function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">DeepGG Clone</h1>
        <p className="text-gray-400">League of Legends Stats Tracker</p>
      </header>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          <input
            type="text"
            placeholder="Search summoner (e.g., HideOnBush#KR1)"
            className="w-full px-4 py-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
