import type { DataBundle } from '../types'

export default function TodayStrip({ data }: { data: DataBundle }) {
  const games = data.games
  if (!games.length) return null
  return (
    <div className="today-strip">
      <span className="today-label">Today's games</span>
      {games.map((g) => {
        const live = g.status === 'in'
        const done = g.status === 'post'
        const label = g.status === 'pre'
          ? new Date(g.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : `${g.awayScore ?? 0}–${g.homeScore ?? 0}`
        return (
          <span key={g.id} className={`today-chip ${g.status}`}>
            {live && <span className="live-dot">●</span>}
            <b>{g.awayAbbr}</b>
            <span className="today-sc">{label}</span>
            <b>{g.homeAbbr}</b>
            {done && <span className="today-final">F</span>}
            {live && <span className="today-inning">{g.detail}</span>}
          </span>
        )
      })}
    </div>
  )
}
