import type { DataBundle, League, Picture, Standings, Team } from '../types'

export async function loadData(): Promise<DataBundle> {
  const get = (f: string) => fetch(`data/${f}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
  const [standings, games] = await Promise.all([get('standings.json'), get('games.json').catch(() => ({ games: [] }))])
  return { standings, games: games.games ?? [] }
}

export const LEAGUE_NAME: Record<League, string> = {
  AL: 'American League',
  NL: 'National League',
}

/** A plain-English read on how likely a team is to make the playoffs. */
export interface Status {
  label: string
  blurb: string
  tone: 'lock' | 'good' | 'mix' | 'edge' | 'longshot'
}

export function playoffStatus(t: Team): Status {
  const p = t.playoffPct
  if (p >= 90) return { label: 'Almost certainly in', blurb: 'Barring a collapse, this team is going to the playoffs.', tone: 'lock' }
  if (p >= 65) return { label: 'In good shape', blurb: 'On track for a playoff spot, but not locked in yet.', tone: 'good' }
  if (p >= 35) return { label: 'In the mix', blurb: 'Right in the thick of the race — could go either way.', tone: 'mix' }
  if (p >= 12) return { label: 'On the bubble', blurb: 'On the outside looking in, but still with a real shot.', tone: 'edge' }
  return { label: 'Long shot', blurb: 'Would need a hot streak and some help to sneak in.', tone: 'longshot' }
}

/** "3 games back" style helper, spelled out for newcomers. */
export function gamesBackText(t: Team, picture: Picture, teams: Record<string, Team>): string | null {
  if (picture.lastWildCardWins == null) return null
  const last = picture.wildCards[2] ? teams[picture.wildCards[2]] : null
  if (!last) return null
  // games back = ((theirW - myW) + (myL - theirL)) / 2
  const gb = (last.wins - t.wins + (t.losses - last.losses)) / 2
  if (gb <= 0) return 'In a playoff spot right now'
  const n = Math.round(gb * 10) / 10
  return `${n} game${n === 1 ? '' : 's'} behind the last playoff spot`
}

export function team(s: Standings, id: string | null): Team | null {
  return id ? (s.teams[id] ?? null) : null
}

// ---- the projected bracket, built from the seeds ----

export interface Matchup {
  round: 'wildcard' | 'division' | 'league' | 'world'
  topId: string | null // higher seed (or league champ slot)
  botId: string | null
  topSeed?: number
  botSeed?: number
  bye?: boolean
  label: string
}

export interface LeagueBracket {
  wildcard: Matchup[] // 3v6, 4v5
  division: Matchup[] // 1 vs (bye/wc), 2 vs (wc)
  league: Matchup // LCS
}

/** Seeded, "if the season ended today" bracket for one league. */
export function leagueBracket(picture: Picture): LeagueBracket {
  const s = picture.seeds
  return {
    wildcard: [
      { round: 'wildcard', topId: s[3] ?? null, botId: s[6] ?? null, topSeed: 3, botSeed: 6, label: '3 vs 6' },
      { round: 'wildcard', topId: s[4] ?? null, botId: s[5] ?? null, topSeed: 4, botSeed: 5, label: '4 vs 5' },
    ],
    division: [
      { round: 'division', topId: s[1] ?? null, botId: null, topSeed: 1, bye: true, label: 'Seed 1 (bye) vs 4/5 winner' },
      { round: 'division', topId: s[2] ?? null, botId: null, topSeed: 2, bye: true, label: 'Seed 2 (bye) vs 3/6 winner' },
    ],
    league: { round: 'league', topId: null, botId: null, label: 'League Championship' },
  }
}

export const TONE_COLOR: Record<Status['tone'], string> = {
  lock: '#15803d',
  good: '#65a30d',
  mix: '#ca8a04',
  edge: '#ea580c',
  longshot: '#94a3b8',
}
