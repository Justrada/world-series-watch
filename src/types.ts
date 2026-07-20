export type League = 'AL' | 'NL'
export type Division = 'East' | 'Central' | 'West'

export interface Team {
  id: string
  name: string
  shortName: string
  abbrev: string
  location: string
  nickname: string
  logo: string
  color: string
  altColor: string
  league: League
  division: Division
  wins: number
  losses: number
  winPct: number
  gamesPlayed: number
  gamesBehind: number
  divGamesBehind: number
  playoffSeed: number | null
  playoffPct: number
  divisionPct: number
  wildCardPct: number
  magicDivision: number | null
  magicWildcard: number | null
  streak: string
  lastTen: string
  runDiff: number
  runsFor: number
  runsAgainst: number
  home: string
  road: string
  clinched: boolean
}

export interface Picture {
  leaders: string[]
  wildCards: string[]
  inHunt: string[]
  seeds: Record<number, string>
  lastWildCardWins: number | null
  lastWildCardLosses: number | null
}

export interface Standings {
  generatedAt: string
  season: number
  teams: Record<string, Team>
  leagues: Record<League, Record<Division, string[]>>
  picture: Record<League, Picture>
}

export interface Game {
  id: string
  date: string
  status: 'pre' | 'in' | 'post'
  detail: string
  homeId: string | null
  awayId: string | null
  homeScore: number | null
  awayScore: number | null
  homeAbbr: string
  awayAbbr: string
}

export interface GamesBundle {
  generatedAt: string
  games: Game[]
}

export interface DataBundle {
  standings: Standings
  games: Game[]
}
