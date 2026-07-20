import { LEAGUE_NAME, TONE_COLOR, gamesBackText, playoffStatus, team as getTeam } from '../lib/data'
import type { DataBundle, League, Team } from '../types'
import Term from './Term'

/** Who's in a playoff spot right now, and who's chasing — with plain-English status. */
export default function PlayoffPicture({ data }: { data: DataBundle }) {
  return (
    <section className="picture" id="picture">
      <div className="section-head">
        <h2>Who's in right now</h2>
        <p className="section-sub">
          Six teams from each league make the playoffs: three <Term k="division leader">division leaders</Term> and
          three <Term k="wild card">wild cards</Term>. Here's where things stand — and who's still chasing.
        </p>
      </div>
      <div className="pic-grid">
        <LeaguePicture data={data} league="AL" />
        <LeaguePicture data={data} league="NL" />
      </div>
    </section>
  )
}

function LeaguePicture({ data, league }: { data: DataBundle; league: League }) {
  const s = data.standings
  const p = s.picture[league]
  const row = (id: string, seed: number, kind: 'leader' | 'wildcard') => {
    const t = getTeam(s, id)
    if (!t) return null
    const st = playoffStatus(t)
    return (
      <div key={id} className="pic-row in">
        <span className="pic-seed">{seed}</span>
        <img className="pic-logo" src={t.logo} alt="" loading="lazy" />
        <span className="pic-team">
          <span className="pic-name">{t.shortName}</span>
          <span className="pic-rec">
            {t.wins}–{t.losses} · {kind === 'leader' ? `${t.division} leader` : 'Wild card'}
          </span>
        </span>
        <span className="pic-status" style={{ ['--tone' as string]: TONE_COLOR[st.tone] }} title={st.blurb}>
          {Math.round(t.playoffPct)}%
        </span>
      </div>
    )
  }

  return (
    <div className="pic-col">
      <h3>{LEAGUE_NAME[league]}</h3>
      <div className="pic-band in-band">
        <div className="band-label">✅ In a playoff spot</div>
        {p.leaders.map((id, i) => row(id, i + 1, 'leader'))}
        <div className="band-divider">
          <span>wild cards</span>
        </div>
        {p.wildCards.map((id, i) => row(id, i + 4, 'wildcard'))}
      </div>
      <div className="pic-band hunt-band">
        <div className="band-label">👀 In the hunt</div>
        {p.inHunt.map((id) => {
          const t = getTeam(s, id) as Team
          const gb = gamesBackText(t, p, s.teams)
          const st = playoffStatus(t)
          return (
            <div key={id} className="pic-row hunt">
              <img className="pic-logo" src={t.logo} alt="" loading="lazy" />
              <span className="pic-team">
                <span className="pic-name">{t.shortName}</span>
                <span className="pic-rec">
                  {t.wins}–{t.losses} · {gb}
                </span>
              </span>
              <span className="pic-status" style={{ ['--tone' as string]: TONE_COLOR[st.tone] }}>
                {Math.round(t.playoffPct)}%
              </span>
            </div>
          )
        })}
      </div>
      <p className="pic-legend">
        The % is each team's <Term k="playoff odds">playoff odds</Term>.
      </p>
    </div>
  )
}
