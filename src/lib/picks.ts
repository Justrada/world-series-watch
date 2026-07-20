import type { Standings } from '../types'

export interface Picks {
  v: 1
  name: string
  alChamp: string | null
  nlChamp: string | null
  wsWinner: string | null
}

export const emptyPicks = (): Picks => ({ v: 1, name: '', alChamp: null, nlChamp: null, wsWinner: null })

const KEY = 'wsw26-picks'

export function loadPicks(): Picks {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...emptyPicks(), ...JSON.parse(raw) }
  } catch {
    /* fresh */
  }
  return emptyPicks()
}

export function savePicks(p: Picks): void {
  localStorage.setItem(KEY, JSON.stringify(p))
}

function b64url(s: string): string {
  return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function unb64url(s: string): string {
  return decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))))
}

export function encodePicks(p: Picks): string {
  return b64url(JSON.stringify({ n: p.name || undefined, a: p.alChamp, l: p.nlChamp, w: p.wsWinner }))
}

export function decodePicks(s: string): Picks | null {
  try {
    const o = JSON.parse(unb64url(s))
    const str = (v: unknown) => (typeof v === 'string' && /^\d+$/.test(v) ? v : null)
    return {
      v: 1,
      name: typeof o.n === 'string' ? o.n.slice(0, 40) : '',
      alChamp: str(o.a),
      nlChamp: str(o.l),
      wsWinner: str(o.w),
    }
  } catch {
    return null
  }
}

/** Which picks are still alive / already busted, once real playoff results exist. */
export function pickStanding(s: Standings, p: Picks) {
  // Mid-season: a pick is "eliminated" only if the team is mathematically out.
  // We approximate with playoff odds hitting 0; refined once October results land.
  const alive = (id: string | null) => {
    if (!id) return null
    const t = s.teams[id]
    if (!t) return null
    return t.playoffPct > 0
  }
  return { al: alive(p.alChamp), nl: alive(p.nlChamp), ws: alive(p.wsWinner) }
}
