import { team as getTeam, leagueBracket } from '../lib/data'
import type { DataBundle, League } from '../types'
import Term from './Term'
import TeamChip from './TeamChip'

/**
 * The centerpiece: a plain-language "if the season ended today" road from the
 * twelve playoff teams to the World Series. Real seeded matchups where known,
 * honest "winner advances" placeholders beyond.
 */
export default function RoadToWS({ data }: { data: DataBundle }) {
  return (
    <section className="road" id="road">
      <div className="section-head">
        <h2>The road to the World Series</h2>
        <p className="section-sub">
          If the <Term k="playoffs">playoffs</Term> started today, here's who'd be in and how they'd meet. Twelve teams,
          three knockout rounds per league, then the champions collide.
        </p>
      </div>

      <div className="road-grid">
        <LeagueColumn data={data} league="AL" side="left" />

        <div className="ws-center">
          <div className="ws-round-label">
            <Term k="world series">World Series</Term>
          </div>
          <div className="ws-trophy">🏆</div>
          <TeamChip team={null} sub="AL champion" size="md" />
          <div className="ws-vs">vs</div>
          <TeamChip team={null} sub="NL champion" size="md" />
          <p className="ws-note">
            <Term k="best of 7">Best of 7</Term> — first to 4 wins is champion of baseball.
          </p>
        </div>

        <LeagueColumn data={data} league="NL" side="right" />
      </div>

      <p className="road-foot">
        Seeds and matchups update every night from the real standings. Nobody's clinched yet — this is the projected
        picture, not the final bracket.
      </p>
    </section>
  )
}

function LeagueColumn({ data, league, side }: { data: DataBundle; league: League; side: 'left' | 'right' }) {
  const s = data.standings
  const b = leagueBracket(s.picture[league])
  const seeds = s.picture[league].seeds
  const T = (id: string | null) => getTeam(s, id)

  return (
    <div className={`road-col ${side}`}>
      <h3 className="road-league">{league === 'AL' ? 'American League' : 'National League'}</h3>

      <div className="road-round">
        <div className="round-label">
          <Term k="wild card series">Wild Card round</Term>
          <span className="round-note">best of 3</span>
        </div>
        {b.wildcard.map((m, i) => (
          <div key={i} className="matchup">
            <TeamChip team={T(m.topId)} seed={m.topSeed} size="sm" />
            <span className="mu-v">vs</span>
            <TeamChip team={T(m.botId)} seed={m.botSeed} size="sm" />
          </div>
        ))}
      </div>

      <div className="road-round">
        <div className="round-label">
          <Term k="division series">Division Series</Term>
          <span className="round-note">best of 5</span>
        </div>
        <div className="matchup">
          <TeamChip team={T(seeds[1])} seed={1} tag="bye" size="sm" />
          <span className="mu-v">vs</span>
          <TeamChip team={null} sub="4/5 winner" size="sm" />
        </div>
        <div className="matchup">
          <TeamChip team={T(seeds[2])} seed={2} tag="bye" size="sm" />
          <span className="mu-v">vs</span>
          <TeamChip team={null} sub="3/6 winner" size="sm" />
        </div>
      </div>

      <div className="road-round">
        <div className="round-label">
          <Term k="league championship">League Championship</Term>
          <span className="round-note">best of 7</span>
        </div>
        <div className="matchup single">
          <TeamChip team={null} sub={`${league} pennant`} size="sm" />
        </div>
      </div>
    </div>
  )
}
