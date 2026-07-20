import { useEffect, useMemo, useState } from 'react'
import HowItWorks from './components/HowItWorks'
import PicksBar from './components/PicksBar'
import PlayoffPicture from './components/PlayoffPicture'
import RoadToWS from './components/RoadToWS'
import StandingsView from './components/StandingsView'
import TodayStrip from './components/TodayStrip'
import { loadData, team as getTeam } from './lib/data'
import type { Picks } from './lib/picks'
import { decodePicks, loadPicks, savePicks } from './lib/picks'
import type { DataBundle } from './types'

const NAV = [
  ['road', 'Road to the title'],
  ['picture', "Who's in"],
  ['picks', 'Your call'],
  ['standings', 'Standings'],
  ['how', 'How it works'],
]

export default function App() {
  const [data, setData] = useState<DataBundle | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [picks, setPicksState] = useState<Picks>(() => loadPicks())
  const [theirs, setTheirs] = useState<Picks | null>(null)

  useEffect(() => {
    loadData().then(setData, (e) => setError(String(e)))
    const parse = () => {
      const m = location.hash.match(/#p=([A-Za-z0-9_-]+)/)
      setTheirs(m ? decodePicks(m[1]) : null)
    }
    parse()
    window.addEventListener('hashchange', parse)
    return () => window.removeEventListener('hashchange', parse)
  }, [])

  const setPicks = (p: Picks) => {
    savePicks(p)
    setPicksState(p)
  }

  const champ = useMemo(() => (data ? getTeam(data.standings, picks.wsWinner) : null), [data, picks.wsWinner])

  if (error)
    return (
      <div className="boot">
        <p>Couldn't load the standings ({error}). Try refreshing.</p>
      </div>
    )
  if (!data)
    return (
      <div className="boot">
        <p>⚾ Warming up…</p>
      </div>
    )

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-top">
          <div className="brand">
            <span className="brand-ball">⚾</span>
            <div>
              <h1>World Series Watch '26</h1>
              <p className="tagline">Who's headed to the World Series — explained for everyone.</p>
            </div>
          </div>
        </div>
        <TodayStrip data={data} />
        <nav className="nav">
          {NAV.map(([id, label]) => (
            <button key={id} onClick={() => jump(id)}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      {theirs && (
        <CompareBanner data={data} theirs={theirs} picks={picks} onClear={() => { history.replaceState(null, '', location.pathname); setTheirs(null) }} />
      )}

      <main>
        <RoadToWS data={data} />
        <PlayoffPicture data={data} />
        <PicksBar data={data} picks={picks} setPicks={setPicks} />
        <StandingsView data={data} />
        <HowItWorks />
      </main>

      <footer>
        <p>
          {champ ? `Your pick to win it all: ${champ.name}. ` : ''}
          Updated {new Date(data.standings.generatedAt).toLocaleString('en-US')} · data via ESPN · playoff odds via ESPN.
        </p>
        <p className="fine">
          Unofficial, non-commercial fan project. Not affiliated with MLB or any team. All times in your local time zone.
        </p>
      </footer>
    </div>
  )
}

function CompareBanner({
  data,
  theirs,
  picks,
  onClear,
}: {
  data: DataBundle
  theirs: Picks
  picks: Picks
  onClear: () => void
}) {
  const s = data.standings
  const nm = (id: string | null) => getTeam(s, id)?.shortName ?? '—'
  const line = (label: string, mine: string | null, their: string | null) => (
    <span className="cmp-line">
      {label}: <b>{nm(their)}</b>
      {mine && mine !== their ? <span className="cmp-diff"> (you: {nm(mine)})</span> : mine === their && mine ? ' ✓ same' : ''}
    </span>
  )
  return (
    <div className="compare">
      <span className="cmp-title">Comparing with {theirs.name || 'a friend'}:</span>
      {line('AL', picks.alChamp, theirs.alChamp)}
      {line('NL', picks.nlChamp, theirs.nlChamp)}
      {line('🏆', picks.wsWinner, theirs.wsWinner)}
      <button className="cmp-clear" onClick={onClear}>
        ✕
      </button>
    </div>
  )
}
