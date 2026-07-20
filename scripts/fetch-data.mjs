#!/usr/bin/env node
// Fetches ESPN MLB standings + scores and writes the JSON the site consumes.
// Run nightly and ad hoc: node scripts/fetch-data.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'data')
mkdirSync(outDir, { recursive: true })

const SEASON = 2026
const STANDINGS = `https://site.api.espn.com/apis/v2/sports/baseball/mlb/standings?season=${SEASON}&level=3`
const SCOREBOARD = 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard'

async function getJson(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'WorldSeriesWatch/1.0 (non-commercial fan site)' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.json()
}

const LEAGUE_CODE = { 'American League': 'AL', 'National League': 'NL' }
const DIV_CODE = (name) => (/East/.test(name) ? 'East' : /Central/.test(name) ? 'Central' : 'West')

const [st, sb] = await Promise.all([getJson(STANDINGS), getJson(SCOREBOARD)])

// ---- teams (leagues -> divisions -> teams) ----
const teams = {}
const leagues = { AL: { East: [], Central: [], West: [] }, NL: { East: [], Central: [], West: [] } }

for (const leagueNode of st.children ?? []) {
  const league = LEAGUE_CODE[leagueNode.name]
  if (!league) continue
  for (const divNode of leagueNode.children ?? []) {
    const division = DIV_CODE(divNode.name)
    for (const entry of divNode.standings?.entries ?? []) {
      const t = entry.team
      const stat = (name) => entry.stats.find((s) => s.name === name)
      const num = (name) => Number(stat(name)?.value ?? 0)
      const disp = (name) => stat(name)?.displayValue ?? ''
      // "-" for the leader; a number of games otherwise
      const gbRaw = disp('gamesBehind')
      const gb = gbRaw === '-' || gbRaw === '' ? 0 : Number(gbRaw)
      teams[t.id] = {
        id: t.id,
        name: t.displayName,
        shortName: t.shortDisplayName,
        abbrev: t.abbreviation ?? '',
        location: t.location ?? t.displayName,
        nickname: t.name ?? t.shortDisplayName,
        logo: t.logos?.[0]?.href ?? `https://a.espncdn.com/i/teamlogos/mlb/500/${(t.abbreviation ?? '').toLowerCase()}.png`,
        color: t.color ? `#${t.color}` : '#334155',
        altColor: t.alternateColor ? `#${t.alternateColor}` : '#0f172a',
        league,
        division,
        wins: num('wins'),
        losses: num('losses'),
        winPct: num('winPercent'),
        gamesPlayed: num('gamesPlayed'),
        gamesBehind: gb,
        divGamesBehind: (() => {
          const d = disp('divisionGamesBehind')
          return d === '-' || d === '' ? 0 : Number(d)
        })(),
        playoffSeed: num('playoffSeed') || null,
        playoffPct: num('playoffPercent'),
        divisionPct: num('divisionPercent'),
        wildCardPct: num('wildCardPercent'),
        magicDivision: stat('magicNumberDivision') ? num('magicNumberDivision') : null,
        magicWildcard: stat('magicNumberWildcard') ? num('magicNumberWildcard') : null,
        streak: disp('streak'),
        lastTen: disp('Last Ten Games'),
        runDiff: num('pointDifferential'),
        runsFor: num('pointsFor'),
        runsAgainst: num('pointsAgainst'),
        home: disp('Home'),
        road: disp('Road'),
        clinched: /clinch|z|y|x/i.test(entry.team?.seed ?? '') || false,
      }
      leagues[league][division].push(t.id)
    }
  }
}

// order each division by winPct desc
for (const lg of Object.values(leagues)) {
  for (const div of Object.keys(lg)) {
    lg[div].sort((a, b) => teams[b].winPct - teams[a].winPct || teams[b].wins - teams[a].wins)
  }
}

// ---- playoff picture (computed canonically, cross-checked with ESPN seeds) ----
// Per league: 3 division winners (best record in each division) seeded 1-3 by record;
// 3 wild cards (best 3 non-winners) seeded 4-6. Field of 6 per league.
function pictureFor(league) {
  const divs = ['East', 'Central', 'West']
  const leaders = divs.map((d) => leagues[league][d][0]).filter(Boolean)
  leaders.sort((a, b) => teams[b].winPct - teams[a].winPct || teams[b].wins - teams[a].wins)
  const leaderSet = new Set(leaders)
  const rest = divs
    .flatMap((d) => leagues[league][d].slice(1))
    .filter((id) => !leaderSet.has(id))
    .sort((a, b) => teams[b].winPct - teams[a].winPct || teams[b].wins - teams[a].wins)
  const wildCards = rest.slice(0, 3)
  const inHunt = rest.slice(3, 8) // next few chasing a wild card
  const seeds = {}
  leaders.forEach((id, i) => (seeds[i + 1] = id))
  wildCards.forEach((id, i) => (seeds[i + 4] = id))
  // games back of the last wild-card spot, for the chasers
  const cutoff = wildCards.length === 3 ? teams[wildCards[2]] : null
  return {
    leaders,
    wildCards,
    inHunt,
    seeds,
    lastWildCardWins: cutoff ? cutoff.wins : null,
    lastWildCardLosses: cutoff ? cutoff.losses : null,
  }
}

const picture = { AL: pictureFor('AL'), NL: pictureFor('NL') }

// ---- games (yesterday + today) for the "today" strip ----
const games = (sb.events ?? []).map((e) => {
  const c = e.competitions?.[0]
  const home = c?.competitors?.find((x) => x.homeAway === 'home')
  const away = c?.competitors?.find((x) => x.homeAway === 'away')
  return {
    id: e.id,
    date: e.date,
    status: c?.status?.type?.state ?? 'pre', // pre | in | post
    detail: c?.status?.type?.shortDetail ?? '',
    homeId: home?.team?.id ?? null,
    awayId: away?.team?.id ?? null,
    homeScore: home?.score != null ? Number(home.score) : null,
    awayScore: away?.score != null ? Number(away.score) : null,
    homeAbbr: home?.team?.abbreviation ?? '',
    awayAbbr: away?.team?.abbreviation ?? '',
  }
})

// ---- sanity, then write ----
const n = Object.keys(teams).length
if (n !== 30) throw new Error(`Expected 30 teams, got ${n}`)
for (const lg of ['AL', 'NL']) {
  if (picture[lg].leaders.length !== 3) throw new Error(`${lg} should have 3 division leaders`)
}

writeFileSync(
  join(outDir, 'standings.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), season: SEASON, teams, leagues, picture }, null, 1)
)
writeFileSync(join(outDir, 'games.json'), JSON.stringify({ generatedAt: new Date().toISOString(), games }, null, 1))

const sample = teams[picture.AL.seeds[1]]
console.log(
  `standings.json: ${n} teams | AL top seed: ${sample.name} (${sample.wins}-${sample.losses}, ${Math.round(sample.playoffPct)}% playoff) | games.json: ${games.length} games`
)
