interface KDABadgeProps {
  kills: number
  deaths: number
  assists: number
  kda: number
}

function KDABadge({ kills, deaths, assists, kda }: KDABadgeProps) {
  // Determine color based on KDA
  let kdaColor = 'text-gray-400'
  if (kda >= 5) {
    kdaColor = 'text-yellow-400'
  } else if (kda >= 3) {
    kdaColor = 'text-green-400'
  } else if (kda >= 2) {
    kdaColor = 'text-blue-400'
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold">
        <span className="text-green-400">{kills}</span>
        <span className="text-gray-500"> / </span>
        <span className="text-red-400">{deaths}</span>
        <span className="text-gray-500"> / </span>
        <span className="text-blue-400">{assists}</span>
      </span>
      <span className={`font-bold ${kdaColor}`}>
        {kda.toFixed(2)} KDA
      </span>
    </div>
  )
}

export default KDABadge
