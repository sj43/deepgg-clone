interface WinRateBarProps {
  wins: number
  losses: number
}

function WinRateBar({ wins, losses }: WinRateBarProps) {
  const total = wins + losses
  const winPercent = total > 0 ? (wins / total) * 100 : 0

  return (
    <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${winPercent}%` }}
      />
    </div>
  )
}

export default WinRateBar
