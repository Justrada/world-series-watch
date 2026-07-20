import { useState } from 'react'
import { LEAGUE_NAME, team as getTeam } from '../lib/data'
import type { Picks } from '../lib/picks'
import { encodePicks } from '../lib/picks'
import type { DataBundle, League } from '../types'
import Term from './Term'
import TeamChip from './TeamChip'

interface Props {
  data: DataBundle
  picks: Picks
  setPicks: (p: Picks) => void
}

/** Predict the two league champions and the World Series winner. */
export default function PicksBar({ data, picks, setPicks }: Props) {
  const s = data.standings
  const [copied, setCopied] = useState(false)
  const [pickingFor, setPickingFor] = useState<League | 'ws' | null>(null)

  // Candidate pool: everyone still with a pulse, best odds first.
  const pool = (lg: League) =>
    Object.values(s.teams)
      .filter((t) => t.league === lg && t.playoffPct > 0)
      .sort((a, b) => b.playoffPct - a.playoffPct)

  const wsPool = [picks.alChamp, picks.nlChamp].filter(Boolean) as string[]

  const set = (patch: Partial<Picks>) => {
    const next = { ...picks, ...patch }
    // if a league champ changes, drop a now-invalid WS pick
    if (next.wsWinner && next.wsWinner !== next.alChamp && next.wsWinner !== next.nlChamp) next.wsWinner = null
    setPicks(next)
    setPickingFor(null)
  }

  const shareText = () => {
    const al = getTeam(s, picks.alChamp)
    const nl = getTeam(s, picks.nlChamp)
    const ws = getTeam(s, picks.wsWinner)
    const bits = ['My 2026 World Series call:']
    if (al) bits.push(`AL: ${al.shortName}.`)
    if (nl) bits.push(`NL: ${nl.shortName}.`)
    if (ws) bits.push(`Champs: ${ws.shortName} 🏆`)
    bits.push('Make yours 👇')
    return bits.join(' ')
  }
  const url = () => `${location.origin}${location.pathname}#p=${encodePicks(picks)}`

  return (
    <section className="picks" id="picks">
      <div className="section-head">
        <h2>Make your call</h2>
        <p className="section-sub">
          Pick who wins each league's <Term k="pennant">pennant</Term>, then who takes it all. Your picks save
          automatically — share the link and see who in your group has the best eye.
        </p>
      </div>

      <div className="picks-row">
        {(['AL', 'NL'] as League[]).map((lg) => (
          <div key={lg} className="pick-slot">
            <div className="pick-label">{LEAGUE_NAME[lg]} champion</div>
            <button className="pick-target" onClick={() => setPickingFor(pickingFor === lg ? null : lg)}>
              {getTeam(s, lg === 'AL' ? picks.alChamp : picks.nlChamp) ? (
                <TeamChip team={getTeam(s, lg === 'AL' ? picks.alChamp : picks.nlChamp)} size="md" />
              ) : (
                <span className="pick-empty">Tap to choose…</span>
              )}
            </button>
            {pickingFor === lg && (
              <div className="pick-menu">
                {pool(lg).map((t) => (
                  <button
                    key={t.id}
                    className="pick-option"
                    onClick={() => set(lg === 'AL' ? { alChamp: t.id } : { nlChamp: t.id })}
                  >
                    <img src={t.logo} alt="" width={20} height={20} />
                    {t.shortName}
                    <span className="po-odds">{Math.round(t.playoffPct)}%</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="pick-slot ws-slot">
          <div className="pick-label">🏆 World Series winner</div>
          <button
            className="pick-target"
            disabled={!wsPool.length}
            onClick={() => setPickingFor(pickingFor === 'ws' ? null : 'ws')}
          >
            {getTeam(s, picks.wsWinner) ? (
              <TeamChip team={getTeam(s, picks.wsWinner)} size="md" />
            ) : (
              <span className="pick-empty">{wsPool.length ? 'Tap to choose…' : 'Pick your champions first'}</span>
            )}
          </button>
          {pickingFor === 'ws' && (
            <div className="pick-menu">
              {wsPool.map((id) => {
                const t = getTeam(s, id)!
                return (
                  <button key={id} className="pick-option" onClick={() => set({ wsWinner: id })}>
                    <img src={t.logo} alt="" width={20} height={20} />
                    {t.shortName}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="share-row">
        <button
          className="share-btn x"
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(url())}`,
              '_blank',
              'noopener,width=600,height=500'
            )
          }
        >
          𝕏 Post
        </button>
        <button
          className="share-btn wa"
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText()} ${url()}`)}`, '_blank')}
        >
          WhatsApp
        </button>
        <button
          className="share-btn copy"
          onClick={async () => {
            await navigator.clipboard.writeText(url())
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
        >
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </section>
  )
}
