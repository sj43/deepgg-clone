import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/Home'
import Profile from './pages/Profile'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:region/:gameName/:tagLine" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
