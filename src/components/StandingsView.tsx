import { LEAGUE_NAME, playoffStatus, TONE_COLOR } from '../lib/data'
import type { DataBundle, Division, League } from '../types'
import Term from './Term'

const DIVS: Division[] = ['East', 'Central', 'West']

/** Standings, de-jargoned: each division as a simple table with a "form" bar. */
export default function StandingsView({ data }: { data: DataBundle }) {
  return (
    <section className="standings" id="standings">
      <div className="section-head">
        <h2>The standings, made simple</h2>
        <p className="section-sub">
          Every team's <Term k="record">record</Term> so far. The bar shows <Term k="win percentage">win percentage</Term>{' '}
          — how often they win. Longer bar = better team.
        </p>
      </div>
      {(['AL', 'NL'] as League[]).map((lg) => (
        <div key={lg} className="std-league">
          <h3>{LEAGUE_NAME[lg]}</h3>
          <div className="std-divs">
            {DIVS.map((div) => (
              <div key={div} className="std-div">
                <h4>{div}</h4>
                {data.standings.leagues[lg][div].map((id, i) => {
                  const t = data.standings.teams[id]
                  const st = playoffStatus(t)
                  return (
                    <div key={id} className="std-row">
                      <span className="std-pos">{i + 1}</span>
                      <img className="std-logo" src={t.logo} alt="" loading="lazy" />
                      <span className="std-name">{t.shortName}</span>
                      <span className="std-bar-wrap">
                        <span className="std-bar" style={{ width: `${t.winPct * 100}%`, background: TONE_COLOR[st.tone] }} />
                      </span>
                      <span className="std-rec">
                        {t.wins}–{t.losses}
                      </span>
                      <span className="std-gb">{i === 0 ? 'leads' : `-${t.divGamesBehind}`}</span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="std-foot">
        "leads" = first in the division. "-3" means three <Term k="games behind">games behind</Term> first place.
      </p>
    </section>
  )
}
