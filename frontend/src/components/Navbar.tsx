import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold hover:text-blue-400 transition-colors">
            DeepGG Clone
          </Link>
          
          <div className="flex gap-4">
            <Link
              to="/"
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              Search
            </Link>
            <Link
              to="/tierlist"
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              Tier List
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
